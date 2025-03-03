<template>
  <div class="voluntariado-container">
    <div class="form-section">
      <VoluntarioForm @update-data="updateCertificadoData" />
    </div>
    <div class="preview-section">
      <CertificadoPreview :voluntarioData="certificadoData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VoluntarioForm from '../components/voluntariado/VoluntarioForm.vue';
import CertificadoPreview from '../components/voluntariado/CertificadoPreview.vue';

const certificadoData = ref({
  nombreCompleto: '',
  genero: ''
});

const updateCertificadoData = (data) => {
  certificadoData.value = data;
};
</script>

<style scoped>
.voluntariado-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-section, .preview-section {
  flex: 1;
}
</style>
