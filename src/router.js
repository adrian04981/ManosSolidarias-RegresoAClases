import { createRouter, createWebHistory } from 'vue-router';
import Voluntariado from './views/Voluntariado.vue';

const routes = [
  {
    path: '/',
    redirect: '/voluntariado'
  },
  {
    path: '/voluntariado',
    name: 'Voluntariado',
    component: Voluntariado
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
