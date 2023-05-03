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
import { formatUTCDate } from '../common/helpers'

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
    "Pending": "red",
    "In Progress": "orange",
    "Extracted": "green",
    "Cancelled": "red"
}

const STATUS_ICONS = {
    "Pending": "mdi-progress-upload",
    "In Progress": "mdi-timer-sand",
    "Extracted": "mdi-check-circle",
    "Cancelled": "mdi-close-circle"
}

const STATUS_TEXT = {
    "Pending": "Pending",
    "In Progress": "In Progress",
    "Extracted": "Completed",
    "Cancelled": "Cancelled"
}

const DOC_STATUS = {
    NOT_STARTED: "Pending",
    STARTED: "In Progress",
    COMPLETED: "Extracted",
    CANCELLED: "Cancelled"
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
        api.get(APIS.ALL_DOCS)
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                this.documents = this.parseDocData(data);
            })
    },
    methods: {
        parseDocData(docs) {
            return docs.map((doc) => {
                return {
                    name: doc.name,
                    date: formatUTCDate(doc.createdAt),
                    status: this.getDocStatus(doc)
                }
            })
        },
        getDocStatus(doc) {
            if (doc.tasks) {
                const extraction = doc.tasks.find((task) => task.type == "EXTRACT");
                if (extraction && extraction.status == "COMPLETED") {
                    return DOC_STATUS.COMPLETED;
                }
                const process = doc.tasks.find((task) => task.type == "PROCESS");
                if (process) {
                    if (process.status == "CANCELLED") {
                        return DOC_STATUS.CANCELLED;
                    } else if (process.status != "NOT_STARTED") {
                        return DOC_STATUS.STARTED;
                    }
                }
            }
            return DOC_STATUS.NOT_STARTED;
        },
        onRowClick() {
            console.log("Row clicked");
        }
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';


.doc-status {
    @include for-phone-only {
        max-width: calc(100vw - 24px);
    }

    .ds-chip {
        font-weight: bold;
    }

    .v-table {
        border-radius: 8px;

        &.v-table--fixed-header>.v-table__wrapper>table {
            >thead>tr>th {
                background-color: var(--color-title-bg);
                color: var(--color-title-text);

                .v-data-table-header__content span {
                    font-weight: bold;
                }
            }

            >tbody>tr.v-data-table__tr.v-data-table__tr--clickable:hover td {
                background-color: var(--color-row-bg-hover);
            }
        }

        @include for-phone-only {
            .v-data-table-footer {
                justify-content: center;
            }
        }

    }

}</style>