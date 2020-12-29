<template>
	<div
		class="profile-card sm:w-auto md:w-4/5 lg:w-1/3 "
	>
    <Portrait v-bind:profileUrl="profileUrl"></Portrait>
		<div id="headings" class="p-1">
			<h1 class="font-bold full-name">
				{{ name }}
			</h1>
			<h2 class="pb-3 italic">
				{{ profile.tag_line }}
			</h2>
		</div>

		<div v-if="!isLoading">
			<div v-if="profile.actively_looking" id="job-search" class="p-1">
				<strong>Looking for:</strong>
				<p class="p-1">
					{{ profile.looking_for.join(", ") }}
				</p>
			</div>

			<div id="skill-set" class="p-1">
				<strong>Skills:</strong>
				<p class="p-1">
					{{ profile.skills.join(", ") }}
				</p>
			</div>
		</div>

		<div id="social-icons" class="flex flex-col p-1 w-full justify-center">
			<div v-for="link in links" :key="encodeURIComponent(link.username + link.url)" class="social-icon pl-1 pr-1">
				<Logo v-bind="link" />
			</div>
		</div>
		<Footer />
	</div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
