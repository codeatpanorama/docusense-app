<template>
    <div class="recent-searches">
        <span>Recent Searches:</span>
        <div v-for="word in words" class="rs-words" @click="() => onWordClick(word)">{{ word }}</div>
    </div>
</template>
<script>
import { getWordsFromLocalStorage } from '../common/helpers'
export default {
    props: {

    },
    data: () => ({
        words: []
    }),
    mounted() {
        this.words = getWordsFromLocalStorage();
    },
    methods: {
        onWordClick(word) {
            this.$emit('search', word);
        }
    },
}
</script>
<style>
.recent-searches {
    margin-top: 8px;
    padding: 0 8px;
    color: #000;
}

.recent-searches .rs-words {
    display: inline-block;
    padding: 0 16px;
    cursor: pointer;
    text-decoration: underline;
}

.recent-searches .rs-words:hover {
    color: var(--color-link-hover);
}

.recent-searches .rs-words:not(:last-child) {
    border-right: 1px solid;
}
</style>