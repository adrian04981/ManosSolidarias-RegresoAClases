import { createRouter, createWebHistory } from 'vue-router';
import VoluntariadoForm from '../views/VoluntariadoForm.vue';
import CertificadoVoluntariado from '../views/CertificadoVoluntariado.vue';

const routes = [
  {
    path: '/',
    redirect: '/voluntariado'
  },
  {
    path: '/voluntariado',
    name: 'voluntariado',
    component: VoluntariadoForm
  },
  {
    path: '/certificado/:nombre/:id',
    name: 'certificado',
    component: CertificadoVoluntariado
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
