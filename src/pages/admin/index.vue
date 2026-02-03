<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-20 transition-colors duration-200">
    <var-app-bar title="图片管理" title-position="center" color="var(--color-primary)" />
    <var-tabs v-model:active="activeTab">
      <var-tab>上传</var-tab>
      <var-tab>列表</var-tab>
    </var-tabs>
     <var-tabs-items v-model:active="activeTab">
      <var-tab-item>
        <AdminUpload />
      </var-tab-item>
      <var-tab-item>
        <AdminList />
      </var-tab-item>
     </var-tabs-items>
    
    <AuthDialog
      :show="authDialogOpen"
      @cancel="authDialogOpen = false"
      @confirm="handleAuthConfirm"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { login } from '@/api/auth';
import { toast } from 'vue-sonner';
import AdminUpload from './upload.vue'
import AdminList from './list.vue'
const authDialogOpen = ref(false)
const activeTab = ref(0)

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

const handleAuthConfirm = async (password: string) => {
  try {
      const res = await login({ password })
      const token = res.data?.token
      if (!token) {
        throw new Error('Token missing')
      }
      localStorage.setItem('token', token)
      closeAuthDialog()
      toast.success('登录成功')
  } catch (e) {
      toast.error('登录失败，请检查密码')
  }
}
</script>