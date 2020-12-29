<template>
  <footer>
    <hr>
    <p><a href="https://github.com/mbround18/showcase-yourself">Check this project out on Github!</a></p>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Footer extends Vue {
}
</script>

<style lang="scss" scoped>
 footer {
   position: fixed;
   left: 0;
   bottom: 0;
   width: 100%;
   background-color: #4c4c4f;
   text-align: center;
 }
</style>
