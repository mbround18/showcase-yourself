use crate::config::MediaLink;
use yew::prelude::*;

pub fn render(link: &MediaLink) -> Html {
    let src = format!("assets/img/{}.png", &link.logo);
    let url = String::from(&link.url);
    let logo = String::from(&link.logo);

    let link_html = html! {
        <a class="flex w-full justify-center h-20" href=url target="_blank">
            <img src=src alt=logo />
        </a>
    };
    link_html
}
