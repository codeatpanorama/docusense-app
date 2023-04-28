<template>
    <v-navigation-drawer
        v-model="drawer"
        location="bottom"
        temporary
      >
        <v-list>
            <v-list-item v-for="item of items">
                <RouterLink :to="item.link" class="hdr-link-a">
                    <v-icon size="small" :icon="item.icon"></v-icon>
                    <span class="nav-text">{{ item.text }}</span>
                </RouterLink>
            </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>
<script>
import { MENU_ITEMS } from '../common/constants';

export default {
    data: () => ({
        items: MENU_ITEMS
    })
}
</script>
<style lang="scss">
</style>