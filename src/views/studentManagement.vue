<template>
  <div class="student-mgmt-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo"><i class="el-icon-user"></i></div>
        <div>
          <h1>学生管理</h1>
          <p class="subtitle">管理本课程下的所有学生，支持新增、编辑、删除</p>
        </div>
      </div>
      <el-button type="primary" @click="showAdd = true">新增学生</el-button>
    </div>
    <el-card class="table-card">
      <el-table :data="studentList" style="width: 100%; margin-top: 10px; border-radius: 10px;" :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="class" label="班级" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editStudent(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteStudent(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!studentList.length" class="empty-state">
        <div class="empty-icon">👨‍🎓</div>
        <h3>暂无学生</h3>
        <p>点击右上角"新增学生"按钮添加学生</p>
      </div>
    </el-card>
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="showAdd" :title="editId ? '编辑学生' : '新增学生'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentId" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="form.class" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveStudent">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStudentList, addStudent, updateStudent, deleteStudent as delStudent } from '@/api/student';

const studentList = ref([]);
const showAdd = ref(false);
const form = ref({ name: '', studentId: '', email: '', class: '' });
const editId = ref(null);

const fetchStudents = async () => {
  studentList.value = await getStudentList();
};

onMounted(fetchStudents);

function editStudent(row) {
  form.value = { ...row };
  editId.value = row.id;
  showAdd.value = true;
}

function saveStudent() {
  if (editId.value) {
    updateStudent(editId.value, form.value).then(() => {
      fetchStudents();
      showAdd.value = false;
      editId.value = null;
    });
  } else {
    addStudent(form.value).then(() => {
      fetchStudents();
      showAdd.value = false;
    });
  }
}

function deleteStudent(id) {
  delStudent(id).then(fetchStudents);
}
</script>

<style scoped>
.student-mgmt-container {
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
  .student-mgmt-container {
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