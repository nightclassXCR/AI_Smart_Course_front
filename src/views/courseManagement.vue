<template>
  <div class="course-mgmt-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo"><i class="el-icon-notebook-2"></i></div>
        <div>
          <h1>课程管理</h1>
          <p class="subtitle">管理你负责的所有大学课程，支持新增、编辑、删除</p>
        </div>
      </div>
      <el-button type="primary" @click="showAdd = true">新增课程</el-button>
    </div>
    <el-card class="table-card">
      <el-table :data="courseList" style="width: 100%; margin-top: 10px; border-radius: 10px;" :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="teacher" label="授课教师" />
        <el-table-column prop="description" label="简介" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editCourse(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteCourse(scope.row.id)">删除</el-button>
            <el-button size="small" type="primary" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!courseList.length" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>暂无课程</h3>
        <p>点击右上角"新增课程"按钮添加你的第一门课程</p>
      </div>
    </el-card>
    <!-- 新增/编辑弹窗 -->
    
  </div>

  <el-dialog v-model="showAdd" :title="editId ? '编辑课程' : '新增课程'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="form.teacher" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCourseList, createCourse, updateCourse, deleteCourse as delCourse } from '@/api/course';
import { ElMessage } from 'element-plus';

const router = useRouter();

const courseList = ref([]);
const showAdd = ref(false);
const form = ref({ name: '', teacher: '', description: '' });
const editId = ref(null);
const loading = ref(false);

const fetchCourses = async () => {
  loading.value = true;
  try {
    const res = await getCourseList();
    courseList.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取课程列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCourses);

function editCourse(row) {
  form.value = { ...row };
  editId.value = row.id;
  showAdd.value = true;
}

async function saveCourse() {
  loading.value = true;
  try {
    if (editId.value) {
      await updateCourse({ id: editId.value, ...form.value });
      ElMessage.success('课程更新成功');
    } else {
      await createCourse(form.value);
      ElMessage.success('课程创建成功');
    }
    showAdd.value = false;
    editId.value = null;
    fetchCourses();
  } catch (e) {
    ElMessage.error(editId.value ? '课程更新失败' : '课程创建失败');
  } finally {
    loading.value = false;
  }
}

async function deleteCourse(id) {
  loading.value = true;
  try {
    await delCourse(id);
    ElMessage.success('课程删除成功');
    fetchCourses();
  } catch (e) {
    ElMessage.error('课程删除失败');
  } finally {
    loading.value = false;
  }
}

function viewDetail(row) {
  router.push(`/teacher/courseDetail/${row.id}`);
}
</script>

<style scoped>
.course-mgmt-container {
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
  .course-mgmt-container {
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
