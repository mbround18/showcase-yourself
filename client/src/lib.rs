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
    fn render_content(&self) -> Html {
        let config = &self.config;
        match config {
            Some(c) => {
                use components::portrait::PortraitComponent;
                let content = format!("{} is currently rebuilding this website!", c.github);
                ConsoleService::log(&content);
                let github = String::from(&c.github);
                let output = html! {
                    <div class="p-2" >
                        <PortraitComponent github=github />
                        <h1 class="p8">{ content }</h1>
                        <p class="wrap"> {
                            "This website is being rebuilt using WebAssembly through Rust+Yew <3
                            Almost there with rebuilding, the data is present and now just need to get the looks right.
                            For those of you who are tech savvy, you can inspect and see the new wasm files loaded! :)
                            "
                        }</p>
                        <a target="_blank" class="text-blue-700 underline" href="https://www.linkedin.com/in/michael-a-bruno/">{ "Click here for LinkedIn" }</a>
                        <img class="pb-4" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F01%2F20%2F10%2F52%2Fmaintenance-1151312_960_720.png&f=1&nofb=1" />
                    </div>
                };
                output
            }
            None => {
                let output = html! {
                    <div>
                        <image src="assets/img/loading.gif" />
                        <p>{ "Shwifty" }</p>
                    </div>
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
                    { self.render_content() }

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
