import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted } from 'vue'

export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      if (typeof window === 'undefined') return

      // 1. Restore saved width
      const savedWidth = localStorage.getItem('emya-sidebar-width')
      if (savedWidth) {
        document.documentElement.style.setProperty('--vp-sidebar-width', savedWidth)
      }

      // 2. Attach draggable resize handle to sidebar
      const setupResizer = () => {
        const sidebar = document.querySelector('.VPSidebar') as HTMLElement | null
        if (!sidebar || sidebar.querySelector('.sidebar-resizer')) return

        const resizer = document.createElement('div')
        resizer.className = 'sidebar-resizer'
        resizer.title = 'برای تغییر اندازه سایدبار بکشید'
        sidebar.appendChild(resizer)

        let isDragging = false

        const onMouseDown = (e: MouseEvent) => {
          e.preventDefault()
          isDragging = true
          resizer.classList.add('dragging')
          document.body.style.cursor = 'col-resize'
          document.body.style.userSelect = 'none'

          window.addEventListener('mousemove', onMouseMove)
          window.addEventListener('mouseup', onMouseUp)
        }

        const onMouseMove = (e: MouseEvent) => {
          if (!isDragging) return
          // In RTL, sidebar is anchored to the right
          const newWidth = Math.max(220, Math.min(520, window.innerWidth - e.clientX))
          const widthStr = `${newWidth}px`
          document.documentElement.style.setProperty('--vp-sidebar-width', widthStr)
        }

        const onMouseUp = () => {
          if (!isDragging) return
          isDragging = false
          resizer.classList.remove('dragging')
          document.body.style.cursor = ''
          document.body.style.userSelect = ''

          const currentWidth = getComputedStyle(document.documentElement).getPropertyValue('--vp-sidebar-width')
          if (currentWidth) {
            localStorage.setItem('emya-sidebar-width', currentWidth.trim())
          }

          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('mouseup', onMouseUp)
        }

        resizer.addEventListener('mousedown', onMouseDown)
      }

      setupResizer()
      // Re-check after route navigation
      const observer = new MutationObserver(() => setupResizer())
      observer.observe(document.body, { childList: true, subtree: true })
    })
  }
}
