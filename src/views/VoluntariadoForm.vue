<template>
  <div class="form-container">
    <h2>Registro de Voluntariado</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="fullName">Nombre Completo:</label>
        <input 
          type="text" 
          id="fullName" 
          v-model="fullName" 
          required
        >
      </div>
      <button type="submit">Obtener Certificado</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { database } from '../firebase/config';
import { ref as dbRef, push, set } from 'firebase/database';

const router = useRouter();
const fullName = ref('');

const generatePDF = async (nombre) => {
  return new Promise((resolve, reject) => {
    const doc = new window.jspdf.jsPDF({
      orientation: 'portrait', // Cambio a vertical
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // A4 portrait dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      
      doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      
      doc.setFontSize(24); // Tamaño reducido para mejor ajuste
      doc.setTextColor(0, 0, 0);
      const textWidth = doc.getTextWidth(nombre);
      const x = (pageWidth - textWidth) / 2;
      doc.text(nombre, x, 148); // Ajustado para centrar verticalmente

      resolve(doc.output('datauristring'));
    };

    img.onerror = reject;
    img.src = "https://jifdifmiicpkhvkxvnfm.supabase.co/storage/v1/object/public/Manos-Solidarias/voluntariado/Certificado.png";
  });
};

const splitBase64 = (base64String) => {
  const chunkSize = 100000; // Reducido a ~100KB por chunk
  const chunks = [];
  let start = 0;
  
  while (start < base64String.length) {
    const end = Math.min(start + chunkSize, base64String.length);
    chunks.push(base64String.substring(start, end));
    start = end;
  }
  return chunks;
};

const handleSubmit = async () => {
  try {
    const pdfData = await generatePDF(fullName.value);
    const pdfChunks = splitBase64(pdfData);
    
    // Primero verifica el tamaño total
    const totalSize = pdfChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    if (totalSize > 10000000) { // 10MB límite
      throw new Error('El PDF es demasiado grande');
    }
    
    const voluntariosRef = dbRef(database, 'voluntariosRegistrados');
    const newVoluntarioRef = push(voluntariosRef);
    
    // Guardar en múltiples operaciones si es necesario
    const voluntarioData = {
      nombre: fullName.value,
      fecha: new Date().toISOString(),
      totalChunks: pdfChunks.length
    };

    await set(newVoluntarioRef, voluntarioData);
    
    // Guardar chunks en subcolecciones
    for (let i = 0; i < pdfChunks.length; i++) {
      await set(dbRef(database, `voluntariosRegistrados/${newVoluntarioRef.key}/chunks/${i}`), {
        data: pdfChunks[i]
      });
    }

    router.push({
      name: 'certificado',
      params: { 
        nombre: fullName.value,
        id: newVoluntarioRef.key 
      }
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al generar el certificado. Por favor, intente nuevamente.');
  }
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>