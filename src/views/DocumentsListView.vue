<script setup>
import DocList from '../components/DocList.vue'
import MainNav from '../components/MainNav.vue'
import UploadFile from '../components/UploadFile.vue'
import { userStore } from '../store/user'
</script>

<template>
  <div class="doc-status-container container">
    <MainNav />
    <div class="view-wrapper-start">
      <div class="ds-header-wrapper">
        <div class="ds-header">Documents</div>
        <div class="ds-header-action-buttons" v-if="isAdmin">
          <v-btn density="default" @click="onUploadClick">Upload</v-btn>
        </div>
      </div>
      <div class="ds-wrapper">
        <DocList />
      </div>
    </div>
    <v-dialog v-model="showUploadModal" width="auto">
      <UploadFile />
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    showUploadModal: false,
    isAdmin: false
  }),
  mounted() {
    const entitlements = userStore.getState().entitlements ?? []
    this.isAdmin = entitlements.includes('ADMIN')
  },
  methods: {
    onUploadClick() {
      this.showUploadModal = true
    }
  }
}
</script>
<style lang="scss">
.doc-status-container {
  .ds-header-wrapper {
    padding: 8px;
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: bold;
    color: var(--color-text-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .ds-header {
      color: var(--color-text-primary);
      text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
    }
    
    .ds-header-action-buttons {
      .v-btn {
        background: var(--color-button-bg);
        color: var(--color-button-text);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }
      }
    }
  }
}
</style>
