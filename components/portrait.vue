<template>
  <div class="uk-card-media-top uk-align-center">
    <div v-if="profileUrl">
      <img class="profile-img" :src="profileUrl" alt="Profile Picture" />
    </div>
    <div v-else>
      <img
          class="profile-img"
          style="filter: invert(1)"
          :src="loadingImage"
          alt="Loading Profile"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {loading} from "~/utils/logos";
import {Prop} from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Portrait extends Vue {
  @Prop(String) readonly profileUrl!: string;
  loadingImage = loading;
}
</script>

<style lang="scss" scoped>
.profile-img {
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 1em;
}
</style>
