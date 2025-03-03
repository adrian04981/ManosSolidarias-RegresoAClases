<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav>
    <router-link to="/voluntariado">Voluntariado</router-link>
  </nav>
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

nav {
  padding: 1rem;
  background: #f8f9fa;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>
