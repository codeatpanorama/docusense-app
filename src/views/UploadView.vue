<script setup>
import UploadFile from '../components/UploadFile.vue'
import MainNav from '../components/MainNav.vue';
</script>

<template>
    <div class="upload-container container">
        <MainNav />
        <div class="view-wrapper-center">
            <UploadFile />
        </div>
    </div>
</template>

<style scoped>
.upload-container {
    width: 100%;
    display: flex;
    place-items: center;
    flex-grow: 1;
    justify-content: center;
}
</style>