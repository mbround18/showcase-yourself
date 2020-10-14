<template>
  <div
    class="profile-card sm:w-auto md:w-4/5 lg:w-1/3 "
  >
    <div class="uk-card-media-top uk-align-center">
      <img class="profile-img" :src="avatar_url" alt="Profile Picture" />
    </div>
    <div id="headings" class="p-1">
      <h1 class="font-bold full-name">{{ name }}</h1>
      <h2 class="pb-3 italic">{{ profile.tag_line }}</h2>
    </div>
    
    <div id="job-search" class="p-1">
      <strong>Looking for:</strong>
      <p class="p-1" v-if="profile.actively_looking">{{ profile.looking_for.join(", ") }}</p>
    </div>
    
    <div id="skillset" class="p-1">
      <strong>Skills:</strong>
      <p class="p-1">{{ profile.skills.join(", ") }}</p>
    </div>
    
    <div id="social-icons" class="flex p-1 sm:items-end md:items-center width-max justify-center">
      <div class="social-icon pl-1 pr-1" v-for="link in links" v-bind:key="link.username">
        <a target="_blank" :href="link.url">
          <img
            :src="loadImage(link.logo)"
            :alt="`${link.logo}@${link.username}`"
            srcset
          />
        </a>
      </div>  
    </div>
    
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
