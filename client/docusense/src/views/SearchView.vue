<script setup>
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResults.vue';
</script>

<template>
  <div class="search-view-container">
    <div class="sr-bar-wrapper">
      <SearchBar :navigate="false" @search="onSearch" :default-val="searchText"/>
    </div>
    <div class="sr-results-wrapper">
      <SearchResults />
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