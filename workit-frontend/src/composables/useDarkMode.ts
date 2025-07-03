import { ref, onMounted } from 'vue'

const isDark = ref(true) // ⚡ default is DARK mode!

export function useDarkMode() {
  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleDark() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      isDark.value = true
    } else if (saved === 'light') {
      isDark.value = false
    } else {
      // 🚀 If no saved preference, default to dark
      isDark.value = true
    }
    applyTheme()
  })

  return { isDark, toggleDark }
}
