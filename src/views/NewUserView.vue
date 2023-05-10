<script setup>
import NewUser from '../components/NewUser.vue';
</script>

<template>
    <div class="new-user-container">
        <NewUser />
    </div>
</template>

<style lang="scss">
.new-user-container {
    width: 100%;
    display: flex;
    place-items: center;
    flex-grow: 1;
    justify-content: center;
}
</style>