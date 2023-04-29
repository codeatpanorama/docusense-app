<template>
    <div class="header">
        <div class="hd-nav-drawer">
            <div class="hdr-link" v-for="item of items">
                <v-tooltip :text="item.text">
                    <template v-slot:activator="{ props }">
                        <RouterLink v-bind="props" :to="item.link" class="hdr-link-a">
                            <v-icon size="small" :icon="item.icon"></v-icon>
                        </RouterLink>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>
  
<script>
import { MENU_ITEMS } from '../common/constants';
export default {
    props: {

    },
    data: () => ({
        items: MENU_ITEMS
    }),
    mounted() {

    },
    methods: {

    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.header {
    height: 100vh;
    padding-top: 56px;
    position: fixed;
    left: 0;
    top: 0;
    background: var(--color-header-bg);

    @include for-phone-only {
        display: none;
    }

    .hd-nav-drawer {
        height: 100vh;
        width: 56px;
        background: var(--color-heading);
        border-right: 1px solid var(--color-border-subtle);
        padding: 8px;

        .hdr-link {

            a.hdr-link-a {
                display: inline-block;
                text-decoration: none;
                text-align: center;
                padding: 8px;
                height: 40px;
                width: 40px;
                border-radius: 50%;
                margin-bottom: 8px;
                cursor: pointer;

                .v-icon {
                    color: var(--color-header-icon);
                }

                &:hover {
                    background: var(--color-header-icon-hover-bg);

                    .v-icon {
                        color: var(--color-header-icon-hover);
                    }
                }

                &.router-link-active {

                    .v-icon {
                        color: var(--color-header-icon-hover);
                    }
                }
            }
        }
    }
}
</style>