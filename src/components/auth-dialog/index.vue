<template>
  <div>
    <var-dialog :show="show" title="需要验证您的身份" @cancel="handleCancel" @confirm="handleConfirm" :cancel-button="false" confirm-button-text="登录">
      <var-input v-model="password" placeholder="请输入密码" type="password" label="密码"></var-input>
    </var-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'confirm'])

const password = ref('')

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm', password.value)
}
</script>