import axios from "axios";
import router from "@/router";
import { ElMessage } from "element-plus";
// 创建axios实例
const service = axios.create({
  baseURL: "/api", // 基础URL
  timeout: 5000, // 请求的超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    // 处理业务状态码
    if (data.code === "200") {
      // console.log(data.data);
      return data.data;
    } else {
      // 登录过期
      if (data.code === "-1") {
        if (!config.url?.includes("/login")) {
          ElMessage.error(data.msg || "登录过期，请重新登录");
          // 清除token
          localStorage.removeItem("token");
          // 清除用户信息
          localStorage.removeItem("userInfo");
          window.location.href = "/auth/login";
        } else {
          ElMessage.error(data.msg || "登录失败");
        }
      } else {
        // 其他错误情况，如用户名或密码错误
        ElMessage.error(data.msg || "请求失败");
      }
      return Promise.reject(data);
    }
  },
  (error) => {
    // 对响应错误做点什么
    ElMessage.error(error.message || "网络请求失败");
    return Promise.reject(error);
  },
);

export default service;
