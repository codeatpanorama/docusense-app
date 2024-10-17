<script setup>
import BulkUpload from '../components/BulkUpload.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
    <div class="upload-container container">
        <MainNav />
        <div class="view-wrapper-center">
            <BulkUpload />
        </div>
    </div>
</template>

<style lang="scss">
.upload-container {
    width: 100%;
    display: flex;
    place-items: center;
    flex-grow: 1;
    justify-content: center;
}
</style>