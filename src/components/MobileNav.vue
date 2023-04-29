<template>
    <div class="nav-bar-menu">
        <v-layout>
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-navigation-drawer v-model="drawer" location="left" temporary class="mobile-nav-bar-drawer" width="90%">
                <div class="close-wrapper">
                    <v-icon icon="mdi-close-thick" size="x-small" @click="drawer = false"></v-icon>
                </div>
                <v-list class="nav-bar-nav-list">
                    <v-list-item v-for="item of items">
                        <RouterLink :to="item.link" class="hdr-link-a">
                            <v-icon size="small" :icon="item.icon"></v-icon>
                            <span class="nav-text">{{ item.text }}</span>
                        </RouterLink>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </v-layout>
    </div>
</template>
<script>
import { MENU_ITEMS } from '../common/constants';

export default {
    data: () => ({
        drawer: false,
        items: MENU_ITEMS
    })
}
</script>
<style lang="scss">
.mobile-nav-bar-drawer {
    width: 90%;

    .close-wrapper {
        text-align: right;
        padding: 0 16px;
        text-shadow: none;
    }

    .nav-bar-nav-list {
        a.hdr-link-a {
            font-size: 24px;
            text-decoration: none;
            text-shadow: none;
            display: flex;
            place-content: flex-start;
            place-items: center;
            padding: 16px 8px;
            color: #000;
            text-transform: uppercase;
            border-bottom: 1px solid var(--color-border-subtle);

            .nav-text {
                margin-left: 8px;
            }

            &.router-link-active {
                color: var(--color-header-icon-hover);
            }
        }
    }

}
</style>