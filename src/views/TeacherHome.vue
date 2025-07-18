<template>
  <div class="main-content">
    <div class="teacher-home-container">
      <!-- 顶部欢迎区 -->
      <div class="header-area">
        <div class="header-title">
          <div class="logo">🎓</div>
          <div>
            <h1>欢迎回来，{{ userInfo.name || '老师' }}！</h1>
            <p class="subtitle">今天也要为同学们带来精彩的大学课程！</p>
          </div>
        </div>
      </div>
      <!-- 统计卡片区 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="el-icon-user"></i></div>
          <div class="stat-content">
            <h3>总学生数</h3>
            <div class="stat-value">{{ stats.totalStudents }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="el-icon-notebook-2"></i></div>
          <div class="stat-content">
            <h3>运行课程</h3>
            <div class="stat-value">{{ stats.activeCourses }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="el-icon-document-checked"></i></div>
          <div class="stat-content">
            <h3>发布任务</h3>
            <div class="stat-value">{{ stats.completedTasks }}</div>
          </div>
        </div>
      </div>
      <!-- 我的课程模块 -->
      <div class="module-card">
        <div class="module-header">
          <span class="module-title">我的课程</span>
          <el-button type="primary" @click="$router.push('/teacher/courseManagement')">管理课程</el-button>
        </div>
        <div v-if="courses && courses.length" class="module-list">
          <div v-for="course in courses" :key="course.id" class="course-item">
            <div class="item-title">{{ course.name }}</div>
            <div class="item-meta">{{ course.studentCount }}名学生 | 平均分{{ course.averageScore }}</div>
            <!-- <el-progress :percentage="course.progress" :stroke-width="10" /> -->
            <div class="item-actions">
              <el-button size="small" @click="viewDetail(course)">详情</el-button>
              <el-button size="small" type="primary" @click="editCourse(course)">编辑</el-button>
            </div>
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
      <!-- 待处理任务模块 -->
      <!-- <div class="module-card">
        <div class="module-header">
          <span class="module-title">待处理任务</span>
          <el-button type="text" @click="$router.push('/teacher/homeworkManagement')">查看全部</el-button>
        </div>
        <div v-if="pendingTasks && pendingTasks.length" class="module-list">
          <div v-for="task in pendingTasks" :key="task.id" class="task-item">
            <div class="item-title">{{ task.title }}</div>
            <div class="item-meta">{{ task.description }}</div>
            <div class="item-meta">课程：{{ task.course }} | 截止：{{ task.deadline }}</div>
            <el-tag :type="task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'info')">
              {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}优先级
            </el-tag>
            <div class="item-actions">
              <el-button size="small" type="primary" @click="handleTask(task)">处理</el-button>
            </div>
          </div>
        </div>
        <div v-else class="empty-module">暂无待处理任务</div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCourseByTeacherID, getCourseCountByTeacherId,getTaskCountByTeacherId } from '@/api/course';
import { ElMessage } from 'element-plus';
const router = useRouter();
const props = defineProps(['userInfo', 'stats', 'courses', 'pendingTasks']);
const courses = ref([]);
const stats = ref({
  activeCourses: 0,
  totalStudents: 0,
  completedTasks: 0
});

async function fetchCourses() {
  try {
    const res = await getCourseByTeacherID();
    //res.data.list 存在，那么res.data?.list 返回 res.data.list（一个数组），最后由于数组是真值，直接赋值给 courses.value
    courses.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取课程列表失败');
  }
  try {
    // 更新stats.totalStudents
    // 用for...in：遍历对象的属性名（如配置对象、JSON 数据）
    // 用for...of：遍历可迭代对象的值（如数组、字符串、Set、Map
    for(let course of courses.value){
      //在 JavaScript 中：必须使用.value访问 ref 的值
      //在 Vue 模板中：可以直接访问，无需.value
      stats.value.totalStudents += course.studentCount;
    }
  } catch (e) {
    console.error('更新总学生数失败:', e);
    ElMessage.error('更新总学生数失败');
  }
  try {
    // 更新stats.activeCourses
    stats.value.activeCourses = courses.value.length;
  } catch (e) {
    console.error('更新运行课程数失败:', e);
    ElMessage.error('更新运行课程数失败');
  }
}

async function fetchTaskCount() {
    try{
      const res = await getTaskCountByTeacherId();
      stats.value.completedTasks = res.data || 0;
    }catch(e){
      console.error('获取任务数失败:', e);
      ElMessage.error('获取任务数失败');
    }
}


onMounted(async () => {
  await fetchCourses();
  await fetchTaskCount();
});

function viewDetail(course) {
  router.push(`/teacher/courseManagement?id=${course.id}`);
}
function editCourse(course) {
  router.push(`/teacher/courseManagement?id=${course.id}&edit=1`);
}
function handleTask(task) {
  router.push('/teacher/homeworkManagement');
}
</script>

<style scoped>
.teacher-home-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px 24px 24px;
}
.header-area {
  display: flex;
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
}
.subtitle {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.stats-grid {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  justify-content: center;
}
.stat-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  min-width: 180px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat-icon {
  font-size: 2rem;
  color: #409EFF;
}
.stat-content h3 {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}
.stat-change {
  font-size: 12px;
}
.stat-change.positive {
  color: #67c23a;
}
.module-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 20px 20px 10px 20px;
  margin-bottom: 24px;
}
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.module-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
.module-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.course-item, .task-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9fb;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.item-meta {
  color: #909399;
  font-size: 14px;
}
.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.empty-module {
  color: #bbb;
  text-align: center;
  padding: 24px 0;
}
@media (max-width: 768px) {
  .teacher-home-container {
    padding: 10px 2vw;
  }
  .stats-grid {
    flex-direction: column;
    gap: 10px;
  }
  .module-card {
    padding: 10px 6px;
  }
}
</style> 