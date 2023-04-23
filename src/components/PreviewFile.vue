<template>
    <div class="preview-file-container">
        <div class="pf-actions-container">
            <v-icon size="small" icon="mdi-close-thick" @click="onClose"></v-icon>
            <div class="pf-file-name">{{ fileName }}</div>
            <v-btn v-if="downloadSrcURL" class="pf-download-btn" density="default" @click="downloadFile">Download</v-btn>
        </div>
        <div class="pf-file-preview">
            <embed class="pf-embed" loading="lazy" :type="fileType" :src="filePreviewURL" @load="onLoad" />
            <div class="pf-loader" v-if="loading">
                <v-progress-circular indeterminate :size="128" :width="12"></v-progress-circular>
            </div>
        </div>
    </div>
</template>
  
<script>
import { downloadItem, blobToBase64 } from '../common/helpers';
import { api } from '../common/apis'
import { APIS } from '../common/constants';

export default {
    props: {
        fileData: {
            default: null
        },
        fileType: {
            type: String,
            default: "image/jpeg"
        },
        previewWidth: {
            type: Number,
            default: 500
        },
        previewHeight: {
            type: Number,
            default: 500
        },
        downloadSrcURL: {
            type: String,
            default: ""
        },
        fileName: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        loading: false,
        filePreviewURL: ''
    }),
    mounted() {
        this.loadFile();
    },
    watch: {
        fileData(newVal, oldVal) {
            if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
                this.loadFile()
            }
        }
    },
    methods: {
        loadFile() {
            this.loading = true;
            api.post(APIS.PREVIEW, {
                path: this.fileData.url,
                coordinates: [this.fileData.data]
            })
            .then((resp) => {
                return resp.blob()
            })
            .then((blob) => {
                return blobToBase64(blob)
            })
            .then((res) => {
                this.filePreviewURL = res;
            })
            .catch((err) => {
                console.log("Failed to load doc preview")
            });
        },
        onClose() {
            this.$emit('close');
        },
        downloadFile() {
            this.$emit('download')
        },
        onLoad(evt) {
            this.loading = false;
            console.log(evt)
        }
    },
}
</script>
<style scoped>
.preview-file-container {
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.preview-file-container .pf-actions-container {
    margin-bottom: 8px;
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--color-border-subtle);
    padding-bottom: 8px;
    place-items: center;
}

.preview-file-container .pf-actions-container .pf-download-btn {
    align-self: end;
}

.preview-file-container .pf-actions-container .pf-file-name {
    flex-grow: 1;
    text-align: center;
    font-weight: 700;
}

.preview-file-container .pf-file-preview {
    flex-grow: 1;
    display: flex;
    place-content: center;
    place-items: center;
    position: relative;
}

.preview-file-container .pf-loader {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    place-content: center;
    place-items: center;
    background: #fff;
}

.pf-embed {
    max-height: 90vh;
    max-width: 100%;
    object-fit: scale-down;
}
</style>