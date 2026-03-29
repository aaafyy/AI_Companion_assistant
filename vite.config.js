import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // 代理配置,解决跨域问题
  server: {
    proxy: {
      "/api": {
        // 目标服务器地址
        // 用于将请求转发到后端服务器
        target: "http://159.75.169.224:1235",
        changeOrigin: true,
      },
    },
  },
});
