import Vue from "vue";
import axios from "axios";
import { merge, uniq, get } from "lodash";

export default Vue.extend({
  name: "Index",
  methods: {
    loadImage(name: string) {
      const images = {
        linkedin: require("../assets/linkedin.png"),
        github: require("../assets/github.png"),
        discord: require("../assets/discord.png"),
        gitlab: require("../assets/gitlab.png")
      };
      return get(images, name.toLowerCase(), require("../assets/generic.svg"));
    },
    async loadConfig() {
      const { data } = await axios.get(`${process.env.configUrl}`);
      const skills = uniq(get(data, "profile.skills", []));
      merge(this, data, { profile: { skills }});
    },
    async fetchAvatarUrl() {
      const githubApiUrl = `https://api.github.com/users/${this.github}`;
      const { data: { avatar_url } } = await axios.get(githubApiUrl);
      this.avatar_url = avatar_url;
    }
  },
  data: () => ({
    name: "Loading...",
    github: "octocat",
    avatar_url: "",
    profile: {
      tag_line: "Away @ Cannon Beach",
      summary: "",
      actively_looking: false,
      looking_for: [  ],
      skills: []
    },
    links: []
  }),
  mounted() {
    console.debug("[Index]: Loaded.");
    this.loadConfig()
      .then(this.fetchAvatarUrl);
  }
});
