import { onMounted, ref, watch } from "vue"
import { StyleProvider, Themes, type StyleVars } from '@varlet/ui'

type Theme = 'light' | 'dark'

const themes: Record<Theme, StyleVars> = {
  light: Themes.md3Light,
  dark: Themes.md3Dark,
}

function setTheme(theme: Theme | null) {
  const t = theme || 'light'
  localStorage.setItem('theme', t)
  document.documentElement.setAttribute('data-theme', t)
  StyleProvider(themes[t])
}

function useTheme() {
  const themeState = ref<Theme | null>(localStorage.getItem('theme') as Theme | null)
  onMounted(() => {
    setTheme(themeState.value)
  })
  const toggleTheme = () => {
    themeState.value = themeState.value === 'light' ? 'dark' : 'light'
  }
  watch(themeState, setTheme)
  return {
    themeState,
    toggleTheme
  }
}

export default useTheme