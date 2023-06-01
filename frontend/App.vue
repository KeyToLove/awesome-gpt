<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <div class="nav">
          <button v-for="route in routes" @click="go(route.path)" :key="route.path"
            :class="{ active: checkIsActive(route.path) }">
            {{ route?.meta?.desc ?? route.name }}
          </button>
          <img :src="logo" alt="" class="logo">
        </div>
        <router-view></router-view>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
  <Footer v-show="isShowFooter"></Footer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { GlobalThemeOverrides } from "naive-ui";
import { RouterView, useRouter, useRoute } from "vue-router";
import { routes } from "./router";
import Footer from "./components/Footer.vue";
import logo from './assets/logo.jpeg'
const router = useRouter();
const route = useRoute();

const isShowFooter = computed(() => {
  return ["", "/"].includes(route.path);
});

const checkIsActive = (path: string) => {
  return route.path === path;
};

const go = (path: string) => {
  router.push(path);
};

const themeOverrides: GlobalThemeOverrides = {
  Collapse: {
    textColor: "#fff",
    arrowColor: "#fff",
    titleTextColor: "#fff",
  },
};
</script>

<style scoped lang="less">
.nav {
  display: flex;
  font-size: 16px;
  position: relative;

  .logo{
    position: absolute;
    right: 20px;
    display: block;
    width: 200px;
    border-radius: 4px;
  }

  button {
    margin-right: 6px;

    &.active {
      background: darkslategray;
    }
  }
}
</style>