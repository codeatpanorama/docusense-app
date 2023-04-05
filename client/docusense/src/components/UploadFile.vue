<template>
    <div class="upload-wrapper">
        <div class="up-header">
            <div class="up-header-text">New Document</div>
        </div>
        <div class="up-content">
            <div class="up-upload">
                <v-file-input
                    accept=".pdf,.doc,.docx"
                    label="Choose a file"
                    v-model="file"
                    @update:modelValue="updateFileName"
                ></v-file-input>
            </div>
            <div class="up-name">
                <v-text-field
                    label="Document Name"
                    v-model="name"
                    prepend-icon="mdi-file-document-edit"
                    :rules="[rules.required]"
                ></v-text-field>
            </div>
            <div class="up-tags">
                <v-text-field
                    label="Tags"
                    v-model="tag"
                    append-icon="mdi-plus-circle-outline"
                    prepend-icon="mdi-tag"
                    @click:append="addTag"
                    @keyup.enter="addTag"
                ></v-text-field>
            </div>
            <div class="up-tag-view">
                <v-chip
                    v-for="(sTag, idx) in tags"
                    class="ma-2"
                    color="purple"
                    text-color="white"
                    append-icon="mdi-close-circle"
                    @click="(evt) => {
                        if (evt.target.classList.contains('v-icon')) {
                            deleteTag(idx)
                        }
                    }"
                >
                    {{sTag}}
                </v-chip>
            </div>
            <div class="up-btn">
                <v-btn density="default" @click="onUpload">
                    Upload
                    <v-progress-circular v-if="uploading" class="up-loader" indeterminate size="16"></v-progress-circular>
                </v-btn>
            </div>
            <div class="up-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
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
import { APIS } from '../common/constants';
import axios from "axios";

const RESPONSES = {
    SUCCESS: (name) => ({
        type: "success",
        text: `${name} uploaded successfully!`
    }),
    FAILURE: (err) => ({
        type: "error",
        text: `Failed to upload document. ${err ? err : ''}`
    })
}

const FEEDBACK_TIMER = 5000;

export default {
    data: () => ({
        file: null,
        uploading: false,
        response: null,
        name: '',
        tag: '',
        tags: [],
        duplicateTag: false,
        rules: {
            required: value => !!value || 'Required.'
        }
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
        updateFileName(files) {
            if (files.length) {
                let nameArr = files[0].name.split('.');
                nameArr.pop();
                this.name = nameArr.join('.');
            } else {
                this.name = "";
            }
        },
        onUpload() {
            if (!this.uploading && this.file) {
                this.uploading = true;
                this.response = null;
                axios.post(APIS.UPLOAD, {
                    file: this.file[0],
                    tags: this.tags.join()
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((resp) => {
                    this.uploading = false;
                    this.file = null;
                    this.tags.length = 0;
                    this.response = RESPONSES.SUCCESS(resp?.data?.name);
                    setTimeout(() => {
                        this.response = null;
                    }, FEEDBACK_TIMER)
                }).catch((err) => {
                    this.uploading = false;
                    this.response = RESPONSES.FAILURE(err?.response?.data?.detail);
                    setTimeout(() => {
                        this.response = null;
                    }, FEEDBACK_TIMER)
                });
            }
        },
    },
}
</script>
<style scoped>
.upload-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    min-width: 400px;
    overflow: hidden;
}

.up-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);
}

.up-header-text {
    font-size: 16px;
    font-weight: bold;
}

.up-content {
    padding: 12px;
    color: #000;
}

.up-tag-view {
    max-width: 400px;
}

.up-btn {
    text-align: right;
}

.up-loader {
    margin-left: 8px;
}

.up-response {
    margin-top: 8px;
}
</style>