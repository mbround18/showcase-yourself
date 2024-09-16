use crate::config::Profile;
use yew::prelude::*;
use yew::Html;

pub fn render(profile: &Profile) -> Html {
    let output = html! {
        <div id="profile" class="p-4">
            <label for="tagline" class="text-lg font-bold italic">{"Tagline"}</label>
            <h1 id="tagline">{ &profile.tag_line }</h1>
            <div id="summary">
                { if ! profile.summary.is_empty() {
                    html! {
                        <>
                            <h2 class="text-lg font-bold italic">{"Summary"}</h2>
                            <p class="wrap">{ &profile.summary }</p>
                        </>
                    }
                }  else {
                    html! {}
                } }
            </div>
            <div id="actively-looking">
                {  if profile.actively_looking {
                  html! {
                    <>
                        <label for="actively-looking" class="text-lg font-bold italic">{"Actively Looking!"}</label>
                        <h3 id="actively-looking">{"Hey! I am actively looking for work! If you think I fit what you are looking for, please reach out via LinkedIn!"}</h3>
                        <label for="looking-for" class="text-lg font-bold italic">{"Looking For"}</label>
                        <ul id="looking-for">
                            { profile.looking_for.iter().map(|position| {
                                html! {
                                    <li>{ position }</li>
                                }
                            }).collect::<Html>() }
                        </ul>
                    </>
                  }
                } else {
                  html! { }
                } }
            </div>
            <div id="skills">
                <label for="skill-list" class="text-lg font-bold italic">{"Skills"}</label>
                <ul id="skill-list">{
                    profile.skills.iter().map(|skill| {
                        html! {
                            <li>{ skill }</li>
                        }
                    }).collect::<Html>() }
                </ul>
            </div>
        </div>
    };
    output
}
