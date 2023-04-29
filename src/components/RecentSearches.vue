<template>
    <div class="recent-searches">
        <span class="rs-text">Recent Searches:</span>
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
<style lang="scss">
@import '../assets/media.scss';

.recent-searches {
    margin-top: 8px;
    padding: 0 8px;
    color: #000;

    @include for-phone-only {
        .rs-text {
            display: block;
        }
    }

    .rs-words {
        display: inline-block;
        padding: 0 16px;
        cursor: pointer;
        text-decoration: underline;

        &:first-of-type {
            @include for-phone-only {
                padding-left: 0;
            }
        }

        &:hover {
            color: var(--color-link-hover);
        }

        &:not(:last-child) {
            border-right: 1px solid;
        }
    }
}
</style>