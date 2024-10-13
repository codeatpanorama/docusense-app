
<template>
    <div class="search-bar-holder">
        <div class="search-section">
            <div class="search-bar">
                <v-text-field density="compact" variant="solo" label="Search keywords" append-inner-icon="mdi-magnify"
                    single-line clearable hide-details v-model="searchText" @click:append-inner="onSearch"
                    @keyup.enter="onSearch" @keyup.space="addChip">
                    <template v-slot:prepend-inner>
                        <div v-for="(chip, index) in chips" :key="index">
                            <v-tooltip :text="chip.required ? 'Required' : 'Optional'" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-chip v-bind="props" class="ma-1" :class="chip.required ? 'required-chip' : 'optional-chip'"  closable
                                        @click="toggleRequired(index)" @click:close="removeChip(index)">{{ chip.text
                                        }}</v-chip>
                                </template>
                            </v-tooltip>
                        </div>
                    </template>
                </v-text-field>
            </div>
            <div class="sb-translate-section">
                <v-menu :open-on-hover="!isMobile">
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
import { addWordToLocalStorage, isMobile, encodeBase64 } from '../common/helpers';
import RecentSearches from './RecentSearches.vue';
import { api } from '../common/apis';
export default {
    props: {
        navigate: {
            type: Boolean,
            default: false
        },
        defaultData: {
            type: Array,
            default: []
        }
    },
    data: () => ({
        searchText: "",
        isMobile: isMobile,
        chips: [],
    }),
    mounted() {
        if (this.defaultData?.length) {
            this.chips = this.defaultData;
        }
    },
    methods: {
        onSearch() {
            if (this.chips?.length) {
                this.performSearch(this.chips);
            }
        },
        onRecentSearch(wordData) {
            this.performSearch(wordData);
            this.chips = wordData.slice();
        },
        performSearch(searchData) {
            const storageData = JSON.stringify(searchData);
            addWordToLocalStorage(storageData);
            this.$emit("search", searchData);
            if (this.navigate) {
                this.$router.push(`/search/?data=${encodeBase64(storageData)}`);
            }
        },
        removeChip(idx) {
            this.chips.splice(idx, 1);
        },
        addChip() {
            this.chips.push({
                text: this.searchText,
                required: true,
            });
            this.searchText = "";
        },
        toggleRequired(idx) {
            this.chips[idx].required = !this.chips[idx].required;
        },
        translate(targetLang) {
            if (this.chips?.length) {
                this.chips.forEach((chip, idx) => {
                    this.translateText(chip.text, targetLang, idx);
                })
            }
        },
        translateText(text, targetLang, idx) {
            const sourceLang = 'en';

            const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(text);

            api.get(url).then(resp => resp.json()).then((result) => {
                if (result && result[0] && result[0][0] && result[0][0][0]) {
                    this.chips[idx].text = result[0][0][0];
                }
            })
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

            .v-input {
                .v-chip {
                    &.optional {
                        opacity: 0.7;
                    }
                }
            }
        }
    }

    .required-chip {
        background-color: rgb(237, 112, 112); /* Change to the color you want for required chips */
    }

    .optional-chip {
        background-color: rgb(78, 147, 78); /* Change to the color you want for optional chips */
    }
}

.v-list-item-title {
    &.translate-lang {
        padding: 8px;
        cursor: pointer;

        &:hover {
            background: rgba(0, 0, 0, 0.12);
        }
    }
}
</style>