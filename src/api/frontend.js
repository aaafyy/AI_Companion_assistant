import service from "@/utils/request";

export function register(data) {
  return service({
    url: "/user/add",
    method: "POST",
    data,
  });
}
export function startSession(data) {
  return service({
    url: "/psychological-chat/session/start",
    method: "POST",
    data,
  });
}
export function getSessionList(params) {
  return service({
    url: "/psychological-chat/sessions",
    method: "GET",
    params,
  });
}
export function deleteSession(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: "DELETE",
  });
}
export function getSessionDetail(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: "GET",
  });
}
