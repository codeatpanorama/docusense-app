<template>
    <div class="logo-header">
        <span>PAN<v-icon class="logo-mag" size="small" icon="mdi-magnify"></v-icon>CR</span>
    </div>
</template>
  
<script>
export default {
    props: {

    },
    data: () => ({

    }),
    mounted() {

    },
    methods: {

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

.logo-mag {
    transform: scale(1.4) translate(5px, 2px);
    /* animation: pendulum 1.25s ease-in-out alternate infinite; */
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