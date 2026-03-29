<template>
  <div>
    <!-- 告诉表单组件，所有表单字段的数据都存储在 formData 对象中 -->
    <el-form ref="ruleFormRef" :model="formData">
      <el-row :gutter="24">
        <template v-for="item in formItemAttr" :key="item.prop">
          <el-col v-bind="item.col">
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- 动态渲染组件 -->
              <!-- Vue 的双向数据绑定，用于将单个输入组件的值与 formData 对象中的特定属性关联 -->
              <component
                v-model="formData[item.prop]"
                :is="isComp(item.comp)"
                :placeholder="item.placeholder"
              >
                <template v-if="item.comp === 'select'">
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="opt in item.options"
                    :label="opt.label"
                    :value="opt.value"
                    :key="opt.value"
                  />
                </template>
              </component>
            </el-form-item>
          </el-col>
        </template>
        <el-row>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="info" @click="handleReset(ruleFormRef)"
            >重置</el-button
          >
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const props = defineProps({
  formItem: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["search"]);

const formItemAttr = computed(() => {
  const { formItem } = props;
  formItem.forEach((item) => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
  });
  return formItem;
});

// 表单数据
const ruleFormRef = ref(null);
const formData = reactive({});
const isComp = (comp) => {
  return {
    input: "elInput",
    select: "elSelect",
  }[comp];
};
const handleSearch = () => {
  //   console.log(formData);
  // 触发查询事件，将 formData 作为参数传递
  emit("search", formData);
};
const handleReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置后，需要再次触发查询事件
  emit("search", formData);
};
</script>
