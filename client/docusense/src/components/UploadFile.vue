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
                ></v-file-input>
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
        tags: ['test', 'tag0']
    }),

    methods: {
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
                    this.response = RESPONSES.SUCCESS(resp.name);
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
    padding: 12px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    min-width: 400px;
}

.up-header {
    padding: 0 0 16px 8px;
    border-bottom: 2px solid var(--color-border);
    font-size: 16px;
    font-weight: bold;
}

.up-content {
    padding-top: 16px;
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