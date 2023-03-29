<script setup>
import SearchBar from '../components/SearchBar.vue';
</script>

<template>
  <main class="main-container">
    <div class="search-wrapper">
      <div class="logo-wrapper">
        <div class="app-logo">DOCUSENSE</div>
      </div>
      <SearchBar :navigate="true" />
    </div>
  </main>
</template>

<script>
export default {
  methods: {
    onSearch: (searchText) => {
      
    }
  }
}
</script>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  place-items: center;
  flex-grow: 1;
  justify-content: center;
}

.main-container .search-wrapper {}

.search-wrapper .logo-wrapper {
  padding: 16px;
}

.app-logo {
  color: var(--color-heading);
  text-decoration: none;
  text-shadow: 6px 6px 2px green;
  font-size: 60px;
}
</style>