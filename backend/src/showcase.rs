use actix_web::{HttpResponse, Responder, web};
use std::fs;

/// Serves the site's profile content (name, skills, links, experience, ...)
/// from a file on disk, re-read on every request. The image bakes in a
/// default at this path; in k8s a ConfigMap volume mounted over the same
/// path overrides it per deployment, and edits propagate without a pod
/// restart since we never cache the contents.
pub async fn get_showcase(path: web::Data<String>) -> impl Responder {
    match fs::read(path.get_ref()) {
        Ok(bytes) => HttpResponse::Ok()
            .content_type("application/json")
            .body(bytes),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
