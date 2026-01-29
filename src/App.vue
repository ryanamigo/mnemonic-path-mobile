<script setup lang="ts">
import CircleMenu from './components/circle-menu/index.vue'
</script>

<template>
  <main class="min-h-screen">
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </RouterView>
  </main>
  <CircleMenu />
</template>

<style scoped></style>
