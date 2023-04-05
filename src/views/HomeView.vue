<script setup>
import SearchBar from '../components/SearchBar.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
  <main class="main-container container">
    <MainNav />
    <div class="view-wrapper-center">
      <div class="search-wrapper">
        <div class="logo-wrapper">
          <div class="app-logo">DOCUVED</div>
        </div>
        <SearchBar :navigate="true" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.search-wrapper .logo-wrapper {
  padding: 16px;
}

.app-logo {
  color: var(--color-heading);
  text-shadow: 2px 2px black;
  font-family: Samarkan;
  text-decoration: none;
  font-size: 84px;
}
</style>