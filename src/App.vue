<script setup lang="ts">
import CircleMenu from './components/circle-menu/index.vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <main class="min-h-screen">
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </RouterView>
  </main>
  <Toaster :rich-colors="true" position="top-center" />
  <CircleMenu />
</template>

<style scoped></style>
