<script setup>
import MainNav from '../components/MainNav.vue';
import WordCloud from '../components/WordCloud.vue';
</script>

<template>
    <div class="cloud-container container">
        <MainNav />
        <div class="view-wrapper-center">
            <WordCloud />
        </div>
    </div>
</template>

<style scoped>
.cloud-container {
    width: 100%;
    display: flex;
    place-items: center;
    flex-grow: 1;
    justify-content: center;
}
</style>