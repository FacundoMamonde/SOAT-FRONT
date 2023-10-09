import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin ,AvatarPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false
export const bus = new Vue();
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(AvatarPlugin)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export const backendData="http://app-16ad6c15-e69f-4af6-8d54-b3f834ee4956.cleverapps.io"