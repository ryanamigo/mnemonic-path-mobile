<template>
  <div class="p-2 min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-200 pb-20">
    <var-pull-refresh v-model="isRefreshing" @refresh="handleRefresh">
      <var-list
        :finished="isLastPage"
        :loading="loading"
        @load="handleLoad"
        :immediate-check="false"
      >
        <div class="columns-2 gap-2 space-y-2">
          <div 
            v-for="(item, index) in data" 
            :key="item.id" 
            class="break-inside-avoid bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden"
            @click="handlePreview(index)"
          >
            <var-image 
              :src="R2_HOST + item.url" 
              alt="Mnemonic Image"
              lazy
              class="w-full h-auto align-middle"
              ripple
            />
            <div class="p-2 text-xs text-gray-500 dark:text-gray-400 truncate">
               {{ item.metadata?.location?.altitude ? `Alt: ${item.metadata.location.altitude}m` : 'No Location' }}
            </div>
          </div>
        </div>
      </var-list>
    </var-pull-refresh>

    <var-image-preview
      v-model:show="showPreview"
      :images="previewImages"
      ref="previewRef"
      :initial-index="previewIndex"
    >
      <template #extra>
        <div class="bottom-10 flex gap-4 z-50">
           <var-button type="danger" round @click.stop="handleDelete" icon-container>
             <var-icon name="trash-can-outline" />
           </var-button>
        </div>
      </template>
    </var-image-preview>
  </div>
</template>

<script setup lang="ts">
import useInfinity from '@/hooks/use-infinity';
import type { Mnemonic } from '@/types/mnemonic';
import { ref, computed } from 'vue';
import { deleteMnemonic } from '@/api/mnemonic';
import { Dialog, ImagePreviewComponent, Snackbar } from '@varlet/ui';

const R2_HOST = import.meta.env.VITE_APP_R2_HOST

const { data, loading, isLastPage, loadMore, reset, fetchData } = useInfinity<Mnemonic>('api/mnemonics')

const isRefreshing = ref(false)
const showPreview = ref(false)
const previewIndex = ref(0)
const previewRef = ref<ImagePreviewComponent>()
const previewImages = computed(() => {
  return data.value.map(item => R2_HOST + item.url)
})

const handleRefresh = async () => {
  reset()
  await fetchData({ page: 1, pageSize: 10 }, false) // Explicitly re-fetch first page
  isRefreshing.value = false
}

const handleLoad = () => {
  loadMore()
}

const handlePreview = (index: number) => {
  // console.log(index);
  previewIndex.value = index
  showPreview.value = true
  previewRef.value?.to(index)
}

const handleDelete = async () => {
  const currentItem = data.value[previewIndex.value]
  if (!currentItem) return

  const action = await Dialog({
    title: '确认删除',
    message: '确定要删除这张图片吗？',
  })

  if (action === 'confirm') {
    try {
      await deleteMnemonic(currentItem.id)
      data.value.splice(previewIndex.value, 1)
      Snackbar.success('删除成功')
      
      if (data.value.length === 0) {
        showPreview.value = false
      } else if (previewIndex.value >= data.value.length) {
        previewIndex.value = data.value.length - 1
      }
      
    } catch (e) {
      console.error(e)
      Snackbar.error('删除失败')
    }
  }
}
</script>