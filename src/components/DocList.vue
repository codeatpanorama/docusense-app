<template>
  <div class="doc-list">
    <v-data-table
      :headers="headers"
      :items="documents"
      item-value="name"
      class="elevation-1"
      @click:row="onRowClick"
    >
      <template v-slot:item.action="{ item }">
        <v-btn class="mr-4" density="default" @click="() => onDownloadDocument(item)"
          ><v-icon class="mr-2" size="small" icon="mdi-download"></v-icon> Document</v-btn
        >
        <v-btn v-if="item.reportReady" density="default" @click="() => onDownloadReport(item)"
          ><v-icon class="mr-2" size="small" icon="mdi-download"></v-icon> Report</v-btn
        >
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { api } from '../common/apis'
import { APIS } from '../common/constants'
import { formatUTCDate } from '../common/helpers'

const TABLE_HEADERS = [
  {
    title: 'File Name',
    align: 'start',
    sortable: true,
    key: 'name'
  },
  {
    title: 'Upload Date',
    align: 'start',
    key: 'date'
  },
  {
    title: 'Actions',
    align: 'start',
    key: 'action',
    sortable: false
  }
]

export default {
  props: {},
  data: () => ({
    documents: [
      {
        id: 'ffb01bbd-f58e-4f49-b53e-b40c830efe3a',
        name: 'Building Completion Certificate',
        path: 'repository/ffb01bbd-f58e-4f49-b53e-b40c830efe3a/ffb01bbd-f58e-4f49-b53e-b40c830efe3a.pdf',
        type: 'application/pdf',
        size: 11443881,
        author: 'test@user',
        category: 'Electoral',
        tasks: [
          {
            id: '99de01d8-c7e6-4730-af2b-840ed736e1b7',
            documentId: 'ffb01bbd-f58e-4f49-b53e-b40c830efe3a',
            type: 'REPORT',
            status: 'COMPLETED'
          }
        ]
      }
    ],
    headers: TABLE_HEADERS
  }),
  mounted() {
    api
      .get(APIS.ALL_DOCS)
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        this.documents = this.parseDocData(data)
      })
  },
  methods: {
    parseDocData(docs) {
      return docs.map((doc) => {
        return {
          id: doc.id,
          name: doc.name,
          date: formatUTCDate(doc.createdAt),
          path: doc.path,
          reportReady: this.checkReportStatus(doc)
        }
      })
    },
    checkReportStatus(doc) {
      if (doc.category === 'Electoral') {
        const tasks = doc.tasks ?? []
        const reportTasks = tasks.filter(
          (task) => task.type === 'REPORT' && task.status === 'COMPLETED'
        )
        return reportTasks.length > 0
      }
      return false
    },
    onDownloadDocument(doc) {
      api
        .get(APIS.DOWNLOAD, {
          path: doc.path
        })
        .then((resp) => {
          return resp.blob({ type: 'application/pdf' })
        })
        .then((blob) => {
          downloadBlob(blob, doc.name)
        })
        .catch((err) => {
          console.log('Failed to download the document')
        })
    },
    onDownloadReport(doc) {
      api
        .get(APIS.REPORT, {
          documentId: doc.id
        })
        .then((resp) => {
          return resp.blob({ type: 'text/csv' })
        })
        .then((blob) => {
          downloadBlob(blob, `${doc.name}-report`)
        })
        .catch((err) => {
          console.log('Failed to download the report')
        })
    },
    onRowClick() {
      console.log('Row clicked')
    }
  }
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

    &.v-table--fixed-header > .v-table__wrapper > table {
      > thead > tr > th {
        background-color: var(--color-title-bg);
        color: var(--color-title-text);

        .v-data-table-header__content span {
          font-weight: bold;
        }
      }

      > tbody > tr.v-data-table__tr.v-data-table__tr--clickable:hover td {
        background-color: var(--color-row-bg-hover);
      }
    }

    @include for-phone-only {
      .v-data-table-footer {
        justify-content: center;
      }
    }
  }
}
</style>
