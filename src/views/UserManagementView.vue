<script setup>
import UserManagement from '../components/UserManagement.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
    <div class="user-management-page container">
        <MainNav />
        <div class="view-wrapper-start">
            <div class="um-header-wrapper">
                <div class="um-header">User Management</div>
            </div>
            <div class="user-management-container">
                <UserManagement />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../assets/media.scss';

.user-management-page {
    .um-header-wrapper {
        padding: 8px;
        margin-bottom: 8px;
        font-size: 24px;
        font-weight: bold;
        color: #000;
        display: flex;
        justify-content: space-between;
    }
}

.user-management-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style> 