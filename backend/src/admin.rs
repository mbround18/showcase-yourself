use actix_csrf::extractor::{Csrf, CsrfHeader};
use actix_web::{HttpResponse, Responder, web};
use futures_util::TryStreamExt;
use mongodb::{
    Client,
    bson::{DateTime, doc, oid::ObjectId},
};
use serde::Deserialize;

use crate::auth::AdminUser;
use crate::models::{Contact, ContactStatus, ContactView, UpdateContactStatus};

#[derive(Deserialize)]
pub struct ListQuery {
    status: Option<ContactStatus>,
}

pub async fn list_contacts(
    _admin: AdminUser,
    mongo: web::Data<Client>,
    query: web::Query<ListQuery>,
) -> impl Responder {
    let collection = mongo.database("showcase").collection::<Contact>("contacts");
    let filter = match &query.status {
        Some(status) => doc! { "status": mongodb::bson::to_bson(status).unwrap_or_default() },
        None => doc! {},
    };

    let cursor = match collection
        .find(filter)
        .sort(doc! { "created_at": -1 })
        .await
    {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    match cursor.try_collect::<Vec<Contact>>().await {
        Ok(contacts) => {
            let views: Vec<ContactView> = contacts.into_iter().map(ContactView::from).collect();
            HttpResponse::Ok().json(views)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn get_contact(
    _admin: AdminUser,
    mongo: web::Data<Client>,
    path: web::Path<String>,
) -> impl Responder {
    let Ok(id) = ObjectId::parse_str(path.as_str()) else {
        return HttpResponse::BadRequest().finish();
    };

    let collection = mongo.database("showcase").collection::<Contact>("contacts");
    match collection.find_one(doc! { "_id": id }).await {
        Ok(Some(contact)) => HttpResponse::Ok().json(ContactView::from(contact)),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn update_contact_status(
    _admin: AdminUser,
    _csrf: Csrf<CsrfHeader>,
    mongo: web::Data<Client>,
    path: web::Path<String>,
    body: web::Json<UpdateContactStatus>,
) -> impl Responder {
    let Ok(id) = ObjectId::parse_str(path.as_str()) else {
        return HttpResponse::BadRequest().finish();
    };

    let collection = mongo.database("showcase").collection::<Contact>("contacts");
    let update = doc! { "$set": {
        "status": mongodb::bson::to_bson(&body.status).unwrap_or_default(),
        "updated_at": DateTime::now(),
    } };

    match collection.update_one(doc! { "_id": id }, update).await {
        Ok(result) if result.matched_count == 0 => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn delete_contact(
    _admin: AdminUser,
    _csrf: Csrf<CsrfHeader>,
    mongo: web::Data<Client>,
    path: web::Path<String>,
) -> impl Responder {
    let Ok(id) = ObjectId::parse_str(path.as_str()) else {
        return HttpResponse::BadRequest().finish();
    };

    let collection = mongo.database("showcase").collection::<Contact>("contacts");
    match collection.delete_one(doc! { "_id": id }).await {
        Ok(result) if result.deleted_count == 0 => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
