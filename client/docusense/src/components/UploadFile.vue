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

const RESPONSES = {
    SUCCESS: {
        type: "success",
        text: "Document uploaded successfully!"
    },
    FAILURE: {
        type: "error",
        text: "Failed to upload document"
    }
}
export default {
    data: () => ({
        file: null,
        uploading: false,
        response: null
    }),

    methods: {
        onUpload() {
            if (!this.uploading && this.file) {
                this.uploading = true;
                this.response = null;
                console.log("Upload file to server...");
                setTimeout(() => {
                    this.uploading = false;
                    this.file = null;
                    this.response = RESPONSES.SUCCESS
                    setTimeout(() => {
                        this.response = null;
                    }, 3000)
                }, 4000)
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