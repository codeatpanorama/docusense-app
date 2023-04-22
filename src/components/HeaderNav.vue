<script setup>
import UserInfo from './UserInfo.vue';
</script>
<template>
    <div class="logo-header">
        <div class="lh-logo-holder">
            <span class="lh-logo" @click="goHome">PAN<v-icon class="logo-mag" size="small" icon="mdi-magnify"></v-icon>CR</span>
        </div>
        <div class="lh-user-holder" v-if="loggedIn">
            <UserInfo />
        </div>
    </div>
</template>
  
<script>
export default {
    props: {

    },
    data: () => ({

    }),
    computed: {
        loggedIn() {
            return this.$route.path.indexOf('/login') == -1;
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
<style scoped>
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
}

.logo-header .lh-logo {
    cursor: pointer;
}

.logo-header .lh-logo .logo-mag {
    transform: scale(1.4) translate(5px, 2px);
    /* animation: pendulum 1.25s ease-in-out alternate infinite; */
}

.logo-header .lh-logo-holder {
    flex-grow: 1;
    text-align: center;
}

.logo-header .lh-user-holder {
    padding: 0 8px;
    display: flex;
    place-content: center;
    place-items: center;
}

@keyframes search {

    0%,
    100% {}
}

@keyframes pendulum {

    0%,
    100% {
        transform: scale(1.4) translate(5px, 2px) rotate(0deg);
    }

    50% {
        transform: scale(1.4) translate(5px, 2px) rotate(90deg);
    }
}
</style>