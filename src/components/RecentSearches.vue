<template>
    <div class="recent-searches">
        <span class="rs-text">Recent Searches:</span>
        <div v-for="word in words" class="rs-words" @click="() => onWordClick(word)">{{ displayText(word) }}</div>
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
        const words = getWordsFromLocalStorage();
        if (words) {
            this.words = words.map(JSON.parse);
        }
    },
    methods: {
        onWordClick(wordData) {
            this.$emit('search', wordData);
        },
        displayText(wordData) {
            return wordData.map(w => w.text).join(" ");
        }
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.recent-searches {
    margin-top: 8px;
    padding: 0 8px;
    color: var(--color-text-primary);

    @include for-phone-only {
        .rs-text {
            display: block;
        }
    }

    .rs-words {
        display: inline-block;
        padding: 4px 12px;
        margin: 2px;
        cursor: pointer;
        text-decoration: none;
        color: var(--color-text-secondary);
        background: var(--color-neural-glow);
        border: 1px solid var(--color-card-border);
        border-radius: 20px;
        transition: all 0.3s ease;
        font-size: 14px;

        &:first-of-type {
            @include for-phone-only {
                padding-left: 0;
            }
        }

        &:hover {
            color: var(--color-text-primary);
            background: var(--color-header-icon-hover-bg);
            border-color: var(--color-border-gradient-start);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        &:not(:last-child) {
            margin-right: 8px;
        }
    }
}
</style>