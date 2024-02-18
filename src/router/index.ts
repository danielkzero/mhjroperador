import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'OrdemServico',
    component: () => import('../views/OrdemServico.vue'),
  },
  {
    path: '/registro-de-operacao',
    name: 'RegistroDeOperacao',
    component: () => import('../views/RegistroOperacao.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
