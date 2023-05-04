import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'highlight.js/styles/shades-of-purple.css'
import naive from 'naive-ui'
import router from './router'

// Vercel Web Analytics
import { inject } from '@vercel/analytics'
inject()

const app = createApp(App)
app.use(router)
app.use(naive)

// 解决刷新拿不到route信息问题
router.isReady().then(() => {
  app.mount('#app')
})
