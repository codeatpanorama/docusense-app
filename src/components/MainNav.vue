<template>
  <div class="header">
    <div class="hd-nav-drawer">
      <div class="hdr-link" v-for="item of items">
        <v-tooltip :text="item.text">
          <template v-slot:activator="{ props }">
            <RouterLink v-bind="props" :to="item.link" class="hdr-link-a">
              <v-icon size="small" :icon="item.icon"></v-icon>
            </RouterLink>
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { MENU_ITEMS } from '../common/constants'
import { userStore } from '../store/user'
export default {
  props: {},
  data: () => ({
    items: []
  }),
  mounted() {
    const menuItems = (() => {
      const entitlements = userStore.getState().entitlements ?? [];
      if (entitlements.includes('ADMIN')) {
        return MENU_ITEMS
      }
      return MENU_ITEMS.filter(({ restricted }) => !restricted)
    })();
    this.items = menuItems
  },
  methods: {}
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.header {
  height: 100vh;
  padding-top: 56px;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--color-header-bg);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--color-border-subtle);

  @include for-phone-only {
    display: none;
  }

  .hd-nav-drawer {
    height: 100vh;
    width: 64px;
    background: var(--color-card-bg);
    border-right: 1px solid var(--color-card-border);
    padding: 12px;
    backdrop-filter: blur(20px);

    .hdr-link {
      a.hdr-link-a {
        display: inline-block;
        text-decoration: none;
        text-align: center;
        padding: 12px;
        height: 48px;
        width: 48px;
        border-radius: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
        border: 1px solid transparent;

        .v-icon {
          color: var(--color-header-icon);
          transition: all 0.3s ease;
        }

        &:hover {
          background: var(--color-header-icon-hover-bg);
          border-color: var(--color-border-gradient-start);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);

          .v-icon {
            color: var(--color-header-icon-hover);
            transform: scale(1.1);
          }
        }

        &.router-link-active {
          background: linear-gradient(135deg, var(--color-border-gradient-start), var(--color-border-gradient-stop));
          border-color: var(--color-border-gradient-start);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);

          .v-icon {
            color: white;
          }
        }
      }
    }
  }
}
</style>
