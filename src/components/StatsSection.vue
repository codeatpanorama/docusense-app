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
    // Fetch general stats
    api
      .get(APIS.STATS)
      .then((resp) => resp.json())
      .then((data) => {
        this.downloaded = data.stats.DOWNLOADED || 0
        this.searched = data.stats.SEARCHED || 0
        this.previewed = data.stats.PREVIEW || 0
        this.uploaded = data.stats.UPLOADED || 0
      })
  },
  methods: {
    pad(num) {
      if (num < 10) {
        return `0${num}`
      }
      return `${num}`
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

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

    @include for-phone-only {
      flex-direction: column;
      width: 100%;
    }

    .v-card {
      width: 240px;
      height: 160px;
      padding: 8px;
      margin: 20px;
      border-radius: 8px;
      border-left: 8px solid var(--color-border-gradient-start);

      @include for-phone-only {
        width: 100%;
        height: auto;
        margin: 0;
        margin-bottom: 12px;
      }

      .v-card-title {
        font-size: 18px;
      }

      .v-card-text {
        font-size: 60px;
        line-height: normal;
      }

      .v-card-subtitle {
        padding-top: 0;
        color: var(--v-medium-emphasis);
        font-size: 14px;
      }
    }
  }

  .constituency-card-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    width: 100%;

    .v-card {
      width: 100%;
      margin: 0;
      
      .v-card-text {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .constituency-stat {
          font-size: 24px;
          line-height: 1.2;
        }
      }
    }
  }
}

.section-divider {
  display: flex;
  align-items: center;
  margin: 40px 0;
  width: 100%;

  h2 {
    margin: 0 20px;
    white-space: nowrap;
    color: var(--v-medium-emphasis);
  }

  .divider-line {
    flex-grow: 1;
    height: 1px;
    background: var(--v-border-color);
    border: none;
  }

  @include for-phone-only {
    margin: 24px 0;

    h2 {
      font-size: 20px;
      margin: 0 12px;
    }
  }
}
</style>