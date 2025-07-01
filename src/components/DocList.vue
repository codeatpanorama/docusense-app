<template>
  <div class="doc-list">
    <v-data-table
      :headers="headers"
      :items="documents"
      item-value="name"
      class="elevation-1"
      :items-per-page="25"
      :items-per-page-options="[25, 50, 100]"
      @click:row="onRowClick"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          v-if="item.category !== 'ELECTORAL'"
          class="ds-chip"
          :prepend-icon="chipIcons[item.status]"
          :color="chipColors[item.status]"
        >
          {{ item.status }}
        </v-chip>

        <div v-else class="status-indicators">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <div 
                class="status-circle" 
                :class="chipColors[item.validationStatus]"
                v-bind="props"
              >
                V
              </div>
            </template>
            <span>Validation: {{ item.validationStatus }}</span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <div 
                class="status-circle" 
                :class="chipColors[item.reportStatus]"
                v-bind="props"
              >
                R
              </div>
            </template>
            <span>Report: {{ item.reportStatus }}</span>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:item.action="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              variant="plain"
              color="default"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="() => onDownloadDocument(item)">
              <template v-slot:prepend>
                <v-icon>mdi-download</v-icon>
              </template>
              <v-list-item-title>Download Document</v-list-item-title>
            </v-list-item>

            <v-list-item 
              v-if="item.reportReady" 
              @click="() => onDownloadReport(item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-download</v-icon>
              </template>
              <v-list-item-title>Download Report</v-list-item-title>
            </v-list-item>

            <v-list-item 
              v-if="isAdmin && item.retryStatus" 
              @click="() => onRetry(item.retryTaskId)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-reload</v-icon>
              </template>
              <v-list-item-title>Retry</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { ca } from 'vuetify/locale'
import { api } from '../common/apis'
import { APIS } from '../common/constants'
import { formatUTCDate, downloadBlob } from '../common/helpers'
import { userStore } from '../store/user'

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
    title: 'Number of Checks',
    align: 'start',
    sortable: true,
    key: 'checks'
  },
  {
    title: 'Status',
    align: 'start',
    sortable: false,
    key: 'status'
  },
  {
    title: 'Actions',
    align: 'start',
    key: 'action',
    sortable: false
  }
]

const DOC_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  DUPLICATE: 'Duplicate',
  PENDING: 'Pending'
}

const STATUS_COLORS = {
  'Not Started': 'grey',
  'In Progress': 'orange',
  'Completed': 'green',
  'Failed': 'red',
  'Cancelled': 'red',
  'Duplicate': 'purple',
  'Pending': 'blue'
}

const STATUS_ICONS = {
  'Not Started': 'mdi-clock-outline',
  'In Progress': 'mdi-timer-sand',
  'Completed': 'mdi-check-circle',
  'Failed': 'mdi-close-circle',
  'Cancelled': 'mdi-close-circle',
  'Duplicate': 'mdi-content-copy',
  'Pending': 'mdi-progress-clock'
}

const STATUS_TEXT = {
  'Not Started': 'Not Started',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Failed': 'Failed',
  'Cancelled': 'Cancelled',
  'Duplicate': 'Duplicate',
  'Pending': 'Pending'
}

export default {
  props: {},
  data: () => ({
    isAdmin: false,
    documents: [],
    headers: TABLE_HEADERS,
    chipColors: STATUS_COLORS,
    chipIcons: STATUS_ICONS,
    chipText: STATUS_TEXT
  }),
  mounted() {
    const entitlements = userStore.getState().entitlements ?? []
    this.isAdmin = entitlements.includes('ADMIN')
    this.fetchDocuments()
  },
  methods: {
    fetchDocuments() {
      api
        .get(APIS.ALL_DOCS)
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          this.documents = this.parseDocData(data)
        })
    },
    parseDocData(docs) {
      return docs.map((doc) => {
        const baseData = {
          id: doc.id,
          name: doc.name,
          category: doc.category.toUpperCase(),
          state: doc.state.toUpperCase(),
          district: doc.district.toUpperCase(),
          constituency: doc.constituency.toUpperCase(),
          date: formatUTCDate(doc.createdAt),
          path: doc.path,
          checks: this.getNumberOfChecks(doc),
        }

        if (doc.category === 'electoral') {
          const tasks = doc.tasks ?? []
          const validateTask = tasks.find(task => task.type === 'VALIDATE')
          const reportTask = tasks.find(task => task.type === 'REPORT')

          return {
            ...baseData,
            validationStatus: this.getTaskStatus(validateTask),
            reportStatus: this.getTaskStatus(reportTask),
            reportReady: reportTask?.status === 'COMPLETED',
            retryStatus: (validateTask?.status === 'FAILED' || reportTask?.status === 'FAILED'),
            retryTaskId: validateTask?.status === 'FAILED' ? validateTask.id : reportTask?.id
          }
        }

        return {
          ...baseData,
          status: this.getDocStatus(doc),
          reportReady: this.checkReportStatus(doc),
          ...this.getRetryInfo(doc)
        }
      })
    },
    getTaskStatus(task) {
      if (!task) return DOC_STATUS.NOT_STARTED
      
      switch (task.status) {
        case 'NOT_STARTED': return DOC_STATUS.NOT_STARTED
        case 'IN_PROGRESS': return DOC_STATUS.IN_PROGRESS
        case 'COMPLETED': return DOC_STATUS.COMPLETED
        case 'FAILED': return DOC_STATUS.FAILED
        case 'CANCELLED': return DOC_STATUS.CANCELLED
        case 'DUPLICATE': return DOC_STATUS.DUPLICATE
        case 'PENDING': return DOC_STATUS.PENDING
        default: return DOC_STATUS.NOT_STARTED
      }
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
    getRetryInfo(doc) {
      if (doc.category === 'electoral') {
        const tasks = doc.tasks ?? []
        const reportTasks = tasks.filter(
          (task) =>
            ( task.type === 'REPORT' || task.type === 'VALIDATE') && (task.status === 'CANCELLED' || task.status === 'FAILED')
        )
        return { retryStatus: reportTasks.length > 0, retryTaskId: reportTasks?.[0]?.id }
      }
      return false
    },
    getNumberOfChecks(doc) {
      // For now, we'll use a placeholder value
      // This can be updated based on actual data structure
      if (doc.category === 'electoral') {
        const tasks = doc.tasks ?? []
        return tasks.length
      }
      // For non-electoral documents, return a default value
      return doc.checks || 0
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
    onRetry(taskId) {
      api
        .patch(`${APIS.TASK}/${taskId}`, {
          status: 'NOT_STARTED'
        })
        .then(() => {
          this.fetchDocuments()
        })
    },
    getDocStatus(doc) {
      if (doc.tasks) {
        const report = doc.tasks.find((task) => ( task.type == 'REPORT' ))
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

  .status-indicators {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .status-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;

    &.grey { background-color: grey; }
    &.orange { background-color: orange; }
    &.green { background-color: #4CAF50; }
    &.red { background-color: #FF5252; }
    &.purple { background-color: #9C27B0; }
    &.blue { background-color: #2196F3; }
  }
}
</style>