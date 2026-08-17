use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Contact {
    pub name: String,
    pub email: String,
    pub message: String,
}
