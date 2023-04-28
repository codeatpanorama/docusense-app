
<template>
    <div class="search-bar-holder">
        <v-text-field density="compact" variant="solo" label="Search documents" append-inner-icon="mdi-magnify"
            single-line clearable hide-details v-model="searchText" @click:append-inner="onSearch"
            @keyup.enter="onSearch"></v-text-field>
        <RecentSearches @search="onRecentSearch" />
    </div>
</template>
  
<script>
import { addWordToLocalStorage } from '../common/helpers';
import RecentSearches from './RecentSearches.vue';
export default {
    props: {
        navigate: {
            type: Boolean,
            default: false
        },
        defaultVal: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        searchText: ""
    }),
    mounted() {
        this.searchText = this.defaultVal;
    },
    methods: {
        onSearch() {
            if (this.searchText) {
                this.performSearch(this.searchText);
            }
        },
        onRecentSearch(word) {
            this.performSearch(word);
            this.searchText = word;
        },
        performSearch(text) {
            const searchText = text.trim();
            addWordToLocalStorage(searchText);
            this.$emit("search", searchText);
            if (this.navigate) {
                this.$router.push(`/search/?text=${searchText}`);
            }
        }
    },
    components: { RecentSearches }
}
</script>
<style lang="scss">
.search-bar-holder {
    padding-bottom: 24px;
}
</style>