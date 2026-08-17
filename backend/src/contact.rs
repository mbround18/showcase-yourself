use actix_web::{web, HttpResponse, Responder};
use mongodb::Client;
use crate::models::Contact;

pub async fn contact(contact: web::Json<Contact>, client: web::Data<Client>) -> impl Responder {
    let collection = client.database("showcase").collection("contacts");
    let result = collection.insert_one(contact.into_inner()).await;
    match result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
