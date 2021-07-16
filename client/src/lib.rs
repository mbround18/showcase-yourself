mod components;
mod config;
mod utils;

use crate::config::{Config, MediaLink};
use crate::utils::promise;
use wasm_bindgen::prelude::*;
use yew::prelude::*;
use yew::services::ConsoleService;

pub enum IndexMsg {
    ConfigContent(Config),
}

#[derive(Properties, Clone, PartialEq)]
pub struct IndexProps {
    config_url: String,
}

#[derive(Clone)]
pub struct Index {
    config_url: String,
    config: Option<Config>,
    link: ComponentLink<Self>,
}

impl Index {
    fn load_config(url: String, callback: Callback<Config>) {
        wasm_bindgen_futures::spawn_local(promise(
            async move {
                match reqwest_wasm::get(&url).await {
                    Ok(response) => {
                        let config = response.json::<Config>().await.unwrap();
                        ConsoleService::log(&format!("Loading Profile: {}", &config.github));
                        config
                    }
                    Err(_) => Config::default(),
                }
            },
            callback,
        ));
    }
    fn render_links(&self, links: Vec<MediaLink>) -> Html {
        use crate::components::link::render;
        let links = html! {
            <div id={"links"} class="flex">
                { links.iter().map(|link| {
                    render(link)
                }).collect::<Html>() }
            </div>
        };
        links
    }
    fn render_content(&self) -> Html {
        let config = &self.config;
        match config {
            Some(c) => {
                use components::portrait::PortraitComponent;
                use components::profile::render as render_profile;
                let github = String::from(&c.github);
                let links = c.links.to_vec();
                let profile = c.profile.to_owned();
                let output = html! {
                    <div class="p-2 pb-4" >
                        <PortraitComponent github=github />
                        { render_profile(&profile) }
                        <hr class="p-4" />
                        { self.render_links(links) }
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
        let url = String::from(&props.config_url);
        let boxed_link = Box::from(link.clone());
        let callback = boxed_link.callback(IndexMsg::ConfigContent);
        Index::load_config(url, callback);
        Self {
            config_url: props.config_url,
            config: None,
            link,
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
        use components::footer;
        html! {
            <div class="w-full flex-col flex flex-center">
                <div
                    class="profile-card sm:w-auto md:w-4/5 lg:w-1/3 self-center"
                >
                    { self.render_content() }

                </div>
                { footer::render() }
            </div>
        }
    }
}

#[wasm_bindgen]
pub fn main(config_url: String) {
    yew::start_app_with_props::<Index>(IndexProps { config_url });
}
