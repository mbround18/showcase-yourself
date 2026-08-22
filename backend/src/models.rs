use mongodb::bson::{DateTime, oid::ObjectId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Role {
    Owner,
    Visitor,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub provider: String,
    pub subject: String,
    pub email: String,
    pub role: Role,
    pub created_at: DateTime,
    pub last_login_at: DateTime,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ContactStatus {
    New,
    Lead,
    InContact,
    Archived,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ContactSubmission {
    pub name: String,
    pub email: String,
    pub message: String,
}

/// The database representation of a contact submission. Mongo I/O only --
/// datetimes and ids round-trip as native BSON types here. For API responses,
/// convert to `ContactView`, which serializes those as plain strings.
#[derive(Debug, Serialize, Deserialize)]
pub struct Contact {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub email: String,
    pub message: String,
    pub status: ContactStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub submitted_by: Option<ObjectId>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Serialize)]
pub struct ContactView {
    #[serde(rename = "_id")]
    pub id: String,
    pub name: String,
    pub email: String,
    pub message: String,
    pub status: ContactStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub submitted_by: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Contact> for ContactView {
    fn from(c: Contact) -> Self {
        ContactView {
            id: c.id.map(|id| id.to_hex()).unwrap_or_default(),
            name: c.name,
            email: c.email,
            message: c.message,
            status: c.status,
            submitted_by: c.submitted_by.map(|id| id.to_hex()),
            created_at: c.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: c.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateContactStatus {
    pub status: ContactStatus,
}
