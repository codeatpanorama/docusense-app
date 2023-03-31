<template>
    <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="desserts"
    item-value="name"
    class="elevation-1"
  ></v-data-table>
</template>
<script>
  export default {
    data () {
      return {
        itemsPerPage: 5,
        headers: [
          {
            title: 'Keyword',
            align: 'start',
            sortable: false,
            key: 'keyword',
          },
          { title: 'File Name', align: 'end', key: 'filename' },
          { title: 'Page', align: 'end', key: 'page' },
          { title: 'Actions', align: 'end', key: '' }
        ],
        desserts: [
          {
            keyword: 'india',
            filename: 'constitution.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'laws.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'legislature.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'literature.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'more.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'random.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'document.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'names.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'blah.pdf',
            page: 1,
          },
          {
            keyword: 'india',
            filename: 'bleh.pdf',
            page: 1,
          },
        ],
      }
    },
  }
</script>