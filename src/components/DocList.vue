<template>
  <div class="doc-list">
    <v-data-table
      :headers="headers"
      :items="documents"
      item-value="name"
      class="elevation-1"
      @click:row="onRowClick"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          class="ds-chip"
          :prepend-icon="chipIcons[item.status]"
          :color="chipColors[item.status]"
          >{{ chipText[item.status] }}</v-chip
        >
      </template>
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
import { ca } from 'vuetify/locale'
import { api } from '../common/apis'
import { APIS } from '../common/constants'
import { formatUTCDate, downloadBlob } from '../common/helpers'

const TABLE_HEADERS = [
  {
    title: 'File Name',
    align: 'start',
    sortable: true,
    key: 'name'
  },
  {
    title: 'Category',
    align: 'start',
    sortable: true,
    key: 'category'
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
  },
  {
    title: 'Actions',
    align: 'start',
    key: 'action',
    sortable: false
  }
]

const STATUS_COLORS = {
  Pending: 'red',
  'In Progress': 'orange',
  Extracted: 'green',
  Cancelled: 'red',
  Failed: 'red'
}

const STATUS_ICONS = {
  Pending: 'mdi-progress-upload',
  'In Progress': 'mdi-timer-sand',
  Extracted: 'mdi-check-circle',
  Cancelled: 'mdi-close-circle',
  Failed: 'mdi-close-circle'
}

const STATUS_TEXT = {
  Pending: 'Pending',
  'In Progress': 'In Progress',
  Extracted: 'Completed',
  Cancelled: 'Cancelled',
  Failed: 'Failed'
}

const DOC_STATUS = {
  NOT_STARTED: 'Pending',
  STARTED: 'In Progress',
  COMPLETED: 'Extracted',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed'
}

export default {
  props: {},
  data: () => ({
    documents: [],
    headers: TABLE_HEADERS,
    chipColors: STATUS_COLORS,
    chipIcons: STATUS_ICONS,
    chipText: STATUS_TEXT
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
          category: doc.category.toUpperCase(),
          date: formatUTCDate(doc.createdAt),
          path: doc.path,
          reportReady: this.checkReportStatus(doc),
          status: this.getDocStatus(doc)
        }
      })
    },
    checkReportStatus(doc) {
      if (doc.category === 'electoral') {
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
    getDocStatus(doc) {
      if (doc.tasks) {
        const report = doc.tasks.find((task) => task.type == 'REPORT')
        if (report) {
          switch (report.status) {
            case 'CANCELLED':
              return DOC_STATUS.CANCELLED
            case 'NOT_STARTED':
              return DOC_STATUS.NOT_STARTED
            case 'COMPLETED':
              return DOC_STATUS.COMPLETED
            case 'FAILED':
              return DOC_STATUS.FAILED
            case 'IN_PROGRESS':
              return DOC_STATUS.STARTED
          }
        }
        const extraction = doc.tasks.find((task) => task.type == 'EXTRACT')
        if (extraction && extraction.status == 'COMPLETED') {
          return DOC_STATUS.COMPLETED
        }
        const process = doc.tasks.find((task) => task.type == 'PROCESS')
        if (process) {
          if (process.status == 'CANCELLED') {
            return DOC_STATUS.CANCELLED
          } else if (process.status != 'NOT_STARTED') {
            return DOC_STATUS.STARTED
          }
        }
      }
      return DOC_STATUS.NOT_STARTED
    },
    onRowClick() {
      console.log('Row clicked')
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.doc-list {
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
