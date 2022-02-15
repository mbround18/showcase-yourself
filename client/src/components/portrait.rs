use crate::config::github::GithubUser;
use crate::utils::promise;
use weblog::{console_error, console_log};
use yew::prelude::*;

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
                console_log!(&format!("Fetching User from: {}", &url));
                match client
                    .get(&url)
                    .header("Accept", "application/vnd.github.v3+json")
                    .send()
                    .await
                {
                    Ok(response) => {
                        let user = response.json::<GithubUser>().await.unwrap();
                        console_log!(&format!("Loading GitHub Avatar: {}", &user.avatar_url));
                        user.avatar_url
                    }
                    Err(err) => {
                        console_error!(&err.to_string());
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

    fn create(ctx: &Context<Self>) -> Self {
        let props = ctx.props();
        let url = format!(" https://api.github.com/users/{}", &props.github);
        PortraitComponent::load_github_profile(url, ctx.link().callback(Msg::LoadedImage));
        Self {
            // link,
            github: props.github.clone(),
            src: String::from("assets/img/loader.gif"),
        }
    }

    fn update(&mut self, _ctx: &Context<Self>, msg: Self::Message) -> bool {
        match msg {
            Msg::LoadedImage(image) => {
                self.src = image;
                true
            }
        }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        let src = String::from(&self.src);
        html! {
            <div class="flex-col flex flex-center w-full">
                <div>
                    <img class="h-80 w-80 md:h-auto md:w-auto" {src} alt="Profile Picture" />
                </div>
            </div>
        }
    }

    fn rendered(&mut self, ctx: &Context<Self>, _first_render: bool) {
        let props = ctx.props();
        if let Some(src) = &props.src {
            self.src = src.clone()
        }

        if self.github != props.github {
            self.github = String::from(&props.github);
        }
    }
}
