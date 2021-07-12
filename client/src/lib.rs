mod components;
mod config;
mod utils;

use wasm_bindgen::prelude::*;
use yew::prelude::*;
use crate::config::{Config, Profile};
use yew::services::ConsoleService;
use crate::utils::wrap;

pub enum IndexMsg {
    ConfigContent(Config)
}

#[derive(Properties, Clone, PartialEq)]
pub struct IndexProps {
    config_url: String
}

#[derive(Clone)]
pub struct Index {
    config_url: String,
    config: Option<Config>,
    link: ComponentLink<Self>
}

impl Index {
    fn load_config(url: String, callback: Callback<Config>) {
        wasm_bindgen_futures::spawn_local(wrap( async move {
            match reqwest_wasm::get(&url).await {
                Ok(response) => {
                    let config = response.json::<Config>().await.unwrap();
                    ConsoleService::log(&format!("Loading Profile: {}", &config.github));
                    config
                }
                Err(_) => {
                    Config::default()
                }
            }
        }, callback));
    }
    fn render_message(&self) -> Html {
        let config = &self.config;
        match config {
            Some(c) => {
                let content = format!("{} is currently rebuilding this website!", c.github);
                ConsoleService::log(&content);
                let output = html! {
                    <>
                        <h1 class="p8">{ content }</h1>
                        <p> {
                            "This website is being rebuilt using WebAssembly through Rust+Yew <3"
                        }</p>
                    </>
                };
                output
            }
            None => {
                let output = html! {
                    <p>{ "Shwifty" }</p>
                };
                output
            }
        }
    }
}


impl Component for Index {
    type Message = IndexMsg;
    type Properties = IndexProps;

    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        let url = String::from(&props.config_url.clone());
        let boxed_link = Box::from(link.clone());
        let callback= boxed_link.callback(IndexMsg::ConfigContent);
        Index::load_config(url, callback);
        Self {
            config_url: props.config_url,
            config: None,
            link
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        use IndexMsg::ConfigContent;
        match msg {
            ConfigContent(config) => {
                ConsoleService::log("Update triggered, setting config");
                self.config = Option::Some(config);
                true
            }
        }
    }

    fn change(&mut self, _props: Self::Properties) -> ShouldRender {
        // Should only return "true" if new properties are different to
        // previously received properties.
        // This component has no properties so we will always return "false".
        false
    }

    fn view(&self) -> Html {
        use components::{footer, portrait::PortraitComponent};
        html! {
            <>
                <div
                    class="profile-card sm:w-auto md:w-4/5 lg:w-1/3 "
                >
                    <PortraitComponent src="https://avatars.githubusercontent.com/u/12646562?s=400&u=d3cc1541c96eba24a7c79101bb9c3b5ba71ece7b&v=4" />
                    { self.render_message() }

                </div>
                { footer::render() }
            </>
        }
    }
}

#[wasm_bindgen]
pub fn main(config_url: String) {
    yew::start_app_with_props::<Index>(IndexProps {
        config_url
    });
}
