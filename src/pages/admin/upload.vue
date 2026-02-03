<template>
    <div class="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm mb-4 transition-colors duration-200">
      <h2 class="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">选择图片</h2>
      <var-uploader :multiple="true" v-model="fileList" />
    </div>

    <div v-if="isUploading" class="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm mb-4 transition-colors duration-200">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">上传进度</span>
        <span class="text-sm text-primary font-medium dark:text-primary-400">{{ currentUploadIndex }} / {{ fileList.length }}</span>
      </div>
      <var-progress :value="progressPercentage" label track-color="#f5f5f5" />
    </div>

    <div class="flex flex-col gap-y-3 mt-8" v-if="fileList.length > 0">
      <var-button block type="primary" @click="handleUpload" :loading="isUploading" size="large">开始上传</var-button>
      <var-button block type="danger" @click="handleClear" :disabled="isUploading" size="large" outline>清空列表</var-button>
    </div>
</template>
<script setup lang="ts">
import type { VarFile } from '@varlet/ui';
import { ref, computed } from 'vue';
import { getExif } from '@/utils/exif';
import { createMnemonic, getPresigndUrl } from '@/api/mnemonic';
import ky from 'ky';
import { toast } from 'vue-sonner';
const fileList = ref<VarFile[]>([])
const isUploading = ref(false)
const currentUploadIndex = ref(0)

const progressPercentage = computed(() => {
  if (fileList.value.length === 0) return 0
  return Math.round((currentUploadIndex.value / fileList.value.length) * 100)
})

const createUploadJob = (varFileObj: VarFile) => {
  return new Promise(async (resolve, reject) => {
    const originFile = varFileObj.file
    if (!originFile) {
      resolve(false) // Skip invalid files but don't fail the whole batch immediately if possible, or reject. Let's resolve false to skip.
      return 
    }
    try {
      const getPresignUrl = await getPresigndUrl({ fileName: originFile.name })
      let uploadUrl = getPresignUrl.data?.url
      if (!uploadUrl) {
         throw new Error('获取上传链接失败')
      }
      
      const uploadUrlObj = new URL(uploadUrl, window.location.origin) // Use window.location.origin as base for relative proxy URLs
      const info = await getExif(originFile)
      await ky.put(uploadUrl, { body: originFile})
      await createMnemonic({
        url: uploadUrlObj.pathname,
        metadata: info,
      })
      resolve(true)
    } catch (error: any) {
      reject(error)
    }
  })
}


const handleUpload = async () => {
  isUploading.value = true
  currentUploadIndex.value = 0
  try {
    for (let i = 0; i < fileList.value.length; i++) {
        const file = fileList.value[i]
        if (file) {
          await createUploadJob(file)
          currentUploadIndex.value = i + 1
        }
    }
    toast.success('全部上传成功')
    fileList.value = [] // Optional: clear list on success
    currentUploadIndex.value = 0
  } catch (error) {
    console.error(error)
    toast.error('上传过程中发生错误')
  } finally {
    isUploading.value = false
  }
}

const handleClear = () => {
  fileList.value = []
  currentUploadIndex.value = 0
}

</script>