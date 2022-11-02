<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import {ref}from "vue"
//不要在这里重复导入ElMessage/MessageBox，会导致样式失效问题
import {UploadProps, UploadUserFile} from "element-plus"
//2
import type {UploadInstance} from "element-plus"
import {COS_Service} from "./hooks/cos";
const COSService = new COS_Service();
const fileList = ref<UploadUserFile[]>([])
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
}
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
}
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`The limit is 1, you selected ${files.length} files this time, add up to ${
    files.length + uploadFiles.length
  } totally`) 
}
const handleFileChanged: UploadProps["onChange"] = (file, fileList) => {
  console.log("file",file,"files",fileList);  
}
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name}?`
  ).then(
    () => true,
    () => false
  )
}
//2
const Bucket = "school-work-1308651335"
const Region = "ap-shanghai"
const uploadRef = ref<UploadInstance>()
const submitUpload = (file: any) => {
  COSService.uploadFile({
    Bucket: Bucket,
    Region: Region,
    Key: "front.jpg",
    Body: file.raw
  }).then((result: any) => console.log(result))
  console.log(file);
}
</script>

<template>
  <!-- //设置accept会报错 -->
  <ElUpload
    action=""
    :auto-upload="false"
    v-model:file-list="fileList"
    :limit="1"
    drag
    list-type="picture"
    :on-exceed="handleExceed"
    :on-change="handleFileChanged"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
  >
    <ElButton type="primary">Click to upload</ElButton>
    <template #tip>
      <div class="bg-yellow-500">
        jpg/png files
      </div>
    </template>
  </ElUpload>
  <ElUpload
    action=""
    :auto-upload="false"
    :limit="1"
    drag
    accept=".jpg"
    list-type="picture"
    ref="uploadRef"
    :on-change="submitUpload"
    >
    <template #trigger >
      <ElButton type="primary">select file</ElButton>
    </template>
    <ElButton type="success">
      <!-- :on-change="handleFileChanged" -->
      upload to server
    </ElButton>
    <template #tip>
      <div>jpg/png files</div>
    </template>
  </ElUpload>
</template>

<style scoped>
</style>
