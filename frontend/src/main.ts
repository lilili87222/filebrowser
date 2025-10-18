import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import register from '@/global'
import '@/assets/css/index.less'

const pinia = createPinia()
const app = createApp(App)
app.use(register)
app.use(pinia)
app.use(router)
app.mount('#app')
