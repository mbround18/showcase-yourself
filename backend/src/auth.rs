use actix_csrf::extractor::{Csrf, CsrfHeader};
use actix_session::{Session, SessionExt};
use actix_web::{
    FromRequest, HttpRequest, HttpResponse, Responder, dev::Payload, error::ErrorForbidden, web,
};
use futures_util::future::{Ready, ready};
use mongodb::{
    Client,
    bson::{DateTime, doc, to_bson},
};
use openidconnect::{
    AuthorizationCode, CsrfToken, Nonce, PkceCodeChallenge, PkceCodeVerifier, Scope, TokenResponse,
    core::CoreAuthenticationFlow,
};
use serde::{Deserialize, Serialize};

use crate::config::{AppConfig, ConfiguredOidcClient};
use crate::models::{Role, User};

pub async fn login(oidc: web::Data<ConfiguredOidcClient>, session: Session) -> impl Responder {
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    let (auth_url, csrf_token, nonce) = oidc
        .get_ref()
        .authorize_url(
            CoreAuthenticationFlow::AuthorizationCode,
            CsrfToken::new_random,
            Nonce::new_random,
        )
        .add_scope(Scope::new("email".to_string()))
        .add_scope(Scope::new("profile".to_string()))
        .set_pkce_challenge(pkce_challenge)
        .url();

    if session.insert("oauth_state", csrf_token.secret()).is_err()
        || session.insert("oauth_nonce", nonce.secret()).is_err()
        || session
            .insert("pkce_verifier", pkce_verifier.secret())
            .is_err()
    {
        return HttpResponse::InternalServerError().finish();
    }

    HttpResponse::Found()
        .append_header(("Location", auth_url.to_string()))
        .finish()
}

#[derive(Deserialize)]
pub struct CallbackQuery {
    code: String,
    state: String,
}

pub async fn callback(
    query: web::Query<CallbackQuery>,
    oidc: web::Data<ConfiguredOidcClient>,
    http_client: web::Data<openidconnect::reqwest::Client>,
    session: Session,
    mongo: web::Data<Client>,
    config: web::Data<AppConfig>,
) -> impl Responder {
    let expected_state: Option<String> = session.get("oauth_state").unwrap_or(None);
    let nonce_secret: Option<String> = session.get("oauth_nonce").unwrap_or(None);
    let verifier_secret: Option<String> = session.get("pkce_verifier").unwrap_or(None);

    session.remove("oauth_state");
    session.remove("oauth_nonce");
    session.remove("pkce_verifier");

    let (Some(expected_state), Some(nonce_secret), Some(verifier_secret)) =
        (expected_state, nonce_secret, verifier_secret)
    else {
        return HttpResponse::BadRequest().body("Missing OAuth session state");
    };

    if query.state != expected_state {
        return HttpResponse::BadRequest().body("Invalid OAuth state");
    }

    let nonce = Nonce::new(nonce_secret);
    let pkce_verifier = PkceCodeVerifier::new(verifier_secret);

    let exchange = oidc
        .get_ref()
        .exchange_code(AuthorizationCode::new(query.code.clone()));

    let token_response = match exchange
        .set_pkce_verifier(pkce_verifier)
        .request_async(http_client.get_ref())
        .await
    {
        Ok(t) => t,
        Err(e) => {
            return HttpResponse::BadRequest().body(format!("OAuth token exchange failed: {e}"));
        }
    };

    let id_token = match token_response.id_token() {
        Some(t) => t,
        None => return HttpResponse::BadRequest().body("No ID token returned"),
    };

    let claims = match id_token.claims(&oidc.get_ref().id_token_verifier(), &nonce) {
        Ok(c) => c,
        Err(e) => return HttpResponse::BadRequest().body(format!("Invalid ID token: {e}")),
    };

    let email = match claims.email() {
        Some(e) => e.as_str().to_string(),
        None => return HttpResponse::BadRequest().body("OAuth provider did not return an email"),
    };
    let subject = claims.subject().as_str().to_string();

    let role = resolve_role(&email, &config.owner_email);

    let collection = mongo.database("showcase").collection::<User>("users");
    let now = DateTime::now();
    let filter = doc! { "provider": "oidc", "subject": subject.as_str() };
    let existing = collection.find_one(filter.clone()).await.ok().flatten();

    let user_id = if let Some(existing) = existing {
        let _ = collection
            .update_one(
                filter,
                doc! { "$set": {
                    "email": &email,
                    "role": to_bson(&role).unwrap_or_default(),
                    "last_login_at": now,
                } },
            )
            .await;
        existing.id
    } else {
        let user = User {
            id: None,
            provider: "oidc".to_string(),
            subject,
            email: email.clone(),
            role,
            created_at: now,
            last_login_at: now,
        };
        match collection.insert_one(user).await {
            Ok(r) => r.inserted_id.as_object_id(),
            Err(_) => None,
        }
    };

    if session
        .insert("user_id", user_id.map(|id| id.to_hex()))
        .is_err()
        || session.insert("email", &email).is_err()
        || session.insert("role", role).is_err()
    {
        return HttpResponse::InternalServerError().finish();
    }

    let redirect_path = if role == Role::Owner { "/admin" } else { "/" };
    HttpResponse::Found()
        .append_header((
            "Location",
            format!("{}{}", config.frontend_url, redirect_path),
        ))
        .finish()
}

pub async fn logout(_csrf: Csrf<CsrfHeader>, session: Session) -> impl Responder {
    session.clear();
    HttpResponse::Ok().finish()
}

#[derive(Serialize)]
pub struct MeResponse {
    authenticated: bool,
    email: Option<String>,
    role: Option<Role>,
}

pub async fn me(session: Session) -> impl Responder {
    let email: Option<String> = session.get("email").unwrap_or(None);
    let role: Option<Role> = session.get("role").unwrap_or(None);

    HttpResponse::Ok().json(MeResponse {
        authenticated: email.is_some(),
        email,
        role,
    })
}

pub struct AdminUser {
    #[allow(dead_code)]
    pub email: String,
}

pub fn resolve_role(email: &str, owner_email: &str) -> Role {
    if email.eq_ignore_ascii_case(owner_email) {
        Role::Owner
    } else {
        Role::Visitor
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matching_email_is_owner() {
        assert_eq!(
            resolve_role("owner@example.com", "owner@example.com"),
            Role::Owner
        );
    }

    #[test]
    fn matching_email_is_case_insensitive() {
        assert_eq!(
            resolve_role("Owner@Example.com", "owner@example.com"),
            Role::Owner
        );
    }

    #[test]
    fn mismatched_email_is_visitor() {
        assert_eq!(
            resolve_role("someone@else.com", "owner@example.com"),
            Role::Visitor
        );
    }
}

impl FromRequest for AdminUser {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut Payload) -> Self::Future {
        let session = req.get_session();
        let role: Option<Role> = session.get("role").unwrap_or(None);
        let email: Option<String> = session.get("email").unwrap_or(None);

        match (role, email) {
            (Some(Role::Owner), Some(email)) => ready(Ok(AdminUser { email })),
            _ => ready(Err(ErrorForbidden("Owner access required"))),
        }
    }
}
