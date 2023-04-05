<template>
    <div class="header">
        <div class="hd-nav-drawer">
            <div class="hdr-link">
                <v-tooltip text="Home">
                    <template v-slot:activator="{ props }">
                        <RouterLink v-bind="props" to="/" class="hdr-link-a">
                            <v-icon size="small" icon="mdi-home-analytics"></v-icon>
                        </RouterLink>
                    </template>
                </v-tooltip>
            </div>
            <div class="hdr-link">
                <v-tooltip text="File Upload">
                    <template v-slot:activator="{ props }">
                        <RouterLink v-bind="props" to="/upload/" class="hdr-link-a">
                            <v-icon size="small" icon="mdi-file-upload"></v-icon>
                        </RouterLink>
                    </template>
                </v-tooltip>
            </div>
            <div class="hdr-link">
                <v-tooltip text="Search">
                    <template v-slot:activator="{ props }">
                        <RouterLink v-bind="props" to="/search/" class="hdr-link-a">
                            <v-icon size="small" icon="mdi-file-search"></v-icon>
                        </RouterLink>
                    </template>
                </v-tooltip>
            </div>
            <div class="hdr-link">
                <v-tooltip text="Logout">
                    <template v-slot:activator="{ props }">
                        <a v-bind="props" class="hdr-link-a">
                            <v-icon size="small" icon="mdi-logout-variant"></v-icon>
                        </a>
                    </template>
                </v-tooltip>
            </div>
        </div>
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
.header {
    height: 100vh;
    padding-top: 56px;
    position: fixed;
    left: 0;
    top: 0;
    background: var(--color-header-bg);
}
.hd-nav-drawer {
    height: 100vh;
    width: 56px;
    background: var(--color-heading);
    border-right: 1px solid var(--color-border-subtle);
    padding: 8px;
}

.hdr-link a.hdr-link-a {
    display: inline-block;
    text-decoration: none;
    text-align: center;
    padding: 8px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-bottom: 8px;
    cursor: pointer;
}

.hdr-link a.hdr-link-a:hover {
    background: var(--color-header-icon-hover-bg);
}

.hdr-link a.hdr-link-a:hover .v-icon {
    color: var(--color-header-icon-hover);
}

.hdr-link a.hdr-link-a .v-icon {
    color: var(--color-header-icon);
}
</style>