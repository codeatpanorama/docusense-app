<template>
  <div class="bulk-upload-wrapper">
    <div class="bulk-up-header">
      <div class="bulk-up-header-text">Bulk Upload</div>
    </div>
    <div class="bulk-up-content">
      <v-alert type="warning" text="Bulk upload functionality has been disabled."></v-alert>
      <div class="disabled-content">
        <p>This feature is no longer available. Please use the single file upload option instead.</p>
        <v-btn 
          density="default" 
          color="primary" 
          @click="goToSingleUpload"
          prepend-icon="mdi-file-upload"
        >
          Go to Single Upload
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToSingleUpload() {
      this.$router.push('/upload')
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.bulk-upload-wrapper {
  border: 2px solid var(--color-border-subtle);
  border-radius: 8px;
  width: 600px;
  overflow-y: auto;
  position: relative;
  @include for-phone-only {
    width: 96%;
  }
  .bulk-up-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);
    position: sticky;
    top: 0;
    z-index: 1;
    .bulk-up-header-text {
      font-size: 16px;
      font-weight: bold;
    }
  }
      .bulk-up-content {
      padding: 12px;
      color: #000;
      background: #fff;
      .disabled-content {
        text-align: center;
        padding: 20px;
        p {
          margin-bottom: 16px;
          color: #666;
        }
      }
    }
}
</style>
