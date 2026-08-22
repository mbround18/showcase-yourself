use openidconnect::{EndpointNotSet, EndpointSet, core::CoreClient};
use std::env;

pub type ConfiguredOidcClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointSet,
    EndpointSet,
>;

pub struct AppConfig {
    pub owner_email: String,
    pub frontend_url: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        AppConfig {
            owner_email: env::var("OWNER_EMAIL_ADDRESS").expect("OWNER_EMAIL_ADDRESS must be set"),
            frontend_url: env::var("FRONTEND_URL").expect("FRONTEND_URL must be set"),
        }
    }
}
