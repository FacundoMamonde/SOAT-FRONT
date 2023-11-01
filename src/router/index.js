import Vue from 'vue'
import VueRouter from 'vue-router'
import LogInView from '../views/LogInView.vue'
import IngresadasView from '../views/IngresadasView.vue'
import DiagnosticadasView from '../views/DiagnosticadasView.vue'
import PresupuestadasView from '../views/PresupuestadasView.vue'
import PendientesView from '../views/PendientesView.vue'
import TerminadasView from '../views/TerminadasView.vue'
import EntregadasView from '../views/EntregadasView.vue'
import EliminadasView from '../views/EliminadasView.vue'
import ClientesView from '../views/ClientesView.vue'
import ConfigNegocioView from '../views/admin/ConfigNegocioView.vue'

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
    component: IngresadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnosticadas',
    name: 'diagnosticadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DiagnosticadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/presupuestadas',
    name: 'presupuestadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PresupuestadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pendientes',
    name: 'pendientes',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PendientesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/terminadas',
    name: 'terminadas',
    component: TerminadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/entregadas',
    name: 'entregadas',
    component: EntregadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/eliminadas',
    name: 'eliminadas',
    component: EliminadasView,
    meta: { requiresAuth: true, role:'admin' }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesView,
    meta: { requiresAuth: true}
  },
  {
    path: '/admin/negocio',
    name: 'negocio',
    component: ConfigNegocioView,
    meta: { requiresAuth: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      // El usuario no está autenticado, redirige al inicio de sesión
      next('/');
    } else {
      // El usuario está autenticado, permite el acceso a la ruta
      next();
    }
  } else {
    next();
  }
});

export default router
