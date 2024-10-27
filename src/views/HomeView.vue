<script setup>
import SearchBar from '../components/SearchBar.vue';
import StatsSection from '../components/StatsSection.vue';
import MainNav from '../components/MainNav.vue';
</script>

<template>
  <main class="main-container container">
    <MainNav />
    <div class="view-wrapper-start">
      <div class="search-wrapper">
        <!-- <div class="logo-wrapper">
          <div class="app-logo">DOCUVED</div>
        </div> -->
        <SearchBar :navigate="true" />
      </div>
      <div class="stats-section-wrapper">
        <StatsSection />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@use '../assets/media.scss';

.search-wrapper {
    padding: 0 20px;
    @include media.for-phone-only {
      padding: 0;
    }
    .logo-wrapper {
      padding: 16px;
    }
}

.stats-section-wrapper {
  width: 100%;
}

.app-logo {
  color: var(--color-heading);
  text-shadow: 2px 2px black;
  font-family: Samarkan;
  text-decoration: none;
  font-size: 84px;
}
</style>