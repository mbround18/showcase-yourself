pub mod github;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Config {
    pub(crate) name: String,
    pub(crate) github: String,
    pub(crate) profile: Profile,
    pub(crate) links: Vec<MediaLink>,
}

impl Default for Config {
    fn default() -> Config {
        Config {
            name: "Michael Bruno".to_string(),
            github: "mbround18".to_string(),
            profile: Profile::default(),
            links: vec![],
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Profile {
    pub(crate) tag_line: String,
    pub(crate) summary: String,
    pub(crate) actively_looking: bool,
    pub(crate) looking_for: Vec<String>,
    pub(crate) skills: Vec<String>,
}

impl Default for Profile {
    fn default() -> Profile {
        Profile {
            tag_line: String::from("Away at Cannon Beach <3"),
            summary: "".to_string(),
            actively_looking: false,
            looking_for: vec![],
            skills: vec![],
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct MediaLink {
    pub(crate) active: bool,
    pub(crate) username: String,
    pub(crate) url: String,
    pub(crate) logo: String,
}
