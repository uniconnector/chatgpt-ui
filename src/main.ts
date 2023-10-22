import './assets/material-design-iconic-font.min.css'
import './assets/style.min.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
