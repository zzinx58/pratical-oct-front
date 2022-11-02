<template>
  <!-- ElCollapse -->
  <div class="gal-container">
    <ElCollapse v-model="activeAlbumName" @change="handleAlbumChange">
      <ElCollapseItem name="1">
        <template #title>
          <div class="collapse-item-title">defaultAlbum</div>
        </template>
        <ElRow>
          <ElCol v-for="(o, index) in albumContents" :key="o" :span="4">
            <!-- <div class="pic-item-container" v-for="(o, index) in albumContents" key="o"> -->
            <ElCard :body-style="{ padding: '4px' }">
              <img :src="o.paintingUrl" class="img" />
              <div class="pic-item">
                《
                <span>
                  {{ o.Key }}
                </span>
                》
              </div>
            </ElCard>
            <!-- </div> -->
          </ElCol>
        </ElRow>
      </ElCollapseItem>
      <ElCollapseItem name="2">
        <template #title>
          <div class="collapse-item-title">otherAlbum</div>
        </template>
        <ElRow>
          <!-- <ElCol v-for="(o, index) in albumContents" :key="o" :span="4"> -->
          <ElCol>
            <div class="w-200px mx-auto font-extrabold">
              NULL
            </div>
          </ElCol>
        </ElRow>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script lang="ts">
import { COS_Service } from "@/hooks/cos";
import { CosObject } from "cos-js-sdk-v5";
import path from "path-browserify";

const albumName = {
      userAccountName: "1095568627@qq.com",
      userAlbums: "userAlbums",
      albumsName: "defaultAlbum",
    };
export const testStr = path.join(...Object.values(albumName));
export default defineComponent({
  name: "Gallery",
  setup() {
    const activeAlbumName = ref(["1"]);
    const albumContents = ref<Array<{ paintingUrl: string } & CosObject>>([]);
    const handleAlbumChange = (val: string[]) => {
      console.log(val);
    };
    const COSService = new COS_Service();


    // console.log(testStr);
    const paintingList = async () => {
      const result = await COSService.getAlbumContent(testStr);
      // console.log(result);
      return result;
    };
    paintingList();
    //fulfilled
    const PLUrls = async () => {
      const objects = (await paintingList()).Contents.filter(
        (item) => item.Size !== String(0)
      ).map(async (item) => {
        const paintingUrl = (await COSService.getObjectUrl({
          Key: item.Key,
          Sign: true,
        })) as string;
        const fileNameIdx = item.Key.lastIndexOf("/");
        console.log(fileNameIdx);
        const suffixNameIdx = item.Key.lastIndexOf(".");
        const fileName = item.Key.substring(fileNameIdx + 1, suffixNameIdx);
        console.log(fileName);

        let temp = {
          ...item,
          paintingUrl: paintingUrl,
          Key: fileName,
        };
        albumContents.value?.push(temp);
        return { paintingUrl: paintingUrl };
      });
      const result = await Promise.all(objects);
      // console.log(result);
      // console.log(albumContents.value);
      return result;
    };
    PLUrls();
    return {
      activeAlbumName,
      handleAlbumChange,
      albumContents,
    };
  },
});
</script>

<style scoped lang="scss">
.pic-item-container {
  @apply flex;
  width: 200px;
  height: 180px;
}
.img {
  @apply mx-auto;
  width: 150px;
  height: 150px;
}
.pic-item {
  //   @apply bg-blue-300;
  @apply flex justify-center items-center;
  span {
    // @apply bg-yellow-700;
    @apply block text-center;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.gal-container {
  // @apply bg-yellow-800;
  width: 100vw;
  height: calc(100vh - $headerHeight);
}

.collapse-item-title {
  @apply ml-5;
  font-weight: 800;
  font-size: 1.4em;
}

// :global(.el-collapse-item__header) {
//   font-weight: 800;
//   font-size: 1em;
// }
</style>
