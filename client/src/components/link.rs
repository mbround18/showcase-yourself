use crate::config::MediaLink;
use yew::prelude::*;

pub fn render(link: &MediaLink) -> Html {
    let src = format!("assets/img/{}.png", &link.logo.to_lowercase());
    let href = String::from(&link.url);
    let alt = String::from(&link.logo);

    let link_html = html! {
        <a class="flex w-full justify-center h-20 pulse rounded-full object-contain m-2" {href} target="_blank">
            <img {src} {alt} />
        </a>
    };
    link_html
}
