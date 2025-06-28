<template>
    <div class="assignment-container">

      <!-- 主要内容 -->
      <div class="main-content">
        <div class="header">
          <h1>我的作业</h1>
          <p>管理你的作业任务，按时完成学习目标</p>
        </div>
  
        <!-- 作业列表 -->
        <div class="assignment-list">
          <div 
            v-for="assignment in assignments" 
            :key="assignment.title"
            class="assignment-card"
            @click="goToAssignment(assignment.id)"
            style="cursor:pointer"
          >
            <div class="assignment-header">
              <h2 class="course-name">{{ assignment.courseName }}</h2>
            </div>
            <div class="assignment-meta">
              <div class="meta-item">
                <span class="meta-icon">📝</span>
                <span>{{ assignment.title }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>{{ assignment.deadline ? assignment.deadline : '暂无截止时间' }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 空状态 -->
        <div v-if="assignments.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无作业</h3>
          <p>当前没有作业</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getMyAssignments,getHomeworkList } from '@/api/homework';
  
  export default {
    name: 'AssignmentList',
    data() {
      return {
        assignments: [],
        loading: false
      }
    },
    mounted() {
      this.loadAssignments()
    },
    methods: {
      async loadAssignments() {
        try {
          this.loading = true;
          const response = await getHomeworkList();
          this.assignments = response.data.assignments || response.data.list || response.data || [];
        } catch (error) {
          console.error('Failed to load assignments:', error);
          this.$message.error('加载作业失败');
        } finally {
          this.loading = false;
        }
      },
      goToAssignment(id) {
        this.$router.push(`/student/assignments/${id}/start`);
      },
    }
  }
  </script>
  
  <style scoped>
  .assignment-container {
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .navbar {
    background: white;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  
  .nav-brand .logo {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
  }
  
  .nav-menu {
    display: flex;
    gap: 32px;
  }
  
  .nav-item {
    text-decoration: none;
    color: #606266;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
  }
  
  .nav-item:hover,
  .nav-item.active {
    color: #409eff;
    border-bottom-color: #409eff;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background: #f5f7fa;
    border-radius: 20px;
    padding: 8px 16px;
  }
  
  .search-box input {
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    width: 200px;
  }
  
  .search-btn {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
  }
  
  .notification-btn {
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
  }
  
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
  }
  
  .header {
    margin-bottom: 32px;
  }
  
  .header h1 {
    font-size: 28px;
    color: #303133;
    margin: 0 0 8px 0;
  }
  
  .header p {
    color: #909399;
    font-size: 16px;
    margin: 0;
  }
  
  .assignment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    min-height: 180px;
  }
  
  .assignment-card {
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
  
  .assignment-card:hover {
    box-shadow: 0 4px 18px rgba(64,158,255,0.13);
    border: 2px solid #409EFF;
    transform: translateY(-2px) scale(1.025);
  }
  
  .assignment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .course-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
  }
  
  .teacher-name {
    font-size: 1rem;
    color: #409eff;
    margin-bottom: 10px;
  }
  
  .assignment-meta {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #909399;
    font-size: 14px;
  }
  
  .meta-icon {
    font-size: 16px;
  }
  
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }
  
  .empty-state h3 {
    color: #303133;
    margin: 0 0 8px 0;
  }
  
  .empty-state p {
    color: #909399;
    margin: 0;
  }
  
  @media (max-width: 900px) {
    .assignment-card {
      width: 100%;
      min-width: 0;
    }
  }
  </style>