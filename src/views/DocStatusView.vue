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

<style>
.doc-status-container {
    
}

.doc-status-container .ds-header-wrapper {
    padding: 8px;
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: bold;
    color: #000;
}

.doc-status-container .v-table {
    border-radius: 8px;
}

.doc-status-container .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th {
    background-color: var(--color-title-bg);
    color: var(--color-title-text);
}

.doc-status-container .v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th .v-data-table-header__content span {
    font-weight: bold;
}

.doc-status-container .v-table.v-table--fixed-header>.v-table__wrapper>table>tbody>tr.v-data-table__tr.v-data-table__tr--clickable:hover td {
    background-color: var(--color-row-bg-hover);
}
</style>