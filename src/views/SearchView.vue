<script setup>
import SearchBar from '../components/SearchBar.vue';
import SearchResults from '../components/SearchResult.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
  <div class="search-view-container container">
    <MainNav />
    <div class="view-wrapper-start">
      <div class="sr-bar-wrapper">
        <SearchBar :navigate="false" @search="onSearch" :default-data="searchData" />
      </div>
      <div class="sr-results-wrapper">
        <SearchResults :search-data="searchData" :documents="searchResult" :searching="searching" />
      </div>
    </div>
  </div>
</template>

<script>
import { APIS } from '../common/constants';
import { encodeBase64, decodeBase64 } from '../common/helpers'
import axios from "axios";

export default {
  data: () => ({
    searching: false,
    searchResult: null,
    searchData: [],
  }),
  created() {
    const searchString = this.$route.query.data;
    if (searchString) {
      try {
        const data = decodeBase64(searchString);
        this.searchData = JSON.parse(data);
        this.performSearch(this.searchData);
      } catch (e) {
        this.searchData = [];
      }
    }
  },
  methods: {
    translateDocData(results) {
      return results.map((doc) => {
        return {
          id: doc.id,
          keywords: doc.filteredWords.map(word => word.value.toLowerCase()),
          date: 'NA',
          documentName: doc.documentName,
          page: doc.number,
          pageId: doc.id,
          rects: doc.filteredWords.map(word => ({
            x: word.x,
            y: word.y,
            height: word.height,
            width: word.width
          })),
          sourceFilePath: doc.documentPath,
          resultFilePath: doc.path
        }
      })
    },
    onSearch(searchData) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          data: encodeBase64(JSON.stringify(searchData))
        }
      });
      this.searchData = searchData;
      this.performSearch(this.searchData);
    },
    performSearch(searchData) {
      this.searching = true;
      this.response = null;
      axios.get(APIS.SEARCH, {
        params: {
          q2: searchData.filter(d => d.required).map(d => d.text).join(','),
          q1: searchData.filter(d => !d.required).map(d => d.text).join(','),
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

<style scoped></style>