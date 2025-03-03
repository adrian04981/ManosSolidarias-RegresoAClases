<script setup>
import { ref, onMounted } from 'vue'
import { database } from '../firebase/config'
import { ref as dbRef, onValue, set, get } from 'firebase/database'

const clicks = ref(0)
const error = ref(null)
const loading = ref(true)
const counterRef = dbRef(database, 'clicks')

onMounted(async () => {
  try {
    const snapshot = await get(counterRef)
    if (!snapshot.exists()) {
      await set(counterRef, 0)
    }

    onValue(counterRef, (snapshot) => {
      const value = snapshot.val()
      clicks.value = value === null ? 0 : value
      loading.value = false
    }, (error) => {
      console.error('Error leyendo datos:', error)
      error.value = 'Error al cargar el contador'
      loading.value = false
    })
  } catch (err) {
    console.error('Error inicial:', err)
    error.value = 'Error al inicializar el contador'
    loading.value = false
  }
})

const incrementCounter = async () => {
  try {
    error.value = null
    await set(counterRef, clicks.value + 1)
  } catch (err) {
    console.error('Error incrementando contador:', err)
    error.value = 'Error al actualizar el contador'
  }
}
</script>

<template>
  <div class="counter">
    <p v-if="loading">Cargando...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <template v-else>
      <p>Contador de clicks: {{ clicks }}</p>
      <button @click="incrementCounter">Click me!</button>
    </template>
  </div>
</template>

<style scoped>
.counter {
  margin: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #3aa876;
}

.error {
  color: red;
  margin: 10px 0;
}
</style>
