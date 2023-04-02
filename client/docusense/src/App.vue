<script setup>
</script>

<template>
  <div class="logo-header">DOCUVED</div>
  <RouterView />
</template>

<style scoped>
.logo-header {
  height: 56px;
  background: var(--color-title-bg);
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  font-family: Samarkan;
  color: var(--color-title-text);
  font-size: 36px;
  text-shadow: 2px 2px black;
  display: flex;
  place-items: center;
  place-content: center;
}
</style>
