<template>
  <router-view />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = computed(() => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}
</script>

<style>
body, #app {
  margin: 0;
  padding: 0;
  background: #f5f7fa;
}
</style>
