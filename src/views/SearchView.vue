<script setup>
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResults.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
  <div class="search-view-container container">
    <MainNav />
    <div class="view-wrapper-start">
      <div class="sr-bar-wrapper">
        <SearchBar :navigate="false" @search="onSearch" :default-val="searchText"/>
      </div>
      <div class="sr-results-wrapper">
        <SearchResults :search-text="searchText" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    searchText: ""
  }),
  created() {
    this.searchText = this.$route.query.text ? this.$route.query.text : "";
  },
  methods: {
    onSearch(text) {
      this.searchText = text;
      // Perform Search API call
    }
  }
}

</script>

<style scoped>
.sr-bar-wrapper {
    
}
</style>