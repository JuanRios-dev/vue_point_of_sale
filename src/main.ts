import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import App from './App.vue'
import router from './router'

/* CSS and JS */
import '@/assets/css/bootstrap.css'
import '@/assets/css/icons.css'
import '@/assets/css/app.css'


const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.mount('#app')

/* VARIABLES GLOBALES */
declare global {
  interface Window {
     axios: typeof axios;
  }
}

app.config.globalProperties.$apiBaseUrl = 'http://127.0.0.1:8000';

/* -- --- --  */

// CONFIGURAR HEADERS AXIOS
window.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
useAuthStore().isAuthenticated ? axios.defaults.headers.common['Authorization'] = `Bearer ${useAuthStore().token}` : null ;
axios.interceptors.request.use(config => {
  config.params = { ...config.params, company_id: useAuthStore().isSelectedCompanyId };
  return config;
});
axios.defaults.headers.withCredentials = true;