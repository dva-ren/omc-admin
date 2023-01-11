import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import naive from 'naive-ui'
import routes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import NProgress from 'nprogress'
import App from './App.vue'
import 'nprogress/nprogress.css'

import './styles/main.css'
import 'uno.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import { useMainStore } from './store'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = localStorage.getItem('token')
  if (to.path === '/login')
    next()
  else if (!token)
    next('/login')
  else
    next()
})
router.afterEach(() => {
  // document.documentElement.scrollTop = 0
  // document.body.scrollTop = 0
  window.scrollTo({ top: 0 })
  NProgress.done()
})
app.use(createPinia())
app.use(naive)
app.use(router)
app.mount('#app')
