import service from "@/utils/request";
import { focusNode } from "element-plus/es/utils/index.mjs";

export function login(data) {
  return service({
    url: "/user/login",
    method: "POST",
    data,
  });
}
export function categoryTree() {
  return service({
    url: "/knowledge/category/tree",
    method: "GET",
  });
}
export function articlePage(params) {
  return service({
    url: "/knowledge/article/page",
    method: "GET",
    params,
  });
}
export function uploadFile(file, businessInfo) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessType", "ARTICLE");
  formData.append("businessId", businessInfo.businessId);
  formData.append("businessField", "cover");
  return service({
    url: "/file/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
}

export function createArticle(data) {
  return service({
    url: "/knowledge/article",
    method: "POST",
    data,
  });
}
export function getArticleDetail(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: "GET",
  });
}
export function updateArticle(id, data) {
  return service({
    url: `/knowledge/article/${id}`,
    method: "PUT",
    data,
  });
}
export function changeAticleStatus(id, status) {
  return service({
    url: `/knowledge/article/${id}/status`,
    method: "PUT",
    data: { status },
  });
}
export function deleteArticle(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: "DELETE",
  });
}
export function getConsulationPage(params) {
  return service({
    url: "/psychological-chat/sessions",
    method: "GET",
    params,
  });
}
export function getSessionDetail(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: "GET",
  });
}
export function getEmotionalPage(params) {
  return service({
    url: "/emotion-diary/admin/page",
    method: "GET",
    params,
  });
}
export function deleteEmotion(id) {
  return service({
    url: `/emotion-diary/admin/${id}`,
    method: "DELETE",
  });
}

export function getAnalyticsOverview() {
  return service({
    url: "/data-analytics/overview",
    method: "GET",
  });
}
export function logout() {
  return service({
    url: "/user/logout",
    method: "POST",
  });
}
