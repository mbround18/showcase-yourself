use yew::prelude::*;
use yew::Properties;

pub enum Msg {}

#[derive(Properties, Clone, PartialEq)]
pub struct PortraitComponentProps {
    pub(crate) src: String,
}

pub struct PortraitComponent {
    // `ComponentLink` is like a reference to a component.
    // It can be used to send messages to the component
    link: ComponentLink<Self>,
    src: String,
}

impl Component for PortraitComponent {
    type Message = Msg;
    type Properties = PortraitComponentProps;

    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            link,
            src: props.src,
        }
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        if self.src != props.src {
            self.src = props.src;
            true
        } else {
            false
        }
    }

    fn view(&self) -> Html {
        let src = String::from(&self.src);
        html! {
            <div class="uk-card-media-top uk-align-center">
                <img class="profile-img" src=src alt="Profile Picture" />
            </div>
        }
    }
}
