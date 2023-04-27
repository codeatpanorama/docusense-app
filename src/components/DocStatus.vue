<template>
    <div class="doc-status">
        <v-data-table :headers="headers" :items="documents" item-value="name" class="elevation-1" @click:row="onRowClick">
            <template v-slot:item.status="{ item }">
                <v-chip class="ds-chip" :prepend-icon="chipIcons[item.raw.status]" :color="chipColors[item.raw.status]">{{
                    chipText[item.raw.status] }}</v-chip>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import { api } from '../common/apis';
import { APIS } from '../common/constants';

const TABLE_HEADERS = [
    {
        title: 'File Name',
        align: 'start',
        sortable: true,
        key: 'name',
    },
    {
        title: 'Upload Date',
        align: 'start',
        key: 'date'
    },
    {
        title: 'Status',
        align: 'start',
        sortable: true,
        key: 'status'
    }
];

const STATUS_COLORS = {
    "In Progress": "orange",
    "Pending": "red",
    "Extracted": "green"
}

const STATUS_ICONS = {
    "In Progress": "mdi-timer-sand",
    "Pending": "mdi-progress-upload",
    "Extracted": "mdi-check-circle"
}

const STATUS_TEXT = {
    "In Progress": "In Progress",
    "Pending": "Pending",
    "Extracted": "Completed"
}

export default {
    props: {
    },
    data: () => ({
        documents: [],
        headers: TABLE_HEADERS,
        chipColors: STATUS_COLORS,
        chipIcons: STATUS_ICONS,
        chipText: STATUS_TEXT
    }),
    mounted() {
        // api.get(APIS.DOC_STATUS)
        //     .then((resp) => {
        //         console.log(resp)
        //     })
        this.documents = this.getSampleData();
    },
    methods: {
        getSampleData() {
            return [
                {
                    name: "Doc 5",
                    status: "Pending",
                    date: "2023-04-27"
                },
                {
                    name: "Doc 4",
                    status: "In Progress",
                    date: "2023-04-27"
                },
                {
                    name: "Doc 3",
                    status: "Extracted",
                    date: "2023-04-26"
                },
                {
                    name: "Doc 2",
                    status: "Extracted",
                    date: "2023-04-25"
                },
                {
                    name: "Doc 1",
                    status: "Extracted",
                    date: "2023-04-25"
                }
            ]
        },
        onRowClick() {
            console.log("Row clicked");
        }
    },
}
</script>
<style>
.doc-status .ds-chip {
    font-weight: bold;
}

.doc-status .v-table {
    border-radius: 8px;
}

.doc-status .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th {
    background-color: var(--color-title-bg);
    color: var(--color-title-text);
}

.doc-status .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th .v-data-table-header__content span {
    font-weight: bold;
}

.doc-status .v-table.v-table--fixed-header>.v-table__wrapper>table>tbody>tr.v-data-table__tr.v-data-table__tr--clickable:hover td {
    background-color: var(--color-row-bg-hover);
}
</style>