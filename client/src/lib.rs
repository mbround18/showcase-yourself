mod components;
mod config;
mod utils;

use crate::config::{Config, MediaLink};
use crate::utils::promise;
use wasm_bindgen::prelude::*;
use weblog::console_log;
use yew::prelude::*;

pub enum IndexMsg {
    ConfigContent(Config),
}

#[derive(Properties, Clone, PartialEq)]
pub struct IndexProps {
    config_url: String,
}

#[derive(Clone)]
pub struct Index {
    #[allow(dead_code)]
    config_url: String,
    config: Option<Config>,
}

impl Index {
    fn load_config(url: String, callback: Callback<Config>) {
        wasm_bindgen_futures::spawn_local(promise(
            async move {
                match reqwest_wasm::get(&url).await {
                    Ok(response) => {
                        let config = response.json::<Config>().await.unwrap();
                        console_log!(&format!("Loading Profile: {}", &config.github));
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
                let github = String::from(&c.github);
                let links = c.links.to_vec();
                let profile = c.profile.to_owned();
                let output = html! {
                    <div class="p-2 pb-4" >
                        <components::portrait::PortraitComponent {github} />
                        { components::profile::render(&profile) }
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

    fn create(ctx: &Context<Self>) -> Self {
        let props = ctx.props();
        let link = ctx.link();
        let url = String::from(&props.config_url);
        let boxed_link = Box::from(link.clone());
        let callback = boxed_link.callback(IndexMsg::ConfigContent);
        Index::load_config(url, callback);
        Self {
            config_url: String::from(&props.config_url),
            config: None,
        }
    }

    fn update(&mut self, _ctx: &Context<Self>, msg: Self::Message) -> bool {
        use IndexMsg::ConfigContent;
        match msg {
            ConfigContent(config) => {
                console_log!("Update triggered, setting config");
                self.config = Option::Some(config);
                true
            }
        }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
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
    yew::Renderer::<Index>::with_props(IndexProps { config_url }).render();
}
