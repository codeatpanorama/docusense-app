<script setup>
import LogoutDialog from './LogoutDialog.vue';
</script>
<template>
    <v-menu :open-on-hover="!isMobile">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account" size="x-small" v-bind="props"></v-btn>
        </template>

        <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" class="user-info-item">
                <RouterLink v-if="item.link" :to="item.link" class="hdr-link-a">
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                </RouterLink>
                <v-list-item-title v-else>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <LogoutDialog></LogoutDialog>
        </v-list>
    </v-menu>
</template>
<script>
import { isMobile } from '../common/helpers';
import { userStore } from '../store/user';
import { updateLoggedInUser } from '../common/user';

export default {
    props: {

    },
    data: () => ({
        items: [{
            text: 'Change Password',
            link: '/change-password/'
        }],
        isMobile: isMobile

    }),
    mounted() {
        if (userStore.getState().isAuthenticated) {
            updateLoggedInUser();
        }
    },
    methods: {

    },
}
</script>
<style lang="scss">
.user-info-item {
    &:hover {
        background-color: var(--color-border-subtle);
    }
    a.hdr-link-a {
        text-decoration: none;
    }
    .v-list-item-title {
        color: #000;
    }
}
</style>