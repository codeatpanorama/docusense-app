<template>
    <div class="stats-wrapper">
        <div class="sw-card-holder">
            <div class="sw-card-row">
                <v-card :text="pad(downloaded)" title="DOWNLOADED"></v-card>
                <v-card :text="pad(previewed)" title="PREVIEWED"></v-card>
            </div>
            <div class="sw-card-row">
                <v-card :text="pad(searched)" title="SEARCHED"></v-card>
                <v-card :text="pad(uploaded)" title="UPLOADED"></v-card>
            </div>
        </div>
    </div>
</template>
<script>
import { APIS } from '../common/constants';
import { api } from '../common/apis';

export default {
    data: () => ({
        downloaded: 1,
        searched: 1,
        previewed: 1,
        uploaded: 1
    }),
    mounted() {
        api.get(APIS.STATS)
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                this.downloaded = data.stats.DOWNLOADED;
                this.searched = data.stats.SEARCHED;
                this.previewed = data.stats.PREVIEW;
                this.uploaded = data.stats.UPLOADED;
            })
    },
    methods: {
        pad(num) {
            if (num < 10) {
                return '0' + num;
            }
            return num;
        },
        onLoad() {
            
        },
    },
}
</script>
<style>
.stats-wrapper {
    
}

.stats-section-wrapper {
    width: 100%;
}

.sw-card-holder {
    display: flex;
    width: 100%;
    place-content: center;
    place-items: flex-start;
    flex-direction: column;
}

.sw-card-row {
    display: flex;
}

.sw-card-row .v-card {
    width: 360px;
    height: 240px;
    padding: 8px;
    margin: 20px;
    border-radius: 8px;
    border-left: 8px solid var(--color-border-gradient-start);
}

.sw-card-row .v-card .v-card-title {
    font-size: 24px;
}

.sw-card-row .v-card .v-card-text {
    font-size: 80px;
    line-height: normal;
}
</style>