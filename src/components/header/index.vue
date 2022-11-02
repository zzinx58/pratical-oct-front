<template>
  <div id="header-container">
    <ElPageHeader @back="goBack" class="ml-5 w-250px">
      <template #content>
        {{ route.name }}
      </template>
    </ElPageHeader>

    <ElMenu
      :default-active="activeIndex"
      class="m-el-menu w-300px"
      mode="horizontal"
      @select="handleSelect"
      router="true"
    >
      <ElMenuItem index="/gallery">Gallery</ElMenuItem>
      <ElMenuItem index="/draw">DrawPainting</ElMenuItem>
    </ElMenu>

    <div id="right-wrapper">
      <Avatar />
    </div>
  </div>
</template>

<script lang="ts">
import { ElPageHeader } from "element-plus";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "Header",
  setup() {
    const route = useRoute();
    const router = useRouter();
    watch(
      () => route,
      (newValue, oldValue) => {
        console.log("new", newValue);
        console.log("old", oldValue);
      }
    );
    const goBack = () => {
      router.back();
    };
    const activeIndex = ref("/gallery");
    const handleSelect = (key: string, keyPath: string[]) => {
        console.log(key, keyPath);
    }
    return { route, router, goBack, activeIndex, handleSelect };
  },
});
</script>

<style scoped lang="scss">
#right-wrapper {
  // @apply bg-blue-300;
}
#header-container {
  // @apply bg-yellow-400;
  @apply flex justify-between;
  background-color: #6366f1;
  height: $headerHeight;
  width: 100%;
}

.m-el-menu {
    @apply ml-20px;
    background-color: #6366f1;
    font-weight: 800;

}

.el-menu {
    border-bottom: 0;
}
</style>
