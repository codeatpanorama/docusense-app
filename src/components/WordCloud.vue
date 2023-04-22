<template>
    <vue-word-cloud style="height: 480px; width: 640px;" :words="words"
        :color="([, weight]) => weight > 10 ? '#5225d3' : weight > 5 ? '#4e4ff8' : '#8868fd'" font-family="Montserrat" />
    <!-- <vue-word-cloud :words="words" style="height: 480px; width: 640px;">
        <template slot-scope="{text, weight, word}">
            <div :title="weight" style="cursor: pointer;" @click="onWordClick(word)">
                {{ text }}
            </div>
        </template>
    </vue-word-cloud> -->
</template>
<script>
export default {
    props: {
    },
    data: () => ({
        words: null
    }),
    mounted() {
        this.fetchWords();
    },
    methods: {
        fetchWords() {
            this.fillSampleWords()
        },
        fillSampleWords() {
            this.words = [['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]];
        },
        onWordClick(word) {
            console.log(word);
        }
    },
}
</script>
<style></style>