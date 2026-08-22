use actix_csrf::extractor::{Csrf, CsrfHeader};
use actix_session::Session;
use actix_web::{HttpResponse, Responder, web};
use mongodb::{
    Client,
    bson::{DateTime, oid::ObjectId},
};

use crate::models::{Contact, ContactStatus, ContactSubmission};

pub async fn contact(
    _csrf: Csrf<CsrfHeader>,
    submission: web::Json<ContactSubmission>,
    client: web::Data<Client>,
    session: Session,
) -> impl Responder {
    let submitted_by: Option<String> = session.get("user_id").unwrap_or(None);
    let submitted_by = submitted_by.and_then(|id| ObjectId::parse_str(&id).ok());

    let now = DateTime::now();
    let contact = Contact {
        id: None,
        name: submission.name.clone(),
        email: submission.email.clone(),
        message: submission.message.clone(),
        status: ContactStatus::New,
        submitted_by,
        created_at: now,
        updated_at: now,
    };

    let collection = client
        .database("showcase")
        .collection::<Contact>("contacts");
    let result = collection.insert_one(contact).await;
    match result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
