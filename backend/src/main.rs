use actix_web::{web, App, HttpServer};
use mongodb::Client;
use std::env;
use dotenv::dotenv;
use actix_csrf::CsrfMiddleware;
use actix_governor::{Governor, GovernorConfigBuilder};
use rand::rngs::StdRng;

mod models;
mod contact;
mod csrf;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let client = Client::with_uri_str(&database_url).await.expect("Failed to connect to database");

    let governor_conf = GovernorConfigBuilder::default()
        .seconds_per_request(2)
        .burst_size(5)
        .finish()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(CsrfMiddleware::<StdRng>::new())
            .wrap(Governor::new(&governor_conf))
            .app_data(web::Data::new(client.clone()))
            .route("/csrf", web::get().to(csrf::get_csrf))
            .route("/contact", web::post().to(contact::contact))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
