use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct GithubUser {
    pub(crate) login: String,
    pub(crate) avatar_url: String,
}
