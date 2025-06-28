<template>
  <div class="student-mgmt-container">
    <div class="header-area">
      <el-button type="primary" @click="goBack" style="margin-bottom: 16px;">返回</el-button>
      <h2>课程学生管理</h2>
    </div>
    <el-card class="table-card">
      <el-table :data="studentList" style="width: 100%; margin-top: 10px; border-radius: 10px;" :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}">
        <el-table-column prop="name" label="学生姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeStudent(scope.row)">移除</el-button>
            <el-button size="small" type="primary" @click="viewStudentDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!studentList.length" class="empty-state">
        <div class="empty-icon">👨‍🎓</div>
        <h3>暂无学生</h3>
        <p>该课程下还没有学生</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { getStudentsByCourseId } from '@/api/student'; // 你需要实现该API
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id || route.params.courseId;
const studentList = ref([]);

const fetchStudents = async () => {
  // const res = await getStudentsByCourseId(courseId);
  // studentList.value = res.data || [];
  // 临时mock数据
  studentList.value = [
    { name: '张三', studentId: '2023001' },
    { name: '李四', studentId: '2023002' }
  ];
};

onMounted(fetchStudents);

function goBack() {
  router.back();
}

function removeStudent(row) {
  ElMessage.success(`已移除学生：${row.name}`);
  studentList.value = studentList.value.filter(s => s.studentId !== row.studentId);
}

function viewStudentDetail(row) {
  ElMessage.info(`查看学生：${row.name}`);
  // router.push(`/student/profile/${row.studentId}`)
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
  align-items: center;
  gap: 16px;
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
</style>