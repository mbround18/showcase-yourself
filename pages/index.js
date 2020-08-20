import axios from "axios";
import { merge, uniq, get } from "lodash";

export default {
  methods: {
    // TODO: Refactor to not use require. Nuxt is an interesting framework...
    loadImage(name) {
      const images = {
        linkedin: require("../assets/linkedin.png"),
        github: require("../assets/github.png"),
        discord: require("../assets/discord.png"),
      };
      return get(images, name.toLowerCase(), "github");
    },
  },
  async asyncData({ params }) {
    const profile = {
      name: "Unable to load profile....",
      github: "octocat",
      profile: {
        tag_line: "Away @ Cannon Beach",
        summary: "",
        actively_looking: false,
        looking_for: [],
        skills: [],
      },
      links: [],
    };
    try {
      console.debug("[Fetching Config]:", process.env.configUrl);
      const { data } = await axios.get(`${process.env.configUrl}`);
      console.debug("[Fetching Config]:", "Successful!");
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
