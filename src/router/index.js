import Vue from 'vue'
import VueRouter from 'vue-router'
import LogInView from '../views/LogInView.vue'
import IngresadasView from '../views/IngresadasView.vue'
import DiagnosticadasView from '../views/DiagnosticadasView.vue'
import PresupuestadasView from '../views/PresupuestadasView.vue'
import PendientesView from '../views/PendientesView.vue'
import TerminadasView from '../views/TerminadasView.vue'
import EntregadasView from '../views/EntregadasView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LogInView
  },
  {
    path: '/ingresadas',
    name: 'ingresadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: IngresadasView
  },
  {
    path: '/diagnosticadas',
    name: 'diagnosticadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DiagnosticadasView
  },
  {
    path: '/presupuestadas',
    name: 'presupuestadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PresupuestadasView
  },
  {
    path: '/pendientes',
    name: 'pendientes',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PendientesView
  },
  {
    path: '/terminadas',
    name: 'terminadas',
    component: TerminadasView
  },
  {
    path: '/entregadas',
    name: 'entregadas',
    component: EntregadasView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
