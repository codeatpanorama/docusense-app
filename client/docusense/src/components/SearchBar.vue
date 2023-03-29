<template>
    <v-card theme="dark" color="grey-darken-3" max-width="400">
        <v-card-text>
            <v-text-field density="compact" variant="solo" label="Search documents" append-inner-icon="mdi-magnify"
                single-line clearable hide-details v-model="searchText" @click:append-inner="onSearch"
                @keyup.enter="onSearch"></v-text-field>
        </v-card-text>
    </v-card>
</template>
  
<script>
export default {
    props: {
        navigate: {
            type: Boolean,
            default: false
        },
        defaultVal: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        searchText: ""
    }),
    mounted() {
        this.searchText = this.defaultVal;
    },
    methods: {
        onSearch() {
            if (this.searchText) {
                this.$emit('search', this.searchText)
                if (this.navigate) {
                    this.$router.push(`/search/?text=${this.searchText}`)
                }
            }
        },
    },
}
</script>