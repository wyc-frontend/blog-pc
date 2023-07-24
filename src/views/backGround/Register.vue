<template>
  <el-button @click="router.push('/')">返回博客首页</el-button>
  <div class="regV">
    <h1>后台管理系统</h1>
    <div class="iptD">
      <!-- <div><input placeholder="用户名" /></div>
      <div><input placeholder="密码" /></div> -->
      <!-- <el-input placeholder="用户名" v-model="userInfo.uname"></el-input>
      <el-input placeholder="密码" v-model="userInfo.pwd"></el-input>
      <div><el-button @click="loginF">登录</el-button></div> -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="58px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input
            v-model="ruleForm.uname"
            type="text"
            autocomplete="off"
            placeholder="长度至少3位的有效字符"
          />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            show-password
            placeholder="长度至少6位的有效字符"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >注册</el-button
          >
          <el-button @click="goLogin()">已有账户,去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
import { reqRegister } from "../../api";
const ruleFormRef = ref<FormInstance>();
let errInfo = reactive({});
const goLogin = () => {
  router.push("/admin/login");
};
const validateName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入用户名"));
  }

  if (value.length < 3) {
    callback(new Error("长度至少为3个字符"));
  }
  callback();
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (ruleForm.pass.length < 6) {
      callback(new Error("密码长度至少为6位"));
    }
    callback();
  }
};
const ruleForm = reactive({
  pass: "",
  uname: "",
});

const rules = reactive({
  pass: [{ validator: validatePass, trigger: "blur" }],
  uname: [{ validator: validateName, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let res = await reqRegister(ruleForm);
      if (res.data.status === 0) {
        router.push("/admin/index");
        open();
      } else {
        const errOpen = () => {
          ElMessage({
            message: res.data.message,
            type:'error'
          });
        };
        errOpen()
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const router = useRouter();

const open = () => {
  ElMessage({
    message: "欢迎进入博客后台管理",
    type: "success",
  });
};

function loginF() {
  router.push("/admin/index");
}
</script>
<style lang="less" scoped>
.regV {
  width: 500px;
  height: 300px;
  background-color: #f2f6fc;
  margin: 198px auto;
  border-radius: 8px;
  h1 {
    margin: 0;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  input {
    border-radius: 16px;
  }

  .iptD {
    width: 60%;
    margin: 60px auto;

    .el-input {
    }
    .el-button {
      margin: 0px 12px;
    }
  }
}
</style>