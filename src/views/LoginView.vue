<script setup>
import LoginSection from '../components/LoginSection.vue';
</script>

<template>
    <div class="login-container">
        <LoginSection />
    </div>
</template>

<style lang="scss">
.login-container {
    width: 100%;
    display: flex;
    place-items: center;
    flex-grow: 1;
    justify-content: center;
}
</style>