<template>
  <el-upload
    ref="upload"
    :action="baseUrl + '/upload'"
    list-type="picture-card"
    :on-remove="deleteImg"
    :auto-upload="false"
    :limit="1"
    :on-success="fileOk"
    :on-error="fileErr"
    :before-upload="beforeUpload"
    name="img"
    :data="headers"
    :on-change="enterUpload"
  >
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <!-- <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span> -->
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref,reactive,} from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import baseUrl from '../utils/apiRequest'
import type { UploadFile } from "element-plus";
const data = defineProps(['userName'])
const headers = reactive({ username: data.userName})
const dialogImageUrl = ref("");
const emit = defineEmits(['upStatus'])
const dialogVisible = ref(false);
const disabled = ref(false);



const enterUpload = (f) =>{
    
    
}
const deleteImg = () => {}
const handleRemove = (file: UploadFile) => {
  console.log(upload.value);
  
  upload.value.clearFiles()
  emit('upStatus',false)
};
const fileOk = (res) => {
    console.log(res);
    
  if (res.code===0) {
    // uInfo.imgUrl = `D:/OneDrive/桌面/Learn/vue3/server${res.data.url}`
    console.log(res);
    
  }
  
};
const fileErr = (r) => {
  console.log(r);
};


const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const beforeUpload = (file) => {
        
    }
</script>
  