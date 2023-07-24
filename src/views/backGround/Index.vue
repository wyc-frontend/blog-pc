<template>
  <div class="demo-collapse">
    <el-dialog v-model="dialogDelVisible" title="从墙上删除图片">
      <el-form :model="form">
        <el-form-item label="对应图片编号">
          <el-input v-model="form.picId" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDelVisible = false;form.picId = ''">取消</el-button>
          <el-button type="primary" @click="delImgFn">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUploadVisible" title="上传图片到墙">
      <el-upload ref="upload" name="img" :limit="1" :on-error="errUpload"
        :on-change="beforeUpload" :data="upData" :action="baseUrl + '/upload/photowall'" list-type="picture-card"
        :auto-upload="false" :on-success="okUpload">
        <el-icon>
          <Plus />
        </el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <el-icon><zoom-in /></el-icon>
              </span>
              <span></span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img width="500" w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取消</el-button>
          <el-button type="primary" :disabled="!upStatus" @click="upImgFn">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="msgDialogVisible" title="删除留言">
      <el-form>
        <el-form-item label="对应留言id">
          <el-input v-model="msgDialogV" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="msgDialogVisible = false;msgDialogV = ''">取消</el-button>
          <el-button type="primary" @click="delMsgFn">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="博客文章" name="1">
        <el-button type="primary" @click="router.push('/admin/bloghome')">文章管理</el-button>
      </el-collapse-item>
      <el-collapse-item title="留言板" name="2">
        <el-button type="primary" style="margin:5px 0px;" @click="msgDialogVisible = true">删除留言</el-button>
      </el-collapse-item>
      <el-collapse-item title="照片墙" name="3">
        <el-button type="primary" @click="dialogUploadVisible = true">上传图片</el-button>
        <el-button type="primary" style="margin:5px 0px;" @click="dialogDelVisible = true">删除图片</el-button>
      </el-collapse-item>
      <el-collapse-item title="退出" name="4">
        <el-button type="primary" @click="exitLogin">退出登录</el-button>
        <el-button type="primary" style="margin:5px 0px;" @click="router.push('/')">返回博客首页</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import baseUrl from '../../utils/apiRequest'
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { delPhoto,delmsgboard } from "@/api"
import { ElMessage } from 'element-plus'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { useMainStore } from "../../store/user";
import { storeToRefs } from "pinia"
const useStore = useMainStore()
const { loginInfo } = storeToRefs(useStore)

const upload = ref('upload')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const msgDialogVisible = ref(false)
const disabled = ref(false)
const upStatus = ref(false)

const upData = reactive({
  username: loginInfo.value.adminName
})



const router = useRouter()
const activeNames = ref(["1"]);
const handleChange = () => {
  // console.log(val);
};
let dialogUploadVisible = ref(false)
let dialogDelVisible = ref(false)

const msgDialogV = ref('')
const formLabelWidth = '140px'

const form = reactive({
  picId: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const delImgFn = async () => {
 
  let res = await delPhoto(form.picId)
  if (res.data.code === 0) {
    dialogDelVisible.value = false
    form.picId = ''
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  } else {
    ElMessage({
      message: res.data.message,
      type: 'error',
    })
  }
}

const delMsgFn = async () => {

  let res = await delmsgboard(msgDialogV.value)
  if (res.data.code===0) {
    msgDialogVisible.value = false
    msgDialogV.value = ''
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }else{
    ElMessage({
      message: res.data.message,
      type: 'error',
    })
  }
}

const upImgFn = async () => {
  upload.value.submit()

}

const handleRemove = (file) => {
  upload.value.clearFiles()
  upStatus.value = false
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const okUpload = (file) => {
  ElMessage({
    message: '图片上传成功',
    type: 'success',
  })
  dialogUploadVisible.value = false
  upload.value.clearFiles()
}

const errUpload = (file) => {
  console.log('失败', file);
}

const beforeUpload = (f) => {
 if (f.raw.type !== 'image/jpeg' && f.raw.type !== 'image/png' && f.raw.type !== 'image/svg+xml') {
     ElMessage.error('上传文件类型必须是jpg、png或者svg格式!')

     setTimeout(() => {
       handleRemove(f)
     }, 200)
     
     return false
   } else if (f.size / 1024 / 1024 > 2) {
  ('上传文件大小不允许超过2MB!')

     return false
   }
   upStatus.value = true
}

const exitLogin = () => {
  loginInfo.value.adminName = ''
  loginInfo.value.adminToken = ''
  ElMessage({
    type:'success',
    message:'退出账号成功,即将返回博客首页'
  })
  setTimeout(()=>{
    router.push('/')
  },2000)
}
</script>
<style lang="less" scoped>
.demo-collapse {
  width: 10%;
  min-width: 152px;
  height: 100%;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: var(--el-fill-color-blank);
  button{
    width: 116px;
  }
}
</style>