<template>
    <div class="preview-file-container">
        <div class="pf-actions-container">
            <v-icon size="small" icon="mdi-close-thick" @click="onClose"></v-icon>
            <div class="pf-file-name">{{ fileName }}</div>
            <v-btn v-if="downloadSrcURL" class="pf-download-btn" density="default" @click="downloadFile">Download</v-btn>
        </div>
        <div class="pf-file-preview">
            <embed 
                class="pf-embed"
                loading="lazy"
                :type="fileType"
                :src="fileURL"
                :width="previewWidth"
                :height="previewHeight"
                @load="onLoad"
            />
            <div class="pf-loader" v-if="loading">
                <v-progress-circular indeterminate :size="128" :width="12"></v-progress-circular>
            </div>
        </div>
    </div>
</template>
  
<script>
import { downloadItem } from '../common/helpers'

export default {
    props: {
        fileURL: {
            type: String,
            default: ""
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
        loading: false
    }),
    mounted() {
        
    },
    watch: { 
        fileURL(newVal, oldVal) {
            if (newVal != oldVal) {
                this.loading = true;
            }
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
        downloadFile() {
            this.downloadSrcURL && downloadItem({
                url: this.downloadSrcURL,
                label: this.fileName
            });
            
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
    object-fit: scale-down;
}
</style>