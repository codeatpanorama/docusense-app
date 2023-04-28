<template>
    <div class="tag-editor">
        <div class="te-tags">
            <v-text-field label="Tags" v-model="tag" append-icon="mdi-plus-circle-outline" prepend-icon="mdi-tag"
            @click:append="addTag" @keyup.enter="addTag"></v-text-field>
        </div>
        <div class="te-tag-view">
            <v-chip v-for="(sTag, idx) in tags" class="ma-2" color="purple" text-color="white" append-icon="mdi-close-circle"
            @click="(evt) => {
                if (evt.target.classList.contains('v-icon')) {
                    deleteTag(idx)
                }
            }">
                {{ sTag }}
            </v-chip>
        </div>
        <v-snackbar
            v-model="duplicateTag"
            :timeout="2000"
            >
            Duplicate tag
        </v-snackbar>
    </div>
</template>

<script>
export default {
    data: () => ({
        tag: '',
        tags: [],
        duplicateTag: false,
    }),

    methods: {
        addTag() {
            if(this.tag) {
                if (this.tags.indexOf(this.tag.trim()) != -1) {
                    this.duplicateTag = true;
                } else {
                    this.tags.push(this.tag.trim());
                    this.tag = "";
                }
            }
        },
        deleteTag(idx) {
            this.tags.splice(idx, 1);
        },
    },
}
</script>
<style lang="scss">
</style>