<template>
  <Header />
  <RouterView />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "./store/user";
import {useDark, useToggle} from '@vueuse/core'
export default defineComponent({
  name: "App",
  setup() {
    const userStore = useUserStore();
    localStorage.setItem("vueuse-color-scheme", "dark");
    // const isDark = useDark();
    // const toggleDark = useToggle(isDark);
    return {
      userStore,
    };
  },
});
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
</style>
