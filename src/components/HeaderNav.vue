<script setup>
import UserInfo from './UserInfo.vue';
import MobileNav from './MobileNav.vue';
</script>
<template>
    <div class="logo-header">
        <div v-if="isMobile" class="lh-mobile-nav">
            <MobileNav />
        </div>
        <div class="lh-logo-holder">
            <span class="lh-logo" @click="goHome">PAN<div class="logo-mag-shadow"><div class="logo-mag"></div></div>CR</span>
        </div>
        <div class="lh-user-holder" v-if="loggedIn">
            <UserInfo />
        </div>
    </div>
</template>
  
<script>
import { userStore } from '../store/user';
import { isMobile } from '../common/helpers';
export default {
    props: {

    },
    data: () => ({
        isMobile: isMobile
    }),
    computed: {
        loggedIn() {
            return userStore.getState().isAuthenticated;
        }
    },
    mounted() {

    },
    methods: {
        goHome() {
            this.$router.push("/");
        }
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.logo-header {
    height: 56px;
    background: var(--color-title-bg);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 4;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
    color: var(--color-title-text);
    font-size: 36px;
    text-shadow: 2px 2px black;
    display: flex;
    place-items: center;
    place-content: center;
    
    @include for-phone-only {
        width: 100%;
    }

    .lh-logo-holder {
        flex-grow: 1;
        text-align: center;
        .lh-logo {
            cursor: pointer;
            .logo-mag {
                display: inline-block;
                height: 44px;
                width: 44px;
                position: absolute;
                top: -2px;
                left: -2px;
                background-image: url(/src/assets/images/pan-ocr.png);
                background-size: contain;
            }
            .logo-mag-shadow {
                display: inline-block;
                height: 44px;
                width: 44px;
                background-image: url(/src/assets/images/pan-ocr-black.png);
                background-size: contain;
                transform: translate(2px, 10px);
                position: relative;
            }
        }
    }
    .lh-user-holder {
        padding: 0 8px;
        display: flex;
        place-content: center;
        place-items: center;
    }
}





</style>