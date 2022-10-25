<template>
  <div class="avatar-container">
    <div class="avatar">
      <ElAvatar :src="userStore.userAvatarSrc" shape="circle" :size="44" />
    </div>
    <ElDropdown @command="handleCommand">
      <div class="info-block-container">
        <div class="user-name">
          {{ userStore.userName }}
        </div>
        <div>
          <IEpCaretTop class="caret-top" />
        </div>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem command="a">
            <IEpUserFilled />个人空间</ElDropdownItem
          >
          <ElDropdownItem command="b"> <IEpSetting />系统设置</ElDropdownItem>
          <ElDropdownItem command="c">
            <IEpSwitchButton />
            退出登录</ElDropdownItem
          >
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style scoped lang="scss">
.avatar-container {
  @apply flex items-center;
  line-height: 14px;
  height: $headerHeight;

  .avatar {
    @apply;
  }

  .info-block-container {
    @apply text-center mr-14px relative;
    @apply ml-1.5 mr-4 text-stroke-1px flex justify-center items-center pr-2;

    height: 32px;
    width: 150px;
    border: 1px solid hsla(0, 0%, 100%, 0.4);
    border-radius: 20px;
    color: #e8e9fd;

    .user-name {
      white-space: nowrap;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .caret-top {
      @apply ml-1 absolute right-8px bottom-6px;
      border: 1px solid hsla(0, 0%, 100%, 0.4);
      border-radius: 20px;
      transform: rotate(0);
      transition: transform $transitionTime;
    }
  }
}

.info-block-container:hover {
  cursor: pointer;
  color: greenyellow;
  .caret-top {
    transform: rotate(180deg);
    transition: transform $transitionTime;
  }
}

:global(.el-dropdown__popper) {
  --el-dropdown-menuItem-hover-color: rgb(110, 196, 44);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/store/user";
import { ElDropdownMenu } from "element-plus";
export default defineComponent({
  name: "Avatar",
  setup() {
    const userStore = useUserStore();
    const handleCommand = (command: string | number | object) => {
      switch (command) {
        case "a":
          break;
        case "b":
          break;
        case "c":
          break;
      }
    };
    return {
      userStore,
      handleCommand,
    };
  },
  components: { ElDropdownMenu },
});
</script>
