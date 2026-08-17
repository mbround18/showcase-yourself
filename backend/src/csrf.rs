use actix_csrf::extractor::CsrfToken;
use actix_web::{HttpResponse, Responder};

pub async fn get_csrf(token: CsrfToken) -> impl Responder {
    HttpResponse::Ok().json(token.get())
}
