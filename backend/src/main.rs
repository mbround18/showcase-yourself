use actix_cors::Cors;
use actix_csrf::CsrfMiddleware;
use actix_csrf::extractor::CsrfHeaderConfig;
use actix_governor::{Governor, GovernorConfigBuilder};
use actix_session::{SessionMiddleware, storage::CookieSessionStore};
use actix_web::cookie::{Key, SameSite};
use actix_web::http::header::HeaderName;
use actix_web::{App, HttpServer, web};
use dotenv::dotenv;
use mongodb::Client;
use openidconnect::core::{CoreClient, CoreProviderMetadata};
use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use rand::rngs::StdRng;
use std::env;
use std::net::ToSocketAddrs;

mod admin;
mod auth;
mod config;
mod contact;
mod csrf;
mod models;
mod showcase;

use config::AppConfig;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let client = Client::with_uri_str(&database_url)
        .await
        .expect("Failed to connect to database");

    let app_config = AppConfig::from_env();

    let session_secret = env::var("SESSION_SECRET").expect("SESSION_SECRET must be set");
    let session_key = Key::derive_from(session_secret.as_bytes());
    let session_cookie_secure = env::var("SESSION_COOKIE_SECURE")
        .map(|v| v == "true")
        .unwrap_or(true);

    let oidc_issuer_url =
        IssuerUrl::new(env::var("OIDC_ISSUER_URL").expect("OIDC_ISSUER_URL must be set"))
            .expect("OIDC_ISSUER_URL must be a valid URL");
    let oidc_client_id =
        ClientId::new(env::var("OIDC_CLIENT_ID").expect("OIDC_CLIENT_ID must be set"));
    let oidc_client_secret =
        ClientSecret::new(env::var("OIDC_CLIENT_SECRET").expect("OIDC_CLIENT_SECRET must be set"));
    let oidc_redirect_url =
        RedirectUrl::new(env::var("OIDC_REDIRECT_URL").expect("OIDC_REDIRECT_URL must be set"))
            .expect("OIDC_REDIRECT_URL must be a valid URL");

    let mut oidc_http_client_builder = openidconnect::reqwest::ClientBuilder::new()
        .redirect(openidconnect::reqwest::redirect::Policy::none());

    // Dev/local escape hatch: when the OIDC issuer's hostname (as seen by both
    // the browser and this backend, for issuer-consistency) isn't directly
    // routable from inside this container -- e.g. a dockerized IdP published
    // only on the host's "localhost" -- resolve that hostname to a reachable
    // address instead. The URL's own port is always used, so only the host
    // needs to resolve correctly. Unset in production against a real IdP.
    if let Ok(domain) = env::var("OIDC_RESOLVE_DOMAIN") {
        let via = env::var("OIDC_RESOLVE_VIA")
            .expect("OIDC_RESOLVE_VIA must be set when OIDC_RESOLVE_DOMAIN is set");
        let addr = (via.as_str(), 0u16)
            .to_socket_addrs()
            .unwrap_or_else(|_| panic!("Failed to resolve OIDC_RESOLVE_VIA={via}"))
            .next()
            .unwrap_or_else(|| panic!("No address found for OIDC_RESOLVE_VIA={via}"));
        oidc_http_client_builder = oidc_http_client_builder.resolve(&domain, addr);
    }

    let oidc_http_client = oidc_http_client_builder
        .build()
        .expect("Failed to build OIDC HTTP client");

    let provider_metadata =
        CoreProviderMetadata::discover_async(oidc_issuer_url, &oidc_http_client)
            .await
            .expect("Failed to discover OIDC provider metadata");

    let auth_url = provider_metadata.authorization_endpoint().clone();
    let token_url = provider_metadata
        .token_endpoint()
        .cloned()
        .expect("OIDC provider metadata is missing a token_endpoint");
    let userinfo_url = provider_metadata
        .userinfo_endpoint()
        .cloned()
        .expect("OIDC provider metadata is missing a userinfo_endpoint");

    let oidc_client = CoreClient::from_provider_metadata(
        provider_metadata,
        oidc_client_id,
        Some(oidc_client_secret),
    )
    .set_redirect_uri(oidc_redirect_url)
    .set_auth_uri(auth_url)
    .set_token_uri(token_url)
    .set_user_info_url(userinfo_url);

    // A single page render can fire several API calls (auth check, CSRF token,
    // page data), so the limit needs headroom for real browsing, not just a
    // single request -- this still meaningfully throttles scripted abuse.
    let governor_conf = GovernorConfigBuilder::default()
        .requests_per_second(10)
        .burst_size(20)
        .finish()
        .unwrap();

    let frontend_url = app_config.frontend_url.clone();
    let showcase_content_path = env::var("SHOWCASE_CONTENT_PATH")
        .unwrap_or_else(|_| "/etc/showcase/showcase.json".to_string());

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&frontend_url)
            .allow_any_method()
            .allow_any_header()
            .supports_credentials();

        let mut csrf_middleware =
            CsrfMiddleware::<StdRng>::new().set_cookie(actix_web::http::Method::GET, "/csrf");
        if !session_cookie_secure {
            // The default `__Host-` prefixed cookie name requires `Secure`, which
            // browsers refuse to store over plain HTTP -- relax it for local dev.
            csrf_middleware = csrf_middleware
                .secure(false)
                .cookie_name("csrf-token")
                .same_site(Some(SameSite::Lax));
        }

        App::new()
            .app_data(csrf_middleware.cookie_config())
            .app_data(CsrfHeaderConfig::new(HeaderName::from_static(
                "x-csrf-token",
            )))
            .wrap(csrf_middleware)
            .wrap(
                SessionMiddleware::builder(CookieSessionStore::default(), session_key.clone())
                    .cookie_http_only(true)
                    .cookie_secure(session_cookie_secure)
                    .cookie_same_site(SameSite::Lax)
                    .build(),
            )
            .wrap(Governor::new(&governor_conf))
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(oidc_client.clone()))
            .app_data(web::Data::new(oidc_http_client.clone()))
            .app_data(web::Data::new(AppConfig {
                owner_email: app_config.owner_email.clone(),
                frontend_url: app_config.frontend_url.clone(),
            }))
            .app_data(web::Data::new(showcase_content_path.clone()))
            .route("/csrf", web::get().to(csrf::get_csrf))
            .route("/showcase", web::get().to(showcase::get_showcase))
            .route("/contact", web::post().to(contact::contact))
            .route("/auth/login", web::get().to(auth::login))
            .route("/auth/callback", web::get().to(auth::callback))
            .route("/auth/logout", web::post().to(auth::logout))
            .route("/auth/me", web::get().to(auth::me))
            .route("/admin/contacts", web::get().to(admin::list_contacts))
            .route("/admin/contacts/{id}", web::get().to(admin::get_contact))
            .route(
                "/admin/contacts/{id}",
                web::patch().to(admin::update_contact_status),
            )
            .route(
                "/admin/contacts/{id}",
                web::delete().to(admin::delete_contact),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
