<script setup>
import LogoutDialog from './LogoutDialog.vue';
</script>
<template>
    <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account" size="x-small" v-bind="props"></v-btn>
        </template>

        <v-list>
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <LogoutDialog></LogoutDialog>
        </v-list>
    </v-menu>
</template>
<script>
export default {
    props: {

    },
    data: () => ({
        items: []
    }),
    mounted() {
    },
    methods: {

    },
}
</script>
<style></style>