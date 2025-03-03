<template>
  <div class="certificado-container">
    <!-- Preview del PDF -->
    <div class="certificado">
      <iframe v-if="pdfData" :src="pdfData" class="pdf-preview"></iframe>
      <div v-else class="loading">Cargando certificado...</div>
    </div>
    <button class="download-btn" @click="downloadPDF" :disabled="!pdfData">
      Descargar Certificado
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { database } from '../firebase/config';
import { ref as dbRef, get } from 'firebase/database';

const route = useRoute();
const router = useRouter();
const nombre = ref('');
const pdfData = ref('');

onMounted(async () => {
  try {
    nombre.value = route.params.nombre;
    const voluntarioRef = dbRef(database, `voluntariosRegistrados/${route.params.id}`);
    const snapshot = await get(voluntarioRef);
    
    if (snapshot.exists()) {
      const voluntarioData = snapshot.val();
      const totalChunks = voluntarioData.totalChunks;
      
      // Recuperar todos los chunks
      const chunksPromises = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunkRef = dbRef(database, `voluntariosRegistrados/${route.params.id}/chunks/${i}`);
        chunksPromises.push(get(chunkRef));
      }
      
      const chunkSnapshots = await Promise.all(chunksPromises);
      const chunks = chunkSnapshots.map(snap => snap.val().data);
      pdfData.value = chunks.join('');
    } else {
      throw new Error('Certificado no encontrado');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar el certificado');
    router.push('/voluntariado');
  }
});

const downloadPDF = () => {
  if (pdfData.value) {
    const link = document.createElement('a');
    link.href = pdfData.value;
    link.download = `certificado-${nombre.value}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style scoped>
.certificado-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.certificado {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1/1.414;
  margin: 0 auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pdf-preview {
  width: 100%;
  height: 100%;
  border: none;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: #666;
}

.download-btn {
  display: block;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #3aa876;
}
</style>
