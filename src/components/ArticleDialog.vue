<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select
          v-model="formData.categoryId"
          placeholder="请选择分类"
          clearable
        >
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要(可选)"
          maxlength="1000"
          show-word-limit
          clearable
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请选择文章标签(可选)"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option
            v-for="item in commonTags"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avtar-upload"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
          >
            <div class="cover-placeholder">
              <p v-if="!imageUrl">点击上传封面</p>
              <img v-else :src="`${imageUrl}`" alt="封面图片" />
            </div>
          </el-upload>
          <div v-if="imageUrl" class="cover-remove">
            <el-button type="danger" size="small" @click="handleRemove"
              >移除封面</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式<br>可以使用加粗、斜体、列表、标签等格式来丰富文章内容"
          :maxlength="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="btnPreview = !btnPreview">{{
        btnPreview ? "隐藏预览" : "预览效果"
      }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <!-- 按钮加 Loading 状态常用于防止重复提交、提示用户操作正在进行中。 -->
      <el-button @click="handleSubmit" :loading="loading" type="primary">
        {{ isEdit ? "更新文章" : "创建文章" }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, reactive, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { uploadFile, createArticle, updateArticle } from "@/api/admin";
import { fileBaseUrl } from "@/config/index";
import RichTextEditor from "@/components/RichTextEditor.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
// !!把后面的值转换为布尔值
const isEdit = computed(() => !!props.article?.id);

// 监听编辑数据
watch(
  () => props.article,
  (newVal) => {
    if (newVal && newVal.id) {
      // 确保 article 存在且有 id
      Object.assign(formData, newVal);
      // 使用现有ID
      businessId.value = newVal.id;
      // 封面url
      if (newVal.coverImage) {
        imageUrl.value = `${fileBaseUrl}${newVal.coverImage}`;
      } else {
        imageUrl.value = "";
      }
    }
  },
);
const handleClose = () => {
  // 重置表单数据
  if (formRef.value) {
    formRef.value.resetFields();
  }

  // 手动重置所有字段
  Object.assign(formData, {
    title: "",
    content: "",
    coverImage: "",
    categoryId: "",
    summary: "",
    tags: "",
    id: "",
    tagArray: [], // 重置标签数组
  });

  // 重置其他状态
  imageUrl.value = "";
  businessId.value = null;
  btnPreview.value = false;

  // 调用update:modelValue事件，将dialogVisible设置为false
  emit("update:modelValue", false);
};

const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: "",
  summary: "",
  tags: "",
  id: "",
});

const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "文章标题最多200个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "文章内容最多5000个字符", trigger: "blur" },
  ],
});

const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];
// 上传封面
const imageUrl = ref("");
const beforeUpload = (file) => {
  // 针对上传的文件进行校验
  console.log(file);
  const isImage = file.type.startsWith("image/");
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过5MB");
    return false;
  }
  return true;
};

const businessId = ref(null);
const handleUploadRequest = async ({ file }) => {
  // UUID生成
  businessId.value = crypto.randomUUID();
  const res = await uploadFile(file, { businessId: businessId.value });
  console.log(res);
  formData.coverImage = res.filePath;
  // 拼接完整的图片路径
  imageUrl.value = `${fileBaseUrl}${res.filePath}`;
};

const handleRemove = () => {
  imageUrl.value = "";
  formData.coverImage = "";
};

const handleContentChange = (data) => {
  console.log(data, "富文本内容");
  formData.content = data.html;
};

const editorInstance = ref(null);
const handleEditorCreated = (editor) => {
  editorInstance.value = editor;
  if (formData.content && editorInstance.value) {
    nextTick(() => {
      editor.setHtml(formData.content);
    });
  }
};

const btnPreview = ref(false);

// 提交
const formRef = ref(null);
const loading = ref(false);
// 提交文章，防止重复提交表单
const handleSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
    }
    console.log(formData);
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(","),
    };
    delete submitData.tagArray;

    if (isEdit.value) {
      updateArticle(props.article.id, submitData).then((res) => {
        loading.value = false;
        ElMessage.success("文章更新成功");
        dialogVisible.value = false;
        emit("success");
      });
    } else {
      createArticle(submitData).then((res) => {
        loading.value = false;
        ElMessage.success("文章创建成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8b949e;
  background: #f6f8fa;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
