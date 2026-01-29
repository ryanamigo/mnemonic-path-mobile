<template>
  <div>
    <h1>Admin</h1>
    <p>{{ demoState }}</p>
    <button @click="demoState++">Click me</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const demoState = ref(0)
</script>