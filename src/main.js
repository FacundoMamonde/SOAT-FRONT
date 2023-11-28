import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue, IconsPlugin ,AvatarPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export const backendData = "https://soat-server.onrender.com"
Vue.config.productionTip = false
export const bus = new Vue();Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(AvatarPlugin)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

