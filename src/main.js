import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

// normalize.css
import 'normalize.css/normalize.css'
// 全局样式
import '@/styles/index.less'

const app = createApp(App)

app
  .use(router)
  .use(store)
  .mount('#app')
