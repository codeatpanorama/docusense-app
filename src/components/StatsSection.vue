<script setup>
import CountUp from 'vue-countup-v3'
</script>
<template>
  <div class="stats-wrapper">
    <div class="sw-card-holder">
      <div class="sw-card-row">
        <v-card title="SEARCHES">
          <v-card-text>
            <CountUp :end-val="searched">
              <template #prefix v-if="searched < 10">0</template>
            </CountUp>
          </v-card-text>
        </v-card>
        <v-card title="UPLOADS">
          <v-card-text>
            <CountUp :end-val="uploaded">
              <template #prefix v-if="uploaded < 10">0</template>
            </CountUp>
          </v-card-text>
        </v-card>
      </div>
      <div class="sw-card-row">
        <v-card title="DOWNLOADS">
          <v-card-text>
            <CountUp :end-val="downloaded">
              <template #prefix v-if="downloaded < 10">0</template>
            </CountUp>
          </v-card-text>
        </v-card>
        <v-card title="PREVIEWS">
          <v-card-text>
            <CountUp :end-val="previewed">
              <template #prefix v-if="previewed < 10">0</template>
            </CountUp>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import { APIS } from '../common/constants'
import { api } from '../common/apis'

export default {
  data: () => ({
    downloaded: 0,
    searched: 0,
    previewed: 0,
    uploaded: 0
  }),
  mounted() {
    api
      .get(APIS.STATS)
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        this.downloaded = data.stats.DOWNLOADED || 0
        this.searched = data.stats.SEARCHED || 0
        this.previewed = data.stats.PREVIEW || 0
        this.uploaded = data.stats.UPLOADED || 0
      })
  },
  methods: {
    pad(num) {
      console.log('HERE')
      if (num < 10) {
        return `0${num}`
      }
      return `${num}`
    }
  }
}
</script>
<style lang="scss">
@use '../assets/media.scss';

.stats-wrapper {
  .sw-card-holder {
    display: flex;
    width: 100%;
    place-content: center;
    place-items: flex-start;
    flex-direction: column;
  }

  .sw-card-row {
    display: flex;

    @include media.for-phone-only {
      flex-direction: column;
      width: 100%;
    }

    .v-card {
      width: 360px;
      height: 240px;
      padding: 8px;
      margin: 20px;
      border-radius: 8px;
      border-left: 8px solid var(--color-border-gradient-start);

      @include media.for-phone-only {
        width: 100%;
        height: auto;
        margin: 0;
        margin-bottom: 12px;
      }

      .v-card-title {
        font-size: 24px;
      }

      .v-card-text {
        font-size: 80px;
        line-height: normal;
      }
    }
  }
}
</style>
