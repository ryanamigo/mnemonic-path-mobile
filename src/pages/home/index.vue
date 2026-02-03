<template>
  <var-pull-refresh>
    <var-list class="h-screen">
      <div v-for="item in data" :key="item.id" class="w-1/2">
        <var-image :src="R2_HOST + item.url" alt=""/>
      </div>
    </var-list>
  </var-pull-refresh>
</template>
<script setup lang="ts">
import useInfinity from '@/hooks/use-infinity';
import type { Mnemonic } from '@/types/mnemonic';
const R2_HOST = import.meta.env.VITE_APP_R2_HOST

const { data, loading } = useInfinity<Mnemonic>('api/mnemonics')
</script>