<template>
  <div class="mycourse-container">
    <!-- 顶部标题区 -->
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📚</div>
        <div>
          <h1>我的课程</h1>
          <p class="subtitle">管理你的课程，查看进度与详情</p>
        </div>
      </div>
      <div class="search-box">
        <input v-model="search" type="text" placeholder="搜索课程..." @keyup.enter="handleSearch" />
        <button class="search-btn" @click="handleSearch">🔍</button>
      </div>
    </div>
    <!-- 标签切换 -->
    <div class="filter-tabs">
      <button :class="['tab', { active: activeTab === 'all' }]" @click="setActiveTab('all')">全部课程</button>
      <!-- <button :class="['tab', { active: activeTab === 'ongoing' }]" @click="setActiveTab('ongoing')">进行中</button>
      <button :class="['tab', { active: activeTab === 'finished' }]" @click="setActiveTab('finished')">已完成</button> -->
    </div>
    <!-- 课程卡片列表 -->
    <div class="course-list">
      <div v-for="course in filteredCourses" :key="course.id" class="course-card">
        <div class="course-header">
          <div class="course-title">{{ course.name }}</div>
          <div class="course-status" :class="course.progress >= 100 ? 'finished' : 'ongoing'">
            {{ course.progress >= 100 ? '已完成' : '进行中' }}
          </div>
        </div>
        <div class="course-meta">
          <span>授课教师：{{ course.teacher }}</span>
        </div>
        <div class="course-progress">
          <!-- <el-progress :percentage="course.progress" :stroke-width="16" /> -->
        </div>
        <div class="course-actions">
          <el-button size="small" @click="viewDetail(course)">详情</el-button>
          <el-button size="small" type="danger" @click="quitCourseHandler(course.id)">退选</el-button>
        </div>
      </div>
      <!-- 空状态 -->
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>暂无课程</h3>
        <p>当前没有{{ getEmptyMessage() }}课程</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyCourses, quitCourse, searchMyCourses } from '@/api/course';
import { ElMessage } from 'element-plus';

const courseList = ref([]);
const search = ref('');
const activeTab = ref('all');
const router = useRouter();

const fetchCourses = async () => {
  try {
    const res = await getMyCourses();
    courseList.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取课程列表失败');
  }
};

const handleSearch = async () => {
  if (!search.value.trim()) {
    fetchCourses(); // 关键词为空时恢复全部
    return;
  }
  try {
    const res = await searchMyCourses(search.value.trim());
    courseList.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('搜索失败');
  }
};

onMounted(fetchCourses);

const filteredCourses = computed(() => {
  let list = courseList.value;
  if (activeTab.value === 'ongoing') {
    list = list.filter(c => c.progress < 100);
  } else if (activeTab.value === 'finished') {
    list = list.filter(c => c.progress >= 100);
  }
  if (search.value.trim()) {
    list = list.filter(c => c.name.includes(search.value.trim()));
  }
  return list;
});

function setActiveTab(tab) {
  activeTab.value = tab;
}
function viewDetail(row) {
  router.push(`/student/course/${row.id}`);
}
async function quitCourseHandler(id) {
  try {
    await quitCourse(id);
    ElMessage.success('退课成功');
    fetchCourses();
  } catch (e) {
    ElMessage.error('退课失败');
  }
}
function getEmptyMessage() {
  if (activeTab.value === 'ongoing') return '进行中的';
  if (activeTab.value === 'finished') return '已完成的';
  return '';
}
</script>

<style scoped>
.mycourse-container {
  max-width: 900px;
  margin: 32px auto;
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
}
.subtitle {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.search-box {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 16px;
  padding: 2px 8px;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 4px 0 4px 4px;
}
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
}
.filter-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}
.tab {
  background: #f5f7fa;
  border: none;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: #409EFF;
  color: #fff;
}
.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  min-height: 180px;
}
.course-card {
  background: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 22px 24px 18px 24px;
  width: 270px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  border: 2px solid #e3eefe;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
}
.course-card:hover {
  box-shadow: 0 4px 18px rgba(64,158,255,0.13);
  border: 2px solid #409EFF;
  transform: translateY(-2px) scale(1.025);
}
.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.course-title {
  font-weight: 700;
  font-size: 20px;
  color: #222;
  letter-spacing: 0.5px;
}
.course-meta {
  color: #409EFF;
  font-size: 15px;
  margin-bottom: 6px;
}
.course-progress {
  margin-bottom: 4px;
}
.course-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.course-actions .el-button {
  border-radius: 18px;
  font-size: 14px;
  padding: 4px 18px;
  transition: background 0.2s, color 0.2s;
}
.course-actions .el-button:hover {
  background: #409EFF;
  color: #fff;
  border-color: #409EFF;
}
.course-status {
  font-size: 13px;
  padding: 2px 14px;
  border-radius: 14px;
  color: #fff;
  background: #67c23a;
  font-weight: 500;
  letter-spacing: 1px;
}
.course-status.ongoing {
  background: #409EFF;
}
.course-status.finished {
  background: #67c23a;
}
.empty-state {
  width: 100%;
  text-align: center;
  margin: 40px 0 20px 0;
  color: #888;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}
@media (max-width: 900px) {
  .mycourse-container {
    max-width: 100vw;
    padding: 10px 2vw;
  }
  .course-card {
    width: 100%;
    min-width: 0;
  }
}
.upload-demo .el-upload-dragger {
  max-height: 120px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
}
.upload-demo i {
  font-size: 32px !important;
}
</style>