<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username" size="large">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" size="large">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" size="large">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" size="large">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" type="password" size="large">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          type="password"
          size="large"
        >
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请确认密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-button
          class="btn"
          type="primary"
          size="large"
          @click="submitForm(formRef)"
          >注册</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/api/frontend";
import { ElMessage } from "element-plus";

const router = useRouter();
const formRef = ref(null);
const formData = reactive({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0,
  userType: 1,
});
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
});

// 表单提交
const submitForm = (formEl) => {
  if (!formEl) return;
  console.log(formData);
  formEl.validate((valid) => {
    register(formData).then(({ code, message }) => {
      // console.log(res);
      if (!code) {
        ElMessage.success("注册成功");
        // formEl.resetFields();
        router.push("/auth/login");
      } else {
        ElMessage.error(message);
        return;
      }
    });
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
