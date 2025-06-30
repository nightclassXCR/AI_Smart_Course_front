<template>
  <div class="resource-center-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo"><i class="el-icon-folder-opened"></i></div>
        <div>
          <h1>资源中心</h1>
          <p class="subtitle">集中管理课程相关的所有教学资源，支持上传、下载、删除</p>
        </div>
      </div>
      <el-button type="primary" @click="showUpload = true">上传资源</el-button>
    </div>
    <el-card class="table-card">
      <el-table
        :data="resourceList"
        style="width: 100%; margin-top: 10px; border-radius: 10px;"
        :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}"
      >
        <el-table-column prop="name" label="资源名称" />
        <el-table-column prop="fileType" label="类型">
          <template #default="scope">
            {{ resourceTypeMap[scope.row.fileType] }}
          </template>
        </el-table-column>
        <el-table-column prop="ownerType" label="所属类型">
          <template #default="scope">
            {{ resourceOwnerTypeMap[scope.row.ownerType] }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="上传时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="downloadResource(scope.row)">下载</el-button>
            <el-button size="small" type="danger" @click="deleteResourceHandler(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!resourceList.length" class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>暂无资源</h3>
        <p>点击右上角"上传资源"按钮添加教学资料</p>
      </div>
    </el-card>
    <!-- 简单风格的上传弹窗 -->
    <el-dialog v-model="showUpload" title="上传资源" width="400px">
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="uploadForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="文件类型">
          <el-select v-model="uploadForm.fileType" placeholder="请选择类型">
            <el-option label="doc文档" value="doc" />
            <el-option label="pdf文档" value="pdf" />
            <el-option label="ppt文档" value="ppt" />
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源所属">
          <el-input v-model="uploadForm.ownerName" placeholder="请输入资源所属" />
        </el-form-item>
        <el-form-item label="所属类型">
          <el-select v-model="uploadForm.ownerType" placeholder="请选择类型">
            <el-option label="任务" value="task" />
            <el-option label="问题" value="question" />
            <el-option label="概念" value="concept" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleFileChange"
            :limit="1"
            ref="uploadRef"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传一个文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeUploadDialog">取消</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getResourceList, createResource, deleteResource as delResource } from '@/api/resource';
import { ElMessage, ElMessageBox } from 'element-plus';

const resourceList = ref([]);
const showUpload = ref(false);
const uploadForm = ref({ name: '', ownerType: '',ownerName: '', fileType: '', fileUrl: null });
const uploadRef = ref(null);
const loading = ref(false);

const resourceTypeMap = {
  video: '视频',
  document: '文档',
  image: '图片',
  ppt: 'ppt',
  doc: 'doc',
  pdf: 'pdf'
}

const resourceOwnerTypeMap = {
  task: '任务',
  question: '问题',
  concept: '概念'
}

const fetchResources = async () => {
  loading.value = true;
  try {
    const res = await getResourceList();
    console.log("测试" ,res)
    resourceList.value = res.data?.list || res.data || [];
 
  } catch (e) {
    ElMessage.error('获取资源列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchResources);

function handleFileChange(file) {
  uploadForm.value.fileUrl = file.raw;
}

function closeUploadDialog() {
  showUpload.value = false;
  uploadForm.value = { name: '', fileType: '', fileUrl: null };
  if (uploadRef.value && uploadRef.value.clearFiles) {
    uploadRef.value.clearFiles();
  }
}

async function submitUpload() {
  if (!uploadForm.value.name.trim()) {
    ElMessage.error('请输入资源名称');
    return;
  }
  if (!uploadForm.value.fileType) {
    ElMessage.error('请选择资源类型');
    return;
  }
  if (!uploadForm.value.fileUrl) {
    ElMessage.error('请选择要上传的文件');
    return;
  }
  if (!uploadForm.value.ownerType) {
    ElMessage.error('请选择资源所属类型');
    return;
  }
  

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', uploadForm.value.name);
    formData.append('type', uploadForm.value.fileType);
    formData.append('file', uploadForm.value.fileUrl);
    formData.append('ownerType', uploadForm.value.ownerType);
    formData.append('ownerName', uploadForm.value.ownerName);
    await createResource(formData);
    ElMessage.success('资源上传成功！');
    closeUploadDialog();
    fetchResources();
  } catch (e) {
    ElMessage.error('资源上传失败');
  } finally {
    loading.value = false;
  }
}

function downloadResource(row) {
  if (row.fileUrl) {
    const a = document.createElement('a');
    a.href = row.fileUrl;
    a.download = row.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    ElMessage.success(`开始下载: ${row.name}`);
  } else {
    ElMessage.info('该资源没有有效的下载链接。');
    console.warn('资源没有下载URL:', row);
  }
}

async function deleteResourceHandler(id) {
  try {
    await ElMessageBox.confirm('确定要删除此资源吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await delResource(id);
    ElMessage.success('资源删除成功！');
    fetchResources();
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败');
  }
}
</script>

<style scoped>
.resource-center-container {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px 24px 24px;
}
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  font-size: 1.6rem;
  color: #409EFF;
}
.subtitle {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.table-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 18px;
  padding-bottom: 8px;
}
.empty-state {
  color: #bbb;
  text-align: center;
  padding: 32px 0 16px 0;
}
.empty-icon {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

/* 弹窗主体样式，通常不需要改动 */
.el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px 20px;
  box-sizing: border-box;
}

/* 修复下拉图标过大问题：直接针对 el-icon 组件调整 */
/* 使用 :deep() 穿透 scoped 样式 */
:deep(.el-upload-dragger .el-icon) {
  font-size: 32px !important; /* 强制图标大小 */
  color: #409EFF; /* 可以自定义图标颜色 */
}

/* 调整上传拖拽区域样式，确保图标和文字垂直排列 */
.upload-demo .el-upload-dragger {
  max-width: 320px;
  max-height: 120px;
  min-height: 80px;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* 让图标和文字垂直排列 */
  align-items: center;
  justify-content: center;
  padding: 12px 0;
}

/* 确保上传文本的样式正常 */
.el-upload__text {
  margin-top: 8px; /* 给图标和文字之间留一些间距 */
}

.dialog-form {
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 4px 4px 4px;
}
@media (max-width: 600px) {
  .resource-center-container {
    max-width: 100vw;
    margin: 10px 0;
    padding: 10px 2vw;
  }
  .header-title h1 {
    font-size: 1.1rem;
  }
  .table-card {
    padding: 0 2px 8px 2px;
  }
}
</style>