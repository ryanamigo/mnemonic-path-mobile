<script setup lang="ts">
import { cn } from '@/utils';
import { Box, House, Menu, ShieldUser, SunMoon, Plus } from 'lucide-vue-next'
import { computed, type Component, ref } from 'vue';
import { useRouter } from 'vue-router'
import useTheme from '@/hooks/use-theme';

const { toggleTheme } = useTheme()
const menuOpen = ref(false)
const router = useRouter();
const RADIUS = 60

type MenuItem = { path?: string; icon: Component; type: 'router' | 'action', name: string; }

const menuItems: MenuItem[] = [
  { path: '/', icon: House, type: 'router', name: 'home' },
  { path: '/admin', icon: ShieldUser, type: 'router', name: 'admin' },
  { path: '/three-d', icon: Box, type: 'router', name: 'three-d' },
  { icon: SunMoon, type: 'action', name: 'theme-toggle' },
]

const menuItemsWithPosition = computed(() => {
  const count = menuItems.length
  // Start from -90deg (top)
  const startAngle = -Math.PI / 2
  // Total span is 180deg (PI)
  const totalAngle = Math.PI
  
  return menuItems.map((item, index) => {
    // Distribute items evenly across the semicircle
    // Counter-clockwise: subtract angle
    const angle = startAngle - (index / (count - 1)) * totalAngle
    
    // Calculate position relative to center
    // We want the item's center to be at (x, y)
    // The items are initially centered via CSS, so this translate moves them out
    const x = Math.cos(angle) * RADIUS
    const y = Math.sin(angle) * RADIUS
    
    return {
      ...item,
      style: {
        transform: `translate(${x}px, ${y}px)`
      }
    }
  })
})

const toggleMenuVisible = () => {
  menuOpen.value = !menuOpen.value
}

const handleMenutItemClick = (item: MenuItem) => {
  if (item.type === 'router' && item.path) {
    router.push(item.path)
  } else if (item.type === 'action') {
    switch (item.name) {
      case 'theme-toggle':
        toggleTheme();
        break;
      default:
        break;
    }
  }
  menuOpen.value = false
}
</script>

<template>
  <nav class="fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] right-4 flex justify-center items-center z-50 pointer-events-none">
    <!-- Menu items container -->
    <ul 
      :class="cn('w-full h-full absolute z-30 flex justify-center items-center')"
    >
      <li 
        class="absolute w-12 h-12 rounded-full shadow-lg flex justify-center items-center transition-all duration-500 ease-out cursor-pointer pointer-events-auto
          bg-white/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-100 backdrop-blur-sm
          hover:scale-110 active:scale-95 border border-zinc-200/50 dark:border-zinc-700/50"
        v-for="(item, index) in menuItemsWithPosition" 
        :style="menuOpen ? { ...item.style, transitionDelay: `${index * 50}ms`, opacity: 1, scale: 1 } : { transform: 'translate(0, 0) scale(0.5)', opacity: 0, transitionDelay: `${menuItems.length * 20 - index * 20}ms` }"
        :key="index"
        @click="handleMenutItemClick(item)"
      >
        <component :is="item.icon" :size="20" />
      </li>
    </ul>

    <!-- Trigger button -->
    <button 
      :class="cn(
        'menu-trigger w-12 h-12 rounded-full shadow-xl flex justify-center items-center pointer-events-auto relative z-40 transition-all duration-500 ease-in-out',
        'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
        menuOpen ? 'rotate-[-135deg]' : 'rotate-0'
      )" 
      @click="toggleMenuVisible"
    >
      <Menu :size="24" v-if="!menuOpen" />
      <div v-else class="w-6 h-6 flex items-center justify-center">
        <!-- Close icon constructed with CSS or change icon -->
         <Plus :size="24" class="rotate-45" /> 
      </div>
    </button>
  </nav>
</template>

<style scoped>
/* Optional: Add a pulse effect to the trigger when idle? */
</style>