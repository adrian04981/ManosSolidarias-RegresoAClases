<template>
  <div class="voluntario-form">
    <h2>Datos del Voluntario</h2>
    <form @submit.prevent="guardarVoluntario">
      <div class="form-group">
        <label for="nombreCompleto">Nombre Completo:</label>
        <input 
          type="text" 
          id="nombreCompleto" 
          v-model="formData.nombreCompleto"
          required
        >
      </div>
      
      <div class="form-group">
        <label>Género:</label>
        <select v-model="formData.genero" required>
          <option value="">Seleccione...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
      </div>

      <div class="message" :class="{ success: isSuccess, error: isError }" v-if="message">
        {{ message }}
      </div>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Generar Certificado' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { database } from '../../firebase/config';
import { ref as dbRef, push, set } from 'firebase/database';

const emit = defineEmits(['update-data']);
const formData = ref({
  nombreCompleto: '',
  genero: ''
});

const isSubmitting = ref(false);
const message = ref('');
const isSuccess = ref(false);
const isError = ref(false);

const guardarVoluntario = async () => {
  isSubmitting.value = true;
  message.value = '';
  isSuccess.value = false;
  isError.value = false;

  try {
    const voluntariosRef = dbRef(database, 'voluntarios-registrados');
    const newVoluntarioRef = push(voluntariosRef);
    
    await set(newVoluntarioRef, {
      nombreCompleto: formData.value.nombreCompleto,
      genero: formData.value.genero,
      fechaRegistro: new Date().toISOString()
    });

    message.value = '¡Voluntario registrado exitosamente!';
    isSuccess.value = true;
    emit('update-data', formData.value);
  } catch (error) {
    console.error('Error al guardar:', error);
    message.value = 'Error al registrar voluntario. Por favor intente nuevamente.';
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

watch(formData, (newValue) => {
  emit('update-data', newValue);
}, { deep: true });
</script>

<style scoped>
.voluntario-form {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

.message {
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
}

.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #2e7d32;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #c62828;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>
