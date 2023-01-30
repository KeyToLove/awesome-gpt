<script setup lang="ts">
import { computed, ref } from 'vue';
import Demo1 from './Demo-1.vue'
import Demo2 from './Demo-2.vue'
const routes = {
  '/': Demo1,
  '/demo-2': Demo2
}
const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || Demo1
})

const go = (path: string) => {
  window.location.href = `#/${path}`
}

</script>

<template>
  <div class="nav">
    <button @click="go('demo-1')">Demo-1</button>
    <button @click="go('demo-2')">Demo-2</button>
  </div>
  <component :is="currentView"></Component>
</template>

<style lang="less" scoped>
.nav {
  font-size: 16px;

  button {
    margin-right: 6px;
  }
}
</style>

