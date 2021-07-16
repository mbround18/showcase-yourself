use crate::config::github::GithubUser;
use crate::utils::promise;
use yew::prelude::*;
use yew::services::ConsoleService;
use yew::Properties;

pub enum Msg {
    LoadedImage(String),
}

#[derive(Properties, Clone, PartialEq)]
pub struct PortraitComponentProps {
    pub(crate) github: String,
    pub(crate) src: Option<String>,
}

pub struct PortraitComponent {
    // `ComponentLink` is like a reference to a component.
    // It can be used to send messages to the component
    // link: ComponentLink<Self>,
    github: String,
    src: String,
}

impl PortraitComponent {
    fn load_github_profile(url: String, callback: Callback<String>) {
        wasm_bindgen_futures::spawn_local(promise(
            async move {
                let client = reqwest_wasm::Client::new();
                ConsoleService::log(&format!("Fetching User from: {}", &url));
                match client
                    .get(&url)
                    .header("Accept", "application/vnd.github.v3+json")
                    .send()
                    .await
                {
                    Ok(response) => {
                        let user = response.json::<GithubUser>().await.unwrap();
                        ConsoleService::log(&format!(
                            "Loading GitHub Avatar: {}",
                            &user.avatar_url
                        ));
                        user.avatar_url
                    }
                    Err(err) => {
                        ConsoleService::error(&err.to_string());
                        String::from("assets/img/loading.gif")
                    }
                }
            },
            callback,
        ));
    }
}

impl Component for PortraitComponent {
    type Message = Msg;
    type Properties = PortraitComponentProps;

    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        let url = format!(" https://api.github.com/users/{}", &props.github);
        PortraitComponent::load_github_profile(url, link.callback(Msg::LoadedImage));
        Self {
            // link,
            github: props.github,
            src: String::from("assets/img/loader.gif"),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::LoadedImage(image) => {
                self.src = image;
                true
            }
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        if let Some(src) = props.src {
            self.src = src
        }

        if self.github != props.github {
            self.github = props.github;
            true
        } else {
            false
        }
    }

    fn view(&self) -> Html {
        let src = String::from(&self.src);
        html! {
            <div class="flex-col flex flex-center w-full">
                <div>
                    <img class="h-80 w-80 md:h-auto md:w-auto" src=src alt="Profile Picture" />
                </div>
            </div>
        }
    }
}
