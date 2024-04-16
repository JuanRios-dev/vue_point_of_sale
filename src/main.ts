import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* CSS and JS */
import '@/assets/css/bootstrap.css'
import '@/assets/css/icons.css'
import '@/assets/css/app.css'



createApp(App).use(router).mount('#app')
