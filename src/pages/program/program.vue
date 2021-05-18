<template>
  <main class="program">
    <div class="program-settings">
      <button v-if="isReport">Отчет</button>
    </div>
    <div class="program-cutting-chart">
      <CuttingChart />
    </div>
  </main>
</template>

<script lang="ts" src="./program.ts"></script>

<style src="./program.css"></style>
