<template>
    <div class="stats-wrapper">
        <div class="sw-card-holder">
            <div class="sw-card-row">
                <v-card :text="pad(searched)" title="SEARCHES"></v-card>
                <v-card :text="pad(uploaded)" title="UPLOADS"></v-card>
            </div>
            <div class="sw-card-row">
                <v-card :text="pad(downloaded)" title="DOWNLOADS"></v-card>
                <v-card :text="pad(previewed)" title="PREVIEWS"></v-card>
            </div>
        </div>
    </div>
</template>
<script>
import { APIS } from '../common/constants';
import { api } from '../common/apis';

export default {
    data: () => ({
        downloaded: 0,
        searched: 0,
        previewed: 0,
        uploaded: 0
    }),
    mounted() {
        api.get(APIS.STATS)
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                this.downloaded = data.stats.DOWNLOADED || 0;
                this.searched = data.stats.SEARCHED || 0;
                this.previewed = data.stats.PREVIEW || 0;
                this.uploaded = data.stats.UPLOADED || 0;
            })
    },
    methods: {
        pad(num) {
            if (num < 10) {
                return `0${num}`;
            }
            return `${num}`;
        },
    },
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
            width: 360px;
            height: 240px;
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