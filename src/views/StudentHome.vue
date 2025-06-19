<template>
  <div class="home-container">
    <!-- 顶部欢迎区 -->
    <div class="header-area">
      <div class="header-title">
        <div class="logo">👋</div>
        <div>
          <h1>欢迎回来，{{ userInfo.name || '同学' }}！</h1>
          <p class="subtitle">继续你的学习之旅，今天也要加油！</p>
        </div>
      </div>
    </div>
    <!-- 新增：全部课程卡片，紧跟欢迎区下方 -->
    <div class="all-courses-row">
      <div class="module-card all-courses-card">
        <div class="module-header">
          <span class="module-title">全部课程</span>
        </div>
        <div v-if="allCourses && allCourses.length" class="overview-list">
          <div v-for="course in allCourses" :key="course.id" class="overview-item" @click="$router.push(`/student/course/${course.id}`)">
            <div class="overview-title">{{ course.name }}</div>
            <div class="overview-meta">{{ course.teacher }} | {{ course.progress }}% 进度</div>
            <el-progress :percentage="course.progress" :stroke-width="8" />
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
    </div>
    <!-- 统计卡片区 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-time"></i></div>
        <div class="stat-content">
          <h3>学习时长</h3>
          <div class="stat-value">{{ stats.studyTime }}h</div>
          <div class="stat-change positive">+{{ stats.studyTimeChange }}h 较上周</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-tickets"></i></div>
        <div class="stat-content">
          <h3>完成课程</h3>
          <div class="stat-value">{{ stats.completedCourses }}</div>
          <div class="stat-change positive">+{{ stats.completedCoursesChange }} 较上周</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-trophy"></i></div>
        <div class="stat-content">
          <h3>平均分数</h3>
          <div class="stat-value">{{ stats.averageScore }}</div>
          <div class="stat-change positive">+{{ stats.averageScoreChange }} 较上周</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-aim"></i></div>
        <div class="stat-content">
          <h3>学习目标</h3>
          <div class="stat-value">{{ stats.studyGoal }}%</div>
          <div class="stat-change positive">+{{ stats.studyGoalChange }}% 较上周</div>
        </div>
      </div>
    </div>
    <!-- 课程/作业/动态模块 -->
    <div class="modules-row">
      <!-- 课程总览模块 -->
      <div class="module-card course-overview-card">
        <div class="module-header">
          <span class="module-title">课程总览</span>
          <el-button type="text" @click="$router.push('/student/myCourse')">全部课程</el-button>
        </div>
        <div v-if="courses && courses.length" class="overview-list">
          <div v-for="course in courses" :key="course.id" class="overview-item" @click="$router.push(`/student/course/${course.id}`)">
            <div class="overview-title">{{ course.name }}</div>
            <div class="overview-meta">{{ course.teacher }} | {{ course.progress }}% 进度</div>
            <el-progress :percentage="course.progress" :stroke-width="8" />
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
      <!-- 我的课程模块 -->
      <div class="module-card">
        <div class="module-header">
          <span class="module-title">我的课程</span>
          <el-button type="text" @click="$router.push('/student/myCourse')">查看全部</el-button>
        </div>
        <div v-if="courses && courses.length" class="module-list">
          <div v-for="course in courses.slice(0,2)" :key="course.id" class="module-item">
            <div class="item-title">{{ course.name }}</div>
            <div class="item-meta">{{ course.teacher }} | {{ course.progress }}% 进度</div>
            <el-progress :percentage="course.progress" :stroke-width="10" />
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
      <!-- 我的作业模块 -->
      <div class="module-card">
        <div class="module-header">
          <span class="module-title">我的作业</span>
          <el-button type="text" @click="$router.push('/student/assignment')">查看全部</el-button>
        </div>
        <div v-if="assignments && assignments.length" class="module-list">
          <div v-for="hw in assignments.slice(0,2)" :key="hw.id" class="module-item">
            <div class="item-title">{{ hw.title }}</div>
            <div class="item-meta">{{ hw.courseName }} | 截止：{{ hw.deadline }}</div>
          </div>
        </div>
        <div v-else class="empty-module">暂无作业</div>
      </div>
      <!-- 最近动态模块 -->
      <div class="module-card">
        <div class="module-header">
          <span class="module-title">最近活动</span>
        </div>
        <div v-if="recentActivities && recentActivities.length" class="module-list">
          <div v-for="act in recentActivities.slice(0,3)" :key="act.id" class="module-item">
            <div class="item-title">{{ act.title }}</div>
            <div class="item-meta">{{ act.description }} <span class="item-time">{{ act.time }}</span></div>
          </div>
        </div>
        <div v-else class="empty-module">暂无动态</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentHome',
  props: ['userInfo', 'stats', 'courses', 'assignments', 'recentActivities', 'allCourses']
}
</script>

<style scoped>
.home-container {
  max-width: 1100px;
  margin: 32px auto;
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
.modules-row {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.module-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.module-title {
  font-weight: bold;
  font-size: 16px;
}
.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.module-item {
  background: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  font-size: 15px;
}
.item-title {
  font-weight: 500;
  margin-bottom: 2px;
}
.item-meta {
  color: #888;
  font-size: 13px;
}
.item-time {
  color: #aaa;
  font-size: 12px;
  margin-left: 8px;
}
.empty-module {
  color: #aaa;
  text-align: center;
  margin: 18px 0 8px 0;
}
.course-overview-card {
  min-width: 320px;
  max-width: 420px;
  overflow-x: auto;
}
.overview-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.overview-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 12px 16px 10px 16px;
  min-width: 180px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.overview-item:hover {
  box-shadow: 0 4px 16px rgba(64,158,255,0.12);
}
.overview-title {
  font-weight: bold;
  font-size: 15px;
}
.overview-meta {
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.all-courses-card {
  min-width: 320px;
  max-width: 420px;
  overflow-x: auto;
}
.all-courses-row {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
}
.all-courses-card {
  min-width: 320px;
  max-width: 600px;
  margin: 0 auto;
  overflow-x: auto;
}
@media (max-width: 900px) {
  .home-container {
    max-width: 100vw;
    padding: 10px 2vw;
  }
  .stats-grid, .modules-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 