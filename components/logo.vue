<template>
  <a class="flex w-full justify-center" :href="url" target="_blank">
    <div v-if="imageSrc">
      <img class="justify-center" :src="imageSrc || loadingImageSrc" :alt="username" />
    </div>
    <div v-else>
      <strong>{{logo}}</strong>
    </div>
  </a>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import * as logos from "~/utils/logos";
import { get } from "lodash";

@Component
export default class Logo extends Vue {
  @Prop(String) readonly username!: string;
  @Prop(String) readonly logo!: string;
  @Prop(String) readonly url!: string;

  loadingImageSrc = logos.loading;
  imageSrc: any = null;

  mounted() {
    this.imageSrc = get(logos, this.logo?.toLowerCase());
  }
}
</script>

<style lang="scss" scoped>

</style>

