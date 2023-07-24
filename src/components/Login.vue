<template>
  <div v-if="props.status === 'login'">
    <el-dialog v-model="outerVisible" title="登录" @close="closeDialog">
      <div class="dialog-footer">
        <div>
          <el-form ref="formLogin" :model="loginData" status-icon :rules="rulesL" label-width="58px"
            class="demo-ruleForm">
            <el-form-item label="用户名" prop="uname">
              <el-input v-model="loginData.userName" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input v-model="loginData.passWord" type="password" autocomplete="off" show-password />
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" @click="loginFunc(formLogin)"> 登录 </el-button>

      </div>
    </el-dialog>
  </div>
  <div v-else>
    <el-dialog v-model="outerVisible" title="注册">

      <div class="dialog-footer">


        <div>

          <el-form ref="formReg" :model="regData" status-icon :rules="rules" label-width="58px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="uname">
              <el-input v-model="regData.userName" @change="fn" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input v-model="regData.passWord" type="password" autocomplete="off" show-password />
            </el-form-item>
          </el-form>
          <p>
            上传一个属于自己的头像

            <el-upload ref="upload" :action="baseUrl + '/upload'" list-type="picture-card" :auto-upload="false"
              :limit="1" :on-success="fileOk" :on-error="fileErr" :before-upload="beforeUpload" name="img"
              :data="regData" :on-change="enterUpload">
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
                    <el-dialog v-model="dialogVisible">
                      <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                    <span v-if="!disabled">
                      <!-- <el-icon><Download /></el-icon> -->
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </p>
        </div>
        <el-button type="primary" :disabled="!regData.formatOk" @click="isOpen(formReg, 'register')"> 注册账号 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

</script>
<script lang="ts" setup>
import baseUrl from '../utils/apiRequest'
import { ref, watch, reactive } from "vue";
import { reqWebLogin, reqWebRegister, reqUserInfo } from "../api";
import { ElMessageBox, ElMessage, ElButton, ElDialog, ElIcon, ElInput, ElUpload, UploadFile } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { useMainStore } from "../store/user"
import { storeToRefs } from "pinia"
const useStore = useMainStore()
const { loginInfo } = storeToRefs(useStore)
const formLogin = ref<FormInstance>();
const formReg = ref<FormInstance>();

const upload = ref('upload')
const disabled = ref(false);
let dialogImageUrl = ref("");
const props = defineProps(["status", "visible"]);

//登录注册组件弹窗状态
let outerVisible = ref(false);
let innerVisible = ref(false);

//定义表单验证规则
const validateNameL = (rule: any, value: any, callback: any) => {
  if (!loginData.userName) {
    callback(new Error("请输入用户名"));
  } else {
    if (loginData.userName.length < 3 || loginData.userName.length > 6) {
      callback(new Error("用户名长度在3位到6位之间"));
    }
    callback();
  }
};

const validatePassL = (rule: any, value: any, callback: any) => {
  if (!loginData.passWord) {
    callback(new Error("请输入密码"));
  } else {
    if (loginData.passWord.length < 6 || loginData.passWord.length > 11) {
      callback(new Error("密码长度在6到11位之间"));
    }
    callback();
  }
};

const validateName = (rule: any, value: any, callback: any) => {
  if (!regData.userName) {
    return callback(new Error("请输入用户名"));
  }

  if (regData.userName.length < 3 || regData.userName.length > 6) {
    callback(new Error("用户名长度在3位到6位之间"));
  }
  callback();
};


const validatePass = (rule: any, value: any, callback: any) => {
  if (!regData.passWord) {
    callback(new Error("请输入密码"));
  } else {
    if (regData.passWord.length < 6 || regData.passWord.length > 11) {
      callback(new Error("密码长度在6到11位之间"));
    }
    callback();
  }
};

//定义表单验证对象
const rules = reactive({ //注册
  pass: [{ validator: validatePass, trigger: "blur" }],
  uname: [{ validator: validateName, trigger: "blur" }],
});
const rulesL = reactive({ //登录
  pass: [{ validator: validatePassL, trigger: "blur" }],
  uname: [{ validator: validateNameL, trigger: "blur" }],
});

const dialogVisible = ref(false);
//登录表单数据收集
let loginData = reactive({
  userName: "",
  passWord: "",
  status: false,
});
let regData = reactive({
  userName: "", //用户名
  passWord: "", //密码
  status: false, //头像上传状态
  formatOk: false //头像上传格式状态
});

//方法
const fn = () => {
  console.log(regData);

}
//定义注册按钮的弹窗组件
const isOpen = (formReg, param) => {
  if (!formReg) return;
  formReg.validate(async (valid) => {
    if (valid) {
      ElMessageBox.confirm("确定要使用这个头像吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确认按钮的回调
          if (regData.status) {
            //检查用户是否上传头像 


            let res = await regFunc();  //等待注册接口回调的结果    
            if (res) {  //注册成功
              await upload.value.submit()   //调接口上传图片
              //清空注册组件绑定内容
              regData.userName = ''
              regData.passWord = ''
              handleRemove()

              ElMessage({
                type: "success",
                message: "注册成功，请点击登录",
              });
              outerVisible.value = false

            }

          } else {
            ElMessage({
              type: "error",
              message: "用户头像未上传",
            });
          }
        })
        .catch((err) => {
          //点击取消按钮的回调
          // ElMessage({
          //   type: 'info',
          //   message: '用户取消注册',
          // })
          console.log(err);
        });
    } else {
      console.log("error submit!");

    }
  });

};

function closeDialog() {
  loginData.userName = ''
  loginData.passWord = ''
  outerVisible.value = false;
}

const loginFunc = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {

      let res = await reqWebLogin(loginData);
      if (res.data.status === 0) {  //登录成功
        let uName = { username: res.data.username }
        loginInfo.value.status = true
        loginInfo.value.token = res.data.token
        loginInfo.value.userId = res.data.userId
        // loginInfo.value.userId = res.data.userid
        console.log(res.data);
        const okOpen = () => {
          ElMessage({
            message: res.data.message,
            type: "success",
          });
        };
        okOpen();
        outerVisible.value = false;
        let rs = await reqUserInfo(uName)
        if (rs.data.code === 0) {
          loginInfo.value.userName = rs.data.data.username
          loginInfo.value.imgUrl = `${baseUrl}${rs.data.data.userpic}`
        } else {
          console.log('数据请求失败', rs)
        }

      } else {
        const errOpen = () => {
          ElMessage({
            message: res.data.message,
            type: "error",
          });
        };
        errOpen();
      }
      return false

    } else {
      console.log("error submit!");
      return false;
    }
  });

};
const regFunc = async () => {
  let res = await reqWebRegister(regData);
  if (res.data.status === 0) {
    console.log(res.data);
    return true
  } else {
    const errOpen = () => {
      ElMessage({
        message: res.data.message,
        type: "error",
      });
    };
    errOpen();
    return false
  }
}


const enterUpload = (f) => {

  if (f.uid) {  //监听到用户上传头像，改变状态值
    regData.status = true
    if (f.raw.type !== 'image/jpeg' && f.raw.type !== 'image/png' && f.raw.type !== 'image/svg+xml') {
      ElMessage.error('上传文件类型必须是jpg、png或者svg格式!')
      regData.formatOk = false
      setTimeout(() => {
        handleRemove(f)
      }, 200)
      return false
    } else if (f.size / 1024 / 1024 > 2) {
      ElMessage.error('上传文件大小不允许超过2MB!')
      regData.formatOk = false
      return false
    }
    regData.formatOk = true
    return true
  }

}

const handleRemove = (file: UploadFile) => {
  regData.status = false;
  upload.value.clearFiles()

};
const fileOk = (res) => {
  if (res.code === 0) {

    console.log(res);

  }

};
const fileErr = (r) => {
  console.log(r, '失败');
};


const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;


};

const beforeUpload = (file) => {

}

watch(props, (n, o) => {
  outerVisible.value = true;
});

// 将变量暴露出来
// defineExpose({
//   outerVisible,
//   innerVisible,
// });
</script>
<style lang="less" scoped>
.dialog-footer {
  .el-form {
    padding-left: 10vw;
  }

  @media (max-width:520px) {
    .el-form {
      padding-left: 0;
      .el-input{
        width: 100%;
      }
    }
  }

  .avatar-uploader {
    display: inline-block;
    width: 30%;

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .avatar {
      width: 38px;
      height: 38px;
      display: block;
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 24px;
      height: 24px;
      text-align: center;
    }
  }

  .el-input {
    width: 60%;
  }
}
</style>