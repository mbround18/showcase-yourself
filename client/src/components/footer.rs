use yew::prelude::*;
use yew::Html;

pub fn render() -> Html {
    let output = html! {
        <footer>
            <hr />
            <p>
                <a
                    href="https://github.com/mbround18/showcase-yourself"
                    target="_blank"
                >
                { "Check this project out on Github!" }
                </a>
            </p>
        </footer>
    };
    output
}
