<template>
  <div class="student-dashboard">
    <!-- 响应式导航栏 -->
    <nav class="navbar">
      <div class="nav-brand">
        <div class="logo">📚 智能学习平台</div>
      </div>
      <div class="nav-menu" :class="{ 'is-mobile': isMobile, 'show-mobile': showMobileMenu }">
        <router-link to="/student" class="nav-item">首页</router-link>
        <router-link to="/student/myCourse" class="nav-item">我的课程</router-link>
        <router-link to="/student/assignment" class="nav-item">我的任务</router-link>
        <!-- <router-link to="/student/progress" class="nav-item">学习进度</router-link> -->
        <router-link to="/student/knowledgeMap" class="nav-item">知识图谱</router-link>
        <router-link to="/student/profile" class="nav-item">个人中心</router-link>
      </div>
      <div class="nav-right">
        <!-- <div class="search-box">
          <input type="text" placeholder="搜索课程、知识点..." />
          <button class="search-btn">🔍</button>
        </div> -->
        <!-- <div class="notification-btn">🔔</div> -->
        <div class="menu-btn" @click="toggleMobileMenu" v-if="isMobile">
          <i class="el-icon-menu"></i>
        </div>
      </div>
    </nav>
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          v-bind="{
            userInfo,
            stats,
            courses,
            assignments,
            recentActivities,
            allCourses: courses
          }"
        />
      </router-view>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StudentDashboard',
  data() {
    return {
      userInfo: {
        name: '',
        avatar: ''
      },
      stats: {
        studyTime: 0,
        studyTimeChange: 0,
        completedCourses: 0,
        completedCoursesChange: 0,
        averageScore: 0,
        averageScoreChange: 0,
        studyGoal: 0,
        studyGoalChange: 0
      },
      courses: [],
      assignments: [],
      recentActivities: [],
      isMobile: false,
      showMobileMenu: false
    }
  },
  async created() {
    await this.loadUserInfo()
    await this.loadDashboardData()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    async loadUserInfo() {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          this.userInfo = {
            name: user.name || user.username || user.realName || '同学',
            avatar: user.avatar || user.avatarUrl || ''
          }
        }
      } catch (error) {
        console.error('Failed to load user info:', error)
        this.userInfo = { name: '同学', avatar: '' }
      }
    },
    async loadDashboardData() {
      try {
        const [statsRes, coursesRes, assignmentsRes, activitiesRes] = await Promise.all([
          axios.get('/api/student/stats'),
          axios.get('/api/student/courses'),
          axios.get('/api/student/assignments/pending'),
          axios.get('/api/student/activities/recent')
        ])
        this.stats = statsRes.data.data
        this.courses = coursesRes.data.data
        this.assignments = assignmentsRes.data.data
        this.recentActivities = activitiesRes.data.data
      } catch (error) {
        this.$message.error('加载数据失败')
        console.error('Failed to load dashboard data:', error)
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 900
      if (!this.isMobile) this.showMobileMenu = false
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 32px;
  position: relative;
  width: 100vw;
  min-width: 1200px;
  left: 0;
  right: 0;
}
.nav-brand .logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  display: flex;
  align-items: center;
}
.nav-menu {
  display: flex;
  gap: 16px;
  white-space: nowrap;
  align-items: center;
  transition: all 0.3s;
}
.nav-item {
  color: #222;
  font-size: 16px;
  text-decoration: none;
  padding: 0 8px;
  transition: color 0.2s;
  white-space: nowrap;
}
.nav-item.router-link-exact-active,
.nav-item.active {
  color: #409EFF;
  font-weight: bold;
  border-bottom: 2px solid #409EFF;
}
.nav-item:hover {
  color: #337ecc;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.menu-btn {
  display: none;
  font-size: 24px;
  cursor: pointer;
  margin-left: 8px;
}
@media (max-width: 900px) {
  .nav-menu {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: #fff;
    flex-direction: column;
    gap: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    z-index: 100;
  }
  .nav-menu.is-mobile.show-mobile {
    display: flex;
  }
  .menu-btn {
    display: block;
  }
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
.notification-btn {
  font-size: 20px;
  cursor: pointer;
  color: #888;
}
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-section h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 8px;
}

.welcome-section p {
  color: #909399;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content h3 {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
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

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.courses-grid {
  display: grid;
  gap: 20px;
}

.course-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-header {
  position: relative;
  height: 120px;
}

.course-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.course-status.in-progress {
  background: #409EFF;
}

.course-status.completed {
  background: #67c23a;
}

.course-content {
  padding: 16px;
}

.course-content h3 {
  margin-bottom: 8px;
  color: #303133;
}

.course-teacher {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.course-info {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.course-info i {
  margin-right: 4px;
  margin-left: 12px;
}

.course-info i:first-child {
  margin-left: 0;
}

.course-next {
  color: #409EFF;
  font-size: 14px;
  margin-bottom: 12px;
}

.course-progress {
  margin-bottom: 12px;
}

.course-progress span {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  display: block;
}

.course-actions {
  display: flex;
  gap: 8px;
}

.special-task {
  margin-top: 12px;
  padding: 8px;
  background: #fdf6ec;
  border-radius: 4px;
  color: #e6a23c;
  font-size: 12px;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.assignment-item:hover {
  border-color: #409EFF;
  background: #f0f9ff;
}

.assignment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.assignment-header h3 {
  color: #303133;
  font-size: 16px;
}

.assignment-tags {
  display: flex;
  gap: 4px;
}

.assignment-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.assignment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #909399;
}

.assignment-meta i {
  margin-right: 4px;
}

.assignment-actions {
  display: flex;
  justify-content: flex-end;
}

.activity-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.activity-icon.complete {
  background: #67c23a;
}

.activity-icon.submit {
  background: #409EFF;
}

.activity-icon.study {
  background: #e6a23c;
}

.activity-icon.get-help {
  background: #f56c6c;
}

.activity-content h4 {
  color: #303133;
  margin-bottom: 4px;
}

.activity-content p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-time {
  color: #909399;
  font-size: 12px;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .search-input {
    width: 180px;
  }
}
</style>