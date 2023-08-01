use crate::config::MediaLink;
use crate::console_log;
use yew::prelude::*;

pub fn render(link: &MediaLink) -> Html {
    let src = format!("assets/img/{}.png", &link.logo.to_lowercase());
    console_log!(format!("Loading image: {}", &src));
    let href = String::from(&link.url);
    let alt = String::from(&link.logo);

    let link_html = html! {
        <a class="flex w-full justify-center h-20 pulse rounded-full object-contain m-2" {href} target="_blank">
            <img {src} {alt} />
        </a>
    };
    link_html
}
