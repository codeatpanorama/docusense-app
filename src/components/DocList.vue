<template>
  <div class="doc-list">
    <v-data-table
      :headers="headers"
      :items="documents"
      item-value="name"
      class="elevation-1"
      @click:row="onRowClick"
    >
      <template v-slot:item.report="{ item }">
        <v-btn density="default" @click="onDownloadReport">Download Report</v-btn>
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
    key: 'report',
    sortable: false,
  }
]

export default {
  props: {},
  data: () => ({
    documents: [],
    headers: TABLE_HEADERS,
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
          name: doc.name,
          date: formatUTCDate(doc.createdAt),
          report: this.getDocStatus(doc)
        }
      })
    },
    onDownloadReport() {

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
