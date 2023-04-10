<script setup>
import PreviewFile from './PreviewFile.vue';
</script>
<template>
    <div class="sr-results-container">
        <div class="sr-no-data-wrapper" v-if="!documents || !documents.length">
            <div class="sr-no-data-text">
                No data available...
            </div>
        </div>
        <v-data-table v-else v-model:items-per-page="itemsPerPage" :headers="headers" :items="documents" item-value="name"
            class="elevation-1" @click:row="onRowClick">
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
                        <v-icon v-bind="props" size="small" class="sr-tb-action" @click.stop="downloadDocument(item.raw)">
                            mdi-download
                        </v-icon>
                    </template>
                </v-tooltip>
            </template>
        </v-data-table>
        <div class="sr-preview-container">
            <v-card>
                <v-layout>
                    <v-navigation-drawer v-model="drawer" location="right" width="800" elevation="5" temporary>
                        <PreviewFile v-if="fileData" :fileData="fileData"
                            :downloadSrcURL="downloadFileURL" :fileName="fileName" @close="onPreviewClose" />
                    </v-navigation-drawer>
                </v-layout>
            </v-card>
        </div>
    </div>
</template>
<script>
import { openInNewTab, downloadItem } from '../common/helpers'

const TABLE_HEADERS = [
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
    // {
    //     title: 'Date',
    //     align: 'start',
    //     key: 'date',
    // },
    {
        title: 'Actions',
        align: 'end',
        sortable: false,
        key: 'actions'
    }
];

export default {
    props: {
        searchText: {
            type: String,
            default: ""
        },
        documents: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            drawer: false,
            fileData: null,
            downloadFileURL: "",
            fileName: "",
            itemsPerPage: 10,
            headers: TABLE_HEADERS,
        }
    },

    methods: {
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
            const doc = row.item.value;
            this.fileData = {
                url: doc.resultFilePath,
                data: doc.rect
            };
            this.downloadFileURL = doc.sourceFilePath;
            this.fileName = doc.documentName;
            this.drawer = true;
        },
        onPreviewClose() {
            this.drawer = false;
            this.fileData = null;
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

.sr-results-container .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th {
    background-color: var(--color-title-bg);
    color: var(--color-title-text);
}

.sr-results-container .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th .v-data-table-header__content span {
    font-weight: bold;
}

.sr-results-container .v-table.v-table--fixed-header>.v-table__wrapper>table>tbody>tr.v-data-table__tr.v-data-table__tr--clickable:hover td {
    background-color: var(--color-row-bg-hover);
}

.sr-preview-container {
    z-index: 5;
}
</style>