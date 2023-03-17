import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'highlight.js/styles/shades-of-purple.css'
import { useMessage } from 'naive-ui'

const app = createApp(App)

app.mount('#app')

app.config.globalProperties.message = useMessage()
