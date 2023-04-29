<script setup>
import DocStatus from '../components/DocStatus.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
    <div class="doc-status-container container">
        <MainNav />
        <div class="view-wrapper-start">
            <div class="ds-header-wrapper">
                <div class="ds-header">Document Status</div>
            </div>
            <div class="ds-wrapper">
                <DocStatus />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.doc-status-container {
    .ds-header-wrapper {
        padding: 8px;
        margin-bottom: 8px;
        font-size: 24px;
        font-weight: bold;
        color: #000;
    }
}

</style>