import { defineStore } from "pinia";
import { ref } from "vue";

export const useAdminStore = defineStore("admin", () => {
  const isCollapse = ref(false);
  const toggleCollapsed = () => {
    isCollapse.value = !isCollapse.value;
  };
  return { isCollapse, toggleCollapsed };
});
