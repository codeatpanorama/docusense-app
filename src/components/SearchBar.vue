
<template>
    <div class="search-bar-holder">
        <div class="search-section">
            <div class="search-bar">
                <v-text-field density="compact" variant="solo" label="Search documents" append-inner-icon="mdi-magnify"
                    single-line clearable hide-details v-model="searchText" @click:append-inner="onSearch"
                    @keyup.enter="onSearch"></v-text-field>
            </div>
            <div class="sb-translate-section">
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-translate" size="x-small" v-bind="props"></v-btn>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-list-item-title class="translate-lang"
                                @click="() => translate('hi')">हिंदी</v-list-item-title>
                            <v-list-item-title class="translate-lang"
                                @click="() => translate('mr')">मराठी</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <RecentSearches @search="onRecentSearch" />
    </div>
</template>
  
<script>
import { addWordToLocalStorage } from '../common/helpers';
import RecentSearches from './RecentSearches.vue';
import { api } from '../common/apis';
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
        },
        translate(targetLang) {
            if (this.searchText) {
                const sourceLang = 'en';

                const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(this.searchText);

                api.get(url).then(resp => resp.json()).then((result) => {
                    if (result && result[0] && result[0][0] && result[0][0][0]) {
                        this.searchText = result[0][0][0];
                    }
                })
            }
        }
    },
    components: { RecentSearches }
}
</script>
<style lang="scss">
.search-bar-holder {
    padding-bottom: 24px;

    .search-section {
        width: 100%;
        display: flex;

        .search-bar {
            flex-grow: 1;
            margin-right: 8px;
        }

        .sb-translate-section {
            .translate-lang {
                padding: 8px;
                cursor: pointer;

                &:hover {
                    background: rgba(0, 0, 0, 0.12);
                }
            }

        }
    }
}
</style>