<template>
  <div class="page-head">
    <p class="page-title">{{ title }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "页面标题",
  },
});
const title = ref(props.title);
</script>
<style lang="scss" scoped>
.page-head {
  height: 54px;
  display: flex;
  justify-content: space-between;
  .page-title {
    font-size: 24px;
    color: #2d3748;
  }
}
</style>
