<template>
  <div class="certificado-preview">
    <h2>Vista Previa del Certificado</h2>
    <div class="preview-container">
      <div class="certificado">
        <div class="nombre-voluntario">
          {{ voluntarioData.nombreCompleto || 'Nombre del Voluntario' }}
        </div>
      </div>
      <button @click="generarPDF" class="download-btn">Descargar PDF</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  voluntarioData: {
    type: Object,
    required: true
  }
});

const fechaActual = new Date().toLocaleDateString('es-ES');

const getGeneroSufijo = computed(() => {
  switch(props.voluntarioData.genero) {
    case 'F':
      return 'a';
    case 'M':
      return 'o';
    default:
      return '@';
  }
});

const generarPDF = () => {
  // Aquí implementarás la lógica para generar el PDF
  console.log('Generando PDF...');
};
</script>

<style scoped>
.certificado-preview {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-container {
  margin-top: 1rem;
}

.certificado {
  width: 1000px; /* Ajusta según el tamaño real de tu imagen */
  height: 700px; /* Ajusta según el tamaño real de tu imagen */
  background-image: url('https://jifdifmiicpkhvkxvnfm.supabase.co/storage/v1/object/public/Manos-Solidarias//Certificado.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  margin: 0 auto;
}

.nombre-voluntario {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 45%; /* Ajusta esta posición según donde necesites el nombre */
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem; /* Ajusta el tamaño según necesites */
  font-weight: bold;
  color: #000; /* Ajusta el color según necesites */
  font-family: 'Times New Roman', serif; /* Ajusta la fuente según necesites */
}

.download-btn {
  margin-top: 1rem;
  background: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 1rem auto;
}

.download-btn:hover {
  background: #1976D2;
}
</style>
