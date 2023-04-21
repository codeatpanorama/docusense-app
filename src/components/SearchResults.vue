<script setup>
import PreviewFile from './PreviewFile.vue';
</script>
<template>
    <div class="sr-results-container">
        <div class="sr-no-data-wrapper" v-if="!documents || !documents.length">
            <div class="sr-no-data-content">
                <template v-if="searching">
                    <Vue3Lottie :animationData="searchAnim" :height="500" :width="500" />
                </template>
                <template v-else-if="!searchText">
                    <Vue3Lottie :animationData="searchDefaultAnim" :height="500" :width="500" />
                </template>
                <template v-else>
                    <div class="sr-no-records-text">No Records Found</div>
                    <Vue3Lottie :animationData="noDataAnim" :height="500" :width="500" />
                </template>
            </div>
        </div>
        <v-data-table v-else v-model:items-per-page="itemsPerPage" :headers="headers" :items="documents" :page="activePage"
            item-value="name" class="elevation-1" @click:row="onRowClick" hide-default-footer>
            <template v-slot:item.keywords="{ item }">
                <template v-for="keyword in item.raw.keywords">
                    <v-chip color="purple">{{ keyword }}</v-chip>
                </template>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-tooltip text="Download" location="top">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="small" class="sr-tb-action" @click.stop="downloadDocument(item.raw)">
                            mdi-download
                        </v-icon>
                    </template>
                </v-tooltip>
            </template>
            <template v-slot:bottom>
                <div class="sr-footer-container">
                    <div class="sr-footer-page-items">
                        <span>Items per page:</span>
                        <v-select :items="pageOptions" v-model="itemsPerPage" density="compact"></v-select>
                    </div>
                    <div class="sr-footer-info">
                        <div>{{ infoText }}</div>
                    </div>
                    <div class="sr-footer-pagination">
                        <v-btn class="sr-footer-pg-btn" size="large" density="compact" icon="mdi-page-first" :disabled="activePage == 1"
                            @click="firstPage"></v-btn>
                        <v-btn class="sr-footer-pg-btn" size="large" density="compact" icon="mdi-chevron-left" :disabled="activePage == 1"
                            @click="previousPage"></v-btn>
                        <v-btn class="sr-footer-pg-btn" size="large" density="compact" icon="mdi-chevron-right"
                            :disabled="activePage == pages" @click="nextPage"></v-btn>
                        <v-btn class="sr-footer-pg-btn" size="large" density="compact" icon="mdi-page-last" :disabled="activePage == pages"
                            @click="lastPage"></v-btn>
                    </div>
                </div>
            </template>
        </v-data-table>
        <div class="sr-preview-container">
            <v-card>
                <v-layout>
                    <v-navigation-drawer v-model="drawer" location="right" width="800" elevation="5" temporary>
                        <PreviewFile v-if="fileData" :fileData="fileData" :downloadSrcURL="downloadFileURL"
                            :fileName="fileName" @close="onPreviewClose" @download="downloadPreviewDoc" />
                    </v-navigation-drawer>
                </v-layout>
            </v-card>
        </div>
    </div>
</template>
<script>
import { openInNewTab, downloadBlob } from '../common/helpers'
import { api } from '../common/apis';
import { APIS } from '../common/constants';
import NoDataJSON from '../assets/animations/nodata.json';
import SearchingJSON from '../assets/animations/searching.json';
import SearchDefault from '../assets/animations/search-default.json';

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
        },
        searching: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            drawer: false,
            fileData: null,
            downloadFileURL: "",
            fileName: "",
            itemsPerPage: 10,
            pageOptions: [10, 25, 50, 100],
            activePage: 1,
            headers: TABLE_HEADERS,
            noDataAnim: NoDataJSON,
            searchAnim: SearchingJSON,
            searchDefaultAnim: SearchDefault
        }
    },
    watch: {
        searchText() {
            this.activePage = 1;
        }
    },
    computed: {
        records() {
            return this.documents?.length;
        },
        pages() {
            return this.documents && Math.ceil(this.documents.length / this.itemsPerPage);
        },
        infoText() {
            const start = this.itemsPerPage * (this.activePage - 1) + 1;
            const end = Math.min((start + this.itemsPerPage - 1), this.records);
            return `${start}-${end} of ${this.records}`;
        }
    },
    methods: {
        previewChanges(doc) {
            doc.resultFilePath && openInNewTab(doc.resultFilePath);
        },
        downloadDocument(doc) {
            this.downloadDoc(doc.sourceFilePath, doc.documentName)
        },
        downloadPreviewDoc() {
            this.downloadDoc(this.downloadFileURL, this.fileName)
        },
        downloadDoc(url, name) {
            api.get(APIS.DOWNLOAD, {
                path: url
            })
                .then((resp) => {
                    return resp.blob({ type: 'application/pdf' })
                })
                .then((blob) => {
                    downloadBlob(blob, name)
                })
                .catch((err) => {
                    console.log("Failed to download the document")
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
        },
        firstPage() {
            this.activePage = 1;
        },
        previousPage() {
            this.activePage -= 1;
        },
        nextPage() {
            this.activePage += 1;
        },
        lastPage() {
            this.activePage = this.pages;
        }
    }
}
</script>

<style>
.sr-tb-action:hover {
    transform: scale(1.15);
}

.sr-no-records-text {
    width: 100%;
    text-align: center;
    font-size: 28px;
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

.sr-results-container .sr-no-data-content {
    padding: 8px;
}

.sr-footer-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px;
    justify-content: flex-end;
    border-top: 1px solid var(--color-border-subtle);
}

.sr-footer-container .sr-footer-page-items {
    padding-inline-end: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sr-footer-container .sr-footer-page-items span {
    padding-inline-end: 24px;
}

.sr-footer-container .sr-footer-page-items .v-text-field .v-input__details {
    display: none;
}

.sr-footer-container .sr-footer-info {
    display: flex;
    padding-inline-end: 24px;
}

.sr-footer-pagination .sr-footer-pg-btn {
    margin-left: 4px;
    background: none;
    color: #000;
    border: none;
    box-shadow: none;
}

.sr-footer-pagination .sr-footer-pg-btn.v-btn--disabled {
    pointer-events: none;
    opacity: .26;
}

.sr-footer-pagination .sr-footer-pg-btn.v-btn--disabled .v-btn__overlay {
    background: none;
}
</style>