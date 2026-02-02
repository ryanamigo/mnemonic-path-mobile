<template>
  <div class="w-full px-2 py-4">
    <h1>上传图片</h1>
    <var-uploader :multiple="true" v-model="fileList" >
    </var-uploader>
    <div class="flex gap-x-2 mt-2" v-if="fileList.length > 0">
      <var-button type="primary" @click="handleUpload">上传</var-button>
      <var-button type="danger" @click="handleClear">清空</var-button>
    </div>
    <AuthDialog
      :show="authDialogOpen"
      @cancel="authDialogOpen = false"
      @confirm="handleAuthConfirm"
    />
  </div>
</template>
<script setup lang="ts">
import type { VarFile } from '@varlet/ui';
import { onMounted, ref } from 'vue';
import { getExif } from '@/utils/exif';
import { createMnemonic, getPresigndUrl } from '@/api/mnemonic';
import ky from 'ky';
import { login } from '@/api/auth';
const fileList = ref<VarFile[]>([])
const authDialogOpen = ref(false)
const isUploading = ref(false)

function showAuthDialog() {
  authDialogOpen.value = true
}

function closeAuthDialog() {
  authDialogOpen.value = false
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    showAuthDialog()
  }
})


const createUploadJob = (varFileObj: VarFile) => {
  return new Promise(async (resolve, reject) => {
    const originFile = varFileObj.file
    if (!originFile) {
      return false
    }
    try {
      const getPresignUrl = await getPresigndUrl({ fileName: originFile.name })
      const uploadUrl = getPresignUrl.data?.url
      if (!uploadUrl) {
        return false
      }
      const uploadUrlObj = new URL(uploadUrl)
      const relativeUrl = `${uploadUrlObj.pathname}${uploadUrlObj.search}`
      const info = await getExif(originFile)
      await ky.put(uploadUrl, { body: originFile})
      await createMnemonic({
        url: relativeUrl,
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
  try {
    const res = await Promise.all(fileList.value.map(createUploadJob))
  } catch (error) {
    
  } finally {
    isUploading.value = false
  }
}

const handleClear = () => {
  fileList.value = []
}

const handleAuthConfirm = async (password: string) => {
  const res = await login({ password })
  const token = res.data?.token
  if (!token) {
    return
  }
  localStorage.setItem('token', token)
  closeAuthDialog()
}


</script>