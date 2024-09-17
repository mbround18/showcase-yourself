use crate::config::github::GithubUser;
use crate::utils::promise;
use yew::prelude::*;

#[derive(Clone, PartialEq, Properties)]
pub struct PortraitComponentProps {
    pub(crate) github: String,
    pub(crate) src: Option<String>,
}

#[function_component(PortraitComponent)]
pub fn portrait_component(props: &PortraitComponentProps) -> Html {
    let src = use_state(|| {
        props
            .src
            .clone()
            .unwrap_or_else(|| String::from("assets/img/loader.gif"))
    });

    {
        let github = props.github.clone();
        let src = src.clone();
        yew::use_effect_with(github, move |github| {
            let url = format!("https://api.github.com/users/{}", github);
            let callback = Callback::from(move |image: String| {
                src.set(image);
            });
            PortraitComponent::load_github_profile(url, callback);
            || ()
        });
    }

    html! {
        <div class="flex-col flex flex-center w-full">
            <div>
                <img class="h-80 w-80 md:h-auto md:w-auto" src={(*src).clone()} alt="Profile Picture" />
            </div>
        </div>
    }
}

impl PortraitComponent {
    fn load_github_profile(url: String, callback: Callback<String>) {
        wasm_bindgen_futures::spawn_local(promise(
            async move {
                let client = reqwest_wasm::Client::new();
                match client
                    .get(&url)
                    .header("Accept", "application/vnd.github.v3+json")
                    .send()
                    .await
                {
                    Ok(response) => {
                        let user = response.json::<GithubUser>().await.unwrap();
                        user.avatar_url
                    }
                    Err(_err) => String::from("assets/img/loading.gif"),
                }
            },
            callback,
        ));
    }
}
