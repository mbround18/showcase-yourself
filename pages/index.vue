<template>
  <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-align-center">
    <div class="uk-card-media-top uk-align-center">
      <img class="pure-img" :data-src="avatar_url" alt="Profile Picture" srcset uk-img />
    </div>

    <h1 class="uk-card-title">{{name}}</h1>
    <h2>{{profile.tag_line}}</h2>
    <p v-if="profile.actively_looking">{{profile.looking_for.join(", ")}}</p>
    <p>{{profile.skills.join(", ")}}</p>

    <div class="uk-card-badge" v-for="link in links" v-bind:key="link.username">
      <a target="_blank" :href="link.url">
        <img
          :src="`~/assets/${link.logo.toLowerCase()}.png`"
          :alt="`${link.logo}@${link.username}`"
          srcset
        />
      </a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { merge, uniq, get } from "lodash";

export default {
  async asyncData({ params }) {
    const profile = {
      name: "Name Unknown",
      github: "octocat",
      profile: {
        tag_line: "Sunny Beaches",
        summary: "",
        actively_looking: false,
        looking_for: [],
        skills: [],
      },
      links: [],
    };
    try {
      const { data } = await axios.get(`${process.env.baseUrl}/config.json`);
      const {
        data: { avatar_url },
      } = await axios.get(`https://api.github.com/users/${data.github}`);
      const skills = uniq(get(data, "profile.skills", []));
      return merge(data, {
        avatar_url,
        profile: { skills },
      });
    } catch (error) {
      return profile;
    }
  },
};
</script>

<style lang="scss">
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

html {
  background-color: #202020;
}

.uk-card {
  background-color: #3a3a3a;
  h1.uk-card-title {
    color: magenta;
    font-family: monaco, Consolas, Lucida Console, monospace;
    font-weight: bold;
  }
  h2,
  p,
  span {
    color: white;
  }
}

body {
  // background-color: darkslategray;
  line-height: 1.7em;
  font-size: 13px;
  h1 {
    text-transform: capitalize;
  }
}
</style>