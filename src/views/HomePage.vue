<template>
  <div class="main-content">
    <el-card class="page-card">
      <div class="home-header">
        <h1>欢迎来到AI智慧课程平台</h1>
        <p>让学习更智能，让成长更高效</p>
      </div>
      <div class="quick-links">
        <el-button type="primary" size="large" @click="$router.push('/login')">立即登录</el-button>
        <el-button size="large" @click="$router.push('/student')">学生端预览</el-button>
        <el-button size="large" @click="$router.push('/teacher')">教师端预览</el-button>
      </div>
      <el-divider />
      <div class="platform-intro">
        <h3>平台简介</h3>
        <ul>
          <li>课程管理、作业管理、学生管理一站式完成</li>
          <li>资源中心、知识图谱、学习分析助力高效成长</li>
          <li>支持教师与学生双端，界面美观统一</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      userInfo: {
        id: null,
        name: '',
        email: ''
      },
      stats: {
        studyTime: 0,
        studyTimeChange: 0,
        completedCourses: 0,
        courseChange: 0,
        averageScore: 0,
        scoreChange: 0,
        progress: 0,
        progressChange: 0
      },
      courses: [],
      pendingTasks: [],
      recentActivities: [],
      loading: false
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        // 并行加载所有数据
        const [userResponse, statsResponse, coursesResponse, tasksResponse, activitiesResponse] = 
          await Promise.all([
            this.loadUserInfo(),
            this.loadStats(),
            this.loadCourses(),
            this.loadPendingTasks(),
            this.loadRecentActivities()
          ])
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('数据加载失败，请刷新页面重试')
      } finally {
        this.loading = false
      }
    },

    async loadUserInfo() {
      const response = await axios.get('/api/user/profile')
      this.userInfo = response.data
    },

    async loadStats() {
      const response = await axios.get('/api/user/stats')
      this.stats = response.data
    },

    async loadCourses() {
      const response = await axios.get('/api/courses/my-courses', {
        params: { limit: 4 } // 首页只显示4门课程
      })
      this.courses = response.data.map(course => ({
        ...course,
        progress: Math.round(course.progress || 0)
      }))
    },

    async loadPendingTasks() {
      const response = await axios.get('/api/tasks/pending', {
        params: { limit: 3 } // 首页只显示3个待办作业
      })
      this.pendingTasks = response.data
    },

    async loadRecentActivities() {
      const response = await axios.get('/api/learning-logs/recent', {
        params: { limit: 5 }
      })
      this.recentActivities = response.data
    },

    goToCourse(courseId) {
      this.$router.push(`/courses/${courseId}`)
    },

    continueLearning(courseId) {
      this.$router.push(`/courses/${courseId}/learn`)
    },

    startTask(taskId) {
      this.$router.push(`/tasks/${taskId}`)
    },

    getStatusText(status) {
      const statusMap = {
        'draft': '草稿',
        'published': '进行中',
        'archived': '已归档'
      }
      return statusMap[status] || status
    },

    getTaskStatusText(status) {
      const statusMap = {
        'draft': '草稿',
        'published': '待完成',
        'completed': '已完成'
      }
      return statusMap[status] || status
    },

    isUrgent(deadline) {
      const now = new Date()
      const deadlineDate = new Date(deadline)
      const diff = deadlineDate - now
      return diff < 24 * 60 * 60 * 1000 // 24小时内
    },

    getActivityIcon(type) {
      const iconMap = {
        'view': 'icon-eye',
        'submit': 'icon-check',
        'download': 'icon-download',
        'complete': 'icon-trophy'
      }
      return iconMap[type] || 'icon-activity'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    },

    formatRelativeTime(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutes < 60) {
        return `${minutes}分钟前`
      } else if (hours < 24) {
        return `${hours}小时前`
      } else {
        return `${days}天前`
      }
    }
  }
}
</script>

<style scoped>
.page-card {
  max-width: 800px;
  margin: 40px auto;
  padding: 40px 30px;
  text-align: center;
}
.home-header h1 {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.home-header p {
  color: #666;
  margin-bottom: 30px;
}
.quick-links {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.platform-intro {
  text-align: left;
  margin-top: 30px;
}
.platform-intro h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}
.platform-intro ul {
  padding-left: 20px;
}
.platform-intro li {
  margin-bottom: 8px;
  color: #444;
}
</style>