<script setup>
import UploadFile from '../components/UploadFile.vue'
</script>

<template>
    <div class="upload-container">
        <UploadFile />
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