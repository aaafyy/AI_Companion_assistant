import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";
// 路由配置
const backendRoutes = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        // 路由元信息
        // 用于在侧边栏中显示路由名称和图标
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/Knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consulation",
        component: () => import("@/views/Consulation.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotional",
        component: () => import("@/views/Emotional.vue"),
        meta: {
          title: "情绪日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        component: () => import("@/views/Register.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];
const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/c_Home.vue"),
      },
      {
        path: "consultation",
        component: () => import("@/views/c_Consultation.vue"),
      },
      {
        path: "emotion-diary",
        component: () => import("@/views/c_EmotionDiary.vue"),
      },
      {
        path: "knowledge",
        component: () => import("@/views/c_Knowledge.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
});

// 路由前置守卫;
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.userType == 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        // next("/back/dashboard");
      }
    } else if (userInfo.userType === 1) {
      // 用户端账号只能访问前台路由
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/");
      } else {
        next();
      }
    }
  } else {
    if (to.path.startsWith("/auth")) {
      next();
    } else {
      next("/auth/login");
    }
  }
});
export default router;
