<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="l-section">
      <RouterLink to="/" class="app-logo">
        <!--ADD LOGO HERE-->
        DOCUSENSE
      </RouterLink>
    </div>
    <div class="r-section">
      <div class="doc-upload hd-link-wrapper">
        <RouterLink to="/upload/" class="upload-link hd-link">
          <v-btn density="default" prepend-icon="mdi-file-upload">File Upload</v-btn>
        </RouterLink>
      </div>
      <div class="login hd-link-wrapper">
        <RouterLink to="/login/" class="login-link hd-link">
          <v-btn density="default" prepend-icon="mdi-account-key">Login</v-btn>
        </RouterLink>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
  line-height: 1.5;
  max-height: 100vh;
  width: 100%;
  padding: 16px;
  background: var(--color-background-mute);
  color: var(--color-heading);
}

header a.app-logo {
  color: var(--color-heading);
  text-decoration: none;
  text-shadow: 2px 2px 1px green;
  font-size: 20px;
}

header .r-section {
  flex-grow: 1;
  text-align: right;
}

header .hd-link-wrapper {
  display: inline-block;
  margin-left: 16px;
}

header a.hd-link {
  text-decoration: none;
}
</style>
