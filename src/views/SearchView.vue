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
        <SearchBar :navigate="false" @search="onSearch" :default-val="searchText" />
      </div>
      <div class="sr-results-wrapper">
        <SearchResults :search-text="searchText" :documents="searchResult" />
      </div>
    </div>
  </div>
</template>

<script>
import { APIS } from '../common/constants';
import axios from "axios";

export default {
  data: () => ({
    searchText: "",
    searching: false,
    searchResult: null
  }),
  created() {
    this.searchText = this.$route.query.text ? this.$route.query.text : "";
    if (this.searchText?.trim()) {
      this.performSearch(this.searchText.trim().split(' '));
    }
  },
  methods: {
    translateDocData(results) {
      return results.map((doc) => {
        return {
          id: doc.id,
          keywords: [doc.lexeme],
          date: 'NA',
          documentName: doc.documentName,
          page: doc.pageNumber,
          pageId: doc.pageId,
          rect: {
            x: doc.x,
            y: doc.y,
            height: doc.height,
            width: doc.width
          },
          sourceFilePath: doc.documentPath,
          resultFilePath: doc.imagePath
        }
      })
    },
    onSearch(text) {
      this.searchText = text;
      if (this.searchText?.trim()) {
        this.$router.replace({
          path: this.$route.path, 
          query: {
            text: this.searchText
          }
        });
        this.performSearch(this.searchText.trim().split(' '));
      }
    },
    performSearch(searchWords) {
      this.searching = true;
      this.response = null;
      axios.get(APIS.SEARCH, {
        params: {
          keywords: searchWords.join(','),
          tags: ''
        }
      }).then((resp) => {
        this.searching = false;
        this.searchResult = this.translateDocData(resp.data);
      }).catch((err) => {
        this.searching = false;
        console.log("Failed to load search results")
      });
    }
  }
}

</script>

<style scoped>
.sr-bar-wrapper {}
</style>