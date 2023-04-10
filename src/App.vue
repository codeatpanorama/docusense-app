<script setup>
</script>

<template>
  <div class="logo-header">DOC<div class="rotate"><v-icon size="small" icon="mdi-magnify"></v-icon><v-icon class="logo-b"
        size="small" icon="mdi-magnify"></v-icon></div>EES</div>
  <RouterView />
</template>

<style scoped>
.logo-header {
  height: 56px;
  background: var(--color-title-bg);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 4;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  color: var(--color-title-text);
  font-size: 36px;
  text-shadow: 2px 2px black;
  display: flex;
  place-items: center;
  place-content: center;
}

.logo-b {
  transform: rotate(180deg);
}

.rotate:hover {
  animation: rotation 0.5s linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}
</style>
