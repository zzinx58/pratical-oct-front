<template>
  <Header />
  <RouterView />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from './store/user';
export default defineComponent({
    name: "App",
    setup() {
        const userStore = useUserStore();
        return {
            userStore,
        };
    },
})
</script>
<style scoped>
* {
    padding:0;
    margin: 0;
}
html, body {
        height: 100%;
        width: 100%;
      }
</style>