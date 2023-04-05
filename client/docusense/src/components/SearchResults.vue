<script setup>
import PreviewFile from './PreviewFile.vue';
</script>
<template>
    <div class="sr-results-container">
        <v-data-table 
            v-model:items-per-page="itemsPerPage" 
            :headers="headers" 
            :items="documents" 
            item-value="name"
            class="elevation-1"
            @click:row="onRowClick"
        >
            <template v-slot:item.keywords="{ item }">
                <template v-for="keyword in item.raw.keywords">
                    <v-chip color="purple">{{ keyword }}</v-chip>
                </template>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- <v-tooltip text="Preview" location="top">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="small" class="me-4 sr-tb-action" @click="previewChanges(item.raw)">
                            mdi-file-find
                        </v-icon>
                    </template>
                </v-tooltip> -->
                <v-tooltip text="Download" location="top">
                    <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" class="sr-tb-action" @click="downloadDocument(item.raw)">
                    mdi-download
                </v-icon>
                </template>
                </v-tooltip>
            </template>
        </v-data-table>
        <div class="sr-preview-container">
            <v-card>
                <v-layout>
                    <v-navigation-drawer
                        v-model="drawer"
                        location="right"
                        width="800"
                        elevation="5"
                        temporary
                    >
                        <PreviewFile 
                            v-if="fileURL" 
                            :fileURL="fileURL" 
                            :downloadSrcURL="fileURL"
                            :fileName="fileName"
                            @close="onPreviewClose" 
                        />
                    </v-navigation-drawer>
                </v-layout>
            </v-card>
        </div>
    </div>
</template>
<script>
import { openInNewTab, downloadItem } from '../common/helpers'

export default {
    props: {
        searchText: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            drawer: false,
            fileURL: "",
            downloadFileURL: "",
            fileName: "",
            itemsPerPage: 10,
            headers: [
                {
                    title: 'Keyword',
                    align: 'start',
                    sortable: false,
                    key: 'keywords',
                },
                {
                    title: 'File Name',
                    align: 'start',
                    key: 'documentName'
                },
                {
                    title: 'Page',
                    align: 'end',
                    sortable: false,
                    key: 'page'
                }, 
                {
                    title: 'Date',
                    align: 'start',
                    key: 'date',
                },
                {
                    title: 'Actions',
                    align: 'end',
                    sortable: false,
                    key: 'actions'
                }
            ],
            documents: [],
        }
    },

    mounted() {
        this.fillSampleDocuments();
    },

    methods: {
        fillSampleDocuments() {
            this.documents = [{
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'constitution.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/800',
                resultFilePath: 'https://picsum.photos/600/800'
            },
            {
                keywords: ['india'],
                date: "2022-02-07",
                documentName: 'laws.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/400/600',
                resultFilePath: 'https://picsum.photos/400/600'
            },
            {
                keywords: ['india'],
                date: "2022-01-12",
                documentName: 'legislature.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/800/600',
                resultFilePath: 'https://picsum.photos/800/600'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'literature.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/1600/800',
                resultFilePath: 'https://picsum.photos/1600/800'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'more.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/1800',
                resultFilePath: 'https://picsum.photos/600/1800'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'random.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/100/100',
                resultFilePath: 'https://picsum.photos/100/100'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'document.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/800',
                resultFilePath: 'https://picsum.photos/600/800'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'names.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/800',
                resultFilePath: 'https://picsum.photos/600/800'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'blah.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/800',
                resultFilePath: 'https://picsum.photos/600/800'
            },
            {
                keywords: ['india'],
                date: "2022-01-07",
                documentName: 'bleh.pdf',
                page: 1,
                sourceFilePath: 'https://picsum.photos/600/800',
                resultFilePath: 'https://picsum.photos/600/800'
            },]
        },
        previewChanges(doc) {
            doc.resultFilePath && openInNewTab(doc.resultFilePath);
        },
        downloadDocument(doc) {
            doc.sourceFilePath && downloadItem({
                url: doc.sourceFilePath,
                label: doc.documentName
            });
        },
        onRowClick(evt, row) {
            this.fileURL = row.item.value.resultFilePath;
            this.downloadFileURL = row.item.value.sourceFilePath;
            this.fileName = row.item.value.documentName;
            this.drawer = true;
        },
        onPreviewClose() {
            this.drawer = false;
            this.fileURL = "";
        }
    }
}
</script>

<style>
.sr-tb-action:hover {
    transform: scale(1.15);
}

.sr-results-container .v-table {
    border-radius: 8px;
}

.sr-results-container .v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
    background-color: var(--color-title-bg);
    color: var(--color-title-text);
}

.sr-results-container .v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th .v-data-table-header__content span {
    font-weight: bold;
}

.sr-preview-container {
    z-index: 5;
}
</style>