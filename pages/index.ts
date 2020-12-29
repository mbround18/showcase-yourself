import Vue from 'vue';
import axios from 'axios';
import component from 'vue-class-component';
import {merge, uniq, get} from 'lodash';
import {loading} from "~/utils/logos";

@component({
	components: {
		Logo: () => import('../components/logo.vue'),
		Footer: () => import('../components/footer.vue'),
		Portrait: () => import('../components/portrait.vue')
	}
})
export default class Index extends Vue {
	isLoading = true;
	name = 'Loading...';
	github = 'octocat';
	profileUrl = null;
	profile = {
		tag_line: 'Away @ Cannon Beach',
		summary: '',
		actively_looking: false,
		looking_for: [],
		skills: []
	};

	links = [
		{
			active: true,
			username: 'mbround18',
			url: 'https://github.com/mbround18',
			logo: 'Github'
		}
	];

	loadingImg = loading;

	mounted() {
		console.debug('[Index]: Loaded...');
		this.loadConfig()
			.then(() => console.log('[Index]: Config loaded...'))
			.catch(() => {
				this.name = 'Uhh ohhh, Config Failed to load!';
				this.profile.tag_line = 'Failed Loading config....';
				console.error('[Index]: Failed to load config...');
			});
	}

	async loadConfig() {
		const configUrl = process.env.configUrl;
		if (!configUrl) {
			return;
		}

		const {data}: { data: any} = await axios.get(configUrl);
		const skills = uniq(get(data, 'profile.skills', []));

		if (data) {
			this.isLoading = false;
			merge(this, data, {profile: {skills}});
		}

		await this.fetchAvatarUrl();
	}

	async fetchAvatarUrl() {
		const githubApiUrl = `https://api.github.com/users/${this.github}`;
		const {data: {avatar_url: profileUrl }} = await axios.get(githubApiUrl);
		this.profileUrl = profileUrl;
	}
}

