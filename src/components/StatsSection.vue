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

    <template v-if="hasConstituencyStats">
      <div class="section-divider">
        <hr class="divider-line" />
        <h2>Constituency Stats</h2>
        <hr class="divider-line" />
      </div>

      <div class="constituency-card-row" v-for="(row, index) in constituencyRows" :key="index">
        <v-card v-for="(stat, name) in row" :key="name" :title="name">
          <v-card-subtitle>{{ stat.district }}, {{ stat.state }}</v-card-subtitle>
          <v-card-text>
            <div class="constituency-stat">
              <div class="constituency-stat-row">
                <div class="constituency-stat-item">
                  <span class="constituency-stat-label">Uploaded</span>
                  <CountUp :end-val="stat.uploaded">
                    <template #prefix v-if="stat.uploaded < 10">0</template>
                  </CountUp>
                </div>
                <div class="constituency-stat-item">
                  <span class="constituency-stat-label">Processed</span>
                  <CountUp :end-val="stat.processed">
                    <template #prefix v-if="stat.processed < 10">0</template>
                  </CountUp>
                </div>
              </div>
              <div class="constituency-progress-section">
                <v-progress-linear
                  :model-value="(stat.processed / stat.uploaded) * 100"
                  color="#4CAF50"
                  height="20"
                  class="constituency-progress-bar"
                  rounded
                >
                  <template v-slot:default="{ value }">
                    <strong class="constituency-progress-text">{{ value }}%</strong>
                  </template>
                </v-progress-linear>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
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
    uploaded: 0,
    constituencyStats: {}
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

    // Fetch constituency stats separately
    api
      .get(APIS.CONSTITUENCY_STATS)
      .then((resp) => resp.json())
      .then((data) => {
        this.constituencyStats = this.transformConstituencyStats(data || {})
      })
      .catch((err) => {
        console.error('Failed to fetch constituency stats', err)
        this.constituencyStats = this.transformConstituencyStats({
          '289-Temprory': {
            stats: {
              processed: 3,
              uploaded: 5
            },
            metadata: {
              district: 'TemproryDistrict',
              state: 'TemproryState'
            }
          }
        })
      })
  },
  methods: {
    pad(num) {
      if (num < 10) {
        return `0${num}`
      }
      return `${num}`
    },
    transformConstituencyStats(stats) {
      const transformed = {}
      for (const [constituency, data] of Object.entries(stats)) {
        transformed[constituency] = {
          uploaded: data.stats.uploaded || 0,
          processed: data.stats.processed || 0,
          district: data.metadata.district || '',
          state: data.metadata.state || ''
        }
      }
      return transformed
    }
  },
  computed: {
    constituencyRows() {
      const rows = []
      const itemsPerRow = 2
      const entries = Object.entries(this.constituencyStats)

      for (let i = 0; i < entries.length; i += itemsPerRow) {
        const row = Object.fromEntries(entries.slice(i, i + itemsPerRow))
        rows.push(row)
      }

      return rows
    },
    hasConstituencyStats() {
      return Object.keys(this.constituencyStats).length > 0
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
    .v-card {
      width: 240px;
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
    .constituency-stat {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .constituency-stat-row {
        display: flex;
        justify-content: space-around;
        width: 100%;

        .constituency-stat-item {
          text-align: center;

          .constituency-stat-label {
            font-size: 16px;
            color: var(--v-medium-emphasis);
            display: block;
            margin-bottom: 8px;
          }
        }
      }

      .constituency-progress-section {
        position: relative;
        margin-top: 8px;

        .constituency-progress-bar {
          margin-bottom: 4px;
        }

        .constituency-progress-text {
          font-size: 14px;
          color: var(--v-medium-emphasis);
          text-align: right;
          display: block;
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
