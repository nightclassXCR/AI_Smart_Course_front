<template>
  <div class="teacher-dashboard">
    <!-- 头部导航（横向分布） -->
    <nav class="navbar">
      <div class="nav-brand">
        <div class="logo">🎓 智慧教学平台</div>
      </div>
      <div class="nav-menu">
        <router-link to="/teacher" class="nav-item">首页</router-link>
        <router-link to="/teacher/courseManagement" class="nav-item">课程管理</router-link>
        <router-link to="/teacher/studentManagement" class="nav-item">学生管理</router-link>
        <router-link to="/teacher/homeworkManagement" class="nav-item">作业管理</router-link>
        <router-link to="/teacher/resourceCenter" class="nav-item">资源中心</router-link>
        <router-link to="/teacher/learningAnalysis" class="nav-item">学习分析</router-link>
      </div>
      <div class="nav-right">
        <router-link to="/teacher/profile" class="nav-item">个人中心</router-link>
      </div>
    </nav>
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :userInfo="userInfo"
          :stats="stats"
          :courses="courses"
          :pendingTasks="pendingTasks"
        />
      </router-view>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TeacherDashboard',
  data() {
    return {
      userInfo: {
        name: '李教授',
        avatar: ''
      },
      stats: {
        totalStudents: 320,
        newStudents: 8,
        activeCourses: 3,
        newCourses: 1,
        averageProgress: 85,
        progressChange: 2,
        completedTasks: 120,
        taskIncrease: 4
      },
      courses: [
        {
          id: 1,
          name: '大学物理A',
          cover: '',
          students: 120,
          progress: 90,
          averageScore: 88,
          lastUpdate: '2024-04-10'
        },
        {
          id: 2,
          name: '线性代数',
          cover: '',
          students: 100,
          progress: 80,
          averageScore: 82,
          lastUpdate: '2024-04-08'
        },
        {
          id: 3,
          name: 'C语言程序设计',
          cover: '',
          students: 100,
          progress: 85,
          averageScore: 79,
          lastUpdate: '2024-04-06'
        }
      ],
      pendingTasks: [
        {
          id: 1,
          title: '批改线性代数作业',
          description: '需要批改第5章矩阵运算作业，共100份',
          deadline: '今天 23:59',
          course: '线性代数',
          priority: 'high'
        },
        {
          id: 2,
          title: '更新大学物理课件',
          description: '上传第8章"电磁感应"最新PPT资料',
          deadline: '明天 18:00',
          course: '大学物理A',
          priority: 'medium'
        }
      ]
    }
  },
  methods: {
    contactAdmin() {
      this.$message.info('请联系管理员：admin@school.com');
    },
    goLogin() {
      this.$router.push('/login');
    },
    tryFree() {
      window.open('https://your-free-trial-link.com', '_blank');
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 32px;
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
  gap: 32px;
}
.nav-item {
  color: #222;
  font-size: 16px;
  text-decoration: none;
  padding: 0 8px;
  transition: color 0.2s;
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
.contact-link {
  color: #666;
  font-size: 15px;
  cursor: pointer;
  margin-right: 8px;
}
.login-btn {
  border: 1px solid #222;
  background: #fff;
  color: #222;
}
.start-btn {
  background: #222;
  color: #fff;
  border: none;
}
.start-btn:hover {
  background: #409EFF;
  color: #fff;
}
.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 60vh;
  padding: 20px;
}
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 8px 8px;
  }
  .nav-menu {
    gap: 16px;
    margin: 8px 0;
  }
  .nav-right {
    margin-top: 8px;
  }
  .main-content {
    padding: 10px;
  }
}
</style>