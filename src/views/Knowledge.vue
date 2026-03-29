<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})"> 新增 </el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="articleList" style="width: 100%; margin-top: 15px">
      <el-table-column label="文章标题" width="400" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.authorName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="阅读量" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.readCount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.createdAt }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
            @click="handlePublish(scope.row)"
            >发布</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            text
            type="warning"
            @click="handleOffline(scope.row)"
            >下线</el-button
          >
          <el-button text type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.size"
      @click="handleChange(pagination.currentPage)"
    />
    <ArticleDialog
      v-model:modelValue="dialogVisible"
      :categories="categories"
      @success="handleSuccess"
      :article="currentArticle"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  deleteArticle,
  changeAticleStatus,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "category",
    label: "分类",
    placeholder: "请选择分类",
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    options: [
      {
        label: "草稿",
        value: "0",
      },
      {
        label: "已发布",
        value: "1",
      },
      {
        label: "已下线",
        value: "2",
      },
    ],
  },
];
// 分类映射
const categoryMap = reactive([]);
// 分类列表
const categories = ref([]);

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
// 文章列表
const articleList = ref([]);
const handleSearch = async (formData) => {
  console.log(formData);
  const params = {
    ...formData,
    ...pagination,
  };
  const { records, total } = await articlePage(params);
  // console.log(res);
  articleList.value = records;
  pagination.total = total;
};
// 新增和编辑弹窗显示
const dialogVisible = ref(false);

onMounted(async () => {
  const result = await categoryTree();
  console.log(result);
  categories.value = result.map((item) => {
    categoryMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  console.log(categories.value);
  formItem[1].options = categories.value;
  // 获取列表
  handleSearch({});
});

const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};
const handleSuccess = () => {
  // 刷新列表数据
  handleSearch({});
};

const currentArticle = ref(null);
const handleEdit = (row) => {
  // console.log(row);
  // 新增文章
  if (!row.id) {
    dialogVisible.value = true;
    currentArticle.value = {};
    return;
  } else {
    // 编辑文章
    getArticleDetail(row.id).then((res) => {
      console.log(res);
      currentArticle.value = res;
      dialogVisible.value = true;
    });
  }
};
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, "确认", {
    confirmButtonText: "确认发布",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    changeAticleStatus(row.id, 1).then((res) => {
      ElMessage.success("文章发布成功");
      handleSearch();
    });
  });
};
const handleOffline = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, "确认", {
    confirmButtonText: "确认下线",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    changeAticleStatus(row.id, 2).then((res) => {
      ElMessage.success("文章下线成功");
      handleSearch();
    });
  });
};
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, "确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    deleteArticle(row.id).then((res) => {
      ElMessage.success("文章删除成功");
      handleSearch();
    });
  });
};
</script>
