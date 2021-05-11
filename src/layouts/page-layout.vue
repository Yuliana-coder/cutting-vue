<template>
  <div id="app">
    <Header />
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Header from "@/components/header/header.vue";

@Component({
  components: {
    Header
  }
})
export default class PageLayout extends Vue {}
</script>
