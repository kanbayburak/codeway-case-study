import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'   // 🔹 router'ı import et

const app = createApp(App)

app.use(router)   // 🔹 uygulamaya router'ı tanıt
app.mount('#app')
