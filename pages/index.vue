<template>
  <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-align-center">
    <div class="uk-card-media-top uk-align-center">
      <img class="profile-img" :data-src="avatar_url" alt="Profile Picture" srcset uk-img />
    </div>

    <h1 class="uk-card-title">{{name}}</h1>
    <h2>{{profile.tag_line}}</h2>
    <p v-if="profile.actively_looking">{{profile.looking_for.join(", ")}}</p>
    <p>{{profile.skills.join(", ")}}</p>

    <div class="social-icon" v-for="link in links" v-bind:key="link.username">
      <a target="_blank" :href="link.url">
        <img :src="loadImage(link.logo)" :alt="`${link.logo}@${link.username}`" srcset />
      </a>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" src="./index.scss"></style>