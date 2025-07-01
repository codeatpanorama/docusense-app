<script setup>
import MainNav from '../components/MainNav.vue';
</script>

<template>
    <div class="upload-container container">
        <MainNav />
        <div class="view-wrapper-center">
            <div class="disabled-message">
                <v-alert type="info" text="Bulk upload functionality has been disabled."></v-alert>
            </div>
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
    
    .disabled-message {
        max-width: 500px;
        width: 100%;
    }
}
</style>