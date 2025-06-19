<template>
  <div class="homework-mgmt-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo"><i class="el-icon-tickets"></i></div>
        <div>
          <h1>作业管理</h1>
          <p class="subtitle">管理所有课程作业，支持新增、编辑、删除</p>
        </div>
      </div>
      <el-button type="primary" @click="showAdd = true">新增作业</el-button>
    </div>
    <el-card class="table-card">
      <el-table :data="homeworkList" style="width: 100%; margin-top: 10px; border-radius: 10px;" :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}">
        <el-table-column prop="title" label="作业标题" />
        <el-table-column prop="course" label="所属课程" />
        <el-table-column prop="deadline" label="截止日期" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editHomework(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteHomework(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!homeworkList.length" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无作业</h3>
        <p>点击右上角"新增作业"按钮添加作业</p>
      </div>
    </el-card>
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="showAdd" :title="editId ? '编辑作业' : '新增作业'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="作业标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-input v-model="form.course" />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-input v-model="form.deadline" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveHomework">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 假设有对应API
const homeworkList = ref([]);
const showAdd = ref(false);
const form = ref({ title: '', course: '', deadline: '' });
const editId = ref(null);

const fetchHomework = async () => {
  // homeworkList.value = await getHomeworkList();
};

onMounted(fetchHomework);

function editHomework(row) {
  form.value = { ...row };
  editId.value = row.id;
  showAdd.value = true;
}

function saveHomework() {
  // 保存逻辑
  showAdd.value = false;
  editId.value = null;
}

function deleteHomework(id) {
  // 删除逻辑
}
</script>

<style scoped>
.homework-mgmt-container {
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
  font-size: 2rem;
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
  font-size: 2.5rem;
  margin-bottom: 8px;
}
@media (max-width: 600px) {
  .homework-mgmt-container {
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
