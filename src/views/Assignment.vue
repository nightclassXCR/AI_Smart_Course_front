<template>
    <div class="assignment-container">

      <!-- 主要内容 -->
      <div class="main-content">
        <div class="header">
          <h1>我的作业</h1>
          <p>管理你的作业任务，按时完成学习目标</p>
        </div>
  
        <!-- 作业过滤标签 -->
        <div class="filter-tabs">
          <button 
            :class="['tab', { active: activeTab === 'pending' }]"
            @click="setActiveTab('pending')"
          >
            待完成作业
          </button>
          <button 
            :class="['tab', { active: activeTab === 'submitted' }]"
            @click="setActiveTab('submitted')"
          >
            已提交作业
          </button>
          <button 
            :class="['tab', { active: activeTab === 'graded' }]"
            @click="setActiveTab('graded')"
          >
            已批改作业
          </button>
        </div>
  
        <!-- 作业列表 -->
        <div class="assignment-list">
          <div 
            v-for="assignment in filteredAssignments" 
            :key="assignment.id"
            class="assignment-card"
          >
            <div class="assignment-header">
              <h3 class="assignment-title">{{ assignment.title }}</h3>
              <div class="assignment-status">
                <span 
                  v-if="assignment.status === 'pending'"
                  class="status-badge urgent"
                >
                  {{ assignment.priority }}
                </span>
                <span 
                  v-else-if="assignment.status === 'submitted'"
                  class="status-badge submitted"
                >
                  已提交
                </span>
                <span 
                  v-else-if="assignment.status === 'graded'"
                  class="status-badge graded"
                >
                  已批改
                </span>
              </div>
            </div>
  
            <div class="assignment-meta">
              <div class="meta-item">
                <span class="meta-icon">📖</span>
                <span>{{ assignment.course_name }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>{{ formatDate(assignment.deadline) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">⏰</span>
                <span>预计 {{ assignment.estimated_time }}分钟</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">⭐</span>
                <span>{{ assignment.max_score }} 分</span>
              </div>
            </div>
  
            <div class="assignment-description">
              {{ assignment.description }}
            </div>
  
            <!-- 已批改作业显示成绩 -->
            <div v-if="assignment.status === 'graded'" class="score-info">
              <div class="score-display">
                <span class="score">{{ assignment.final_score }}</span>
                <span class="total">/ {{ assignment.max_score }}</span>
              </div>
              <div v-if="assignment.comment" class="teacher-comment">
                <strong>老师评语：</strong>{{ assignment.comment }}
              </div>
            </div>
  
            <div class="assignment-actions">
              <button 
                v-if="assignment.status === 'pending'"
                class="btn btn-primary"
                @click="startAssignment(assignment.id)"
              >
                开始作业
              </button>
              <button 
                v-else-if="assignment.status === 'submitted'"
                class="btn btn-secondary"
                disabled
              >
                等待批改
              </button>
              <button 
                v-else-if="assignment.status === 'graded'"
                class="btn btn-outline"
                @click="viewAssignment(assignment.id)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
  
        <!-- 空状态 -->
        <div v-if="filteredAssignments.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无作业</h3>
          <p>当前没有{{ getEmptyMessage() }}作业</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getMyAssignments } from '@/api/homework';
  
  export default {
    name: 'AssignmentList',
    data() {
      return {
        activeTab: 'pending',
        assignments: [],
        loading: false
      }
    },
    computed: {
      filteredAssignments() {
        return this.assignments.filter(assignment => {
          if (this.activeTab === 'pending') {
            return assignment.status === 'pending'
          } else if (this.activeTab === 'submitted') {
            return assignment.status === 'submitted'
          } else if (this.activeTab === 'graded') {
            return assignment.status === 'graded'
          }
          return true
        })
      }
    },
    mounted() {
      this.loadAssignments()
    },
    methods: {
      async loadAssignments() {
        try {
          this.loading = true;
          const response = await getMyAssignments();
          this.assignments = response.data.assignments || response.data.list || response.data || [];
        } catch (error) {
          console.error('Failed to load assignments:', error);
          this.$message.error('加载作业失败');
        } finally {
          this.loading = false;
        }
      },
      setActiveTab(tab) {
        this.activeTab = tab
      },
      formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      getEmptyMessage() {
        switch (this.activeTab) {
          case 'pending': return '待完成的'
          case 'submitted': return '已提交的'
          case 'graded': return '已批改的'
          default: return ''
        }
      },
      startAssignment(assignmentId) {
        this.$router.push(`/student/assignments/${assignmentId}/start`)
      },
      viewAssignment(assignmentId) {
        this.$router.push(`/student/assignments/${assignmentId}/view`)
      }
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
  
  .filter-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }
  
  .tab {
    padding: 12px 24px;
    border: 1px solid #dcdfe6;
    background: white;
    color: #606266;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    font-size: 14px;
  }
  
  .tab:hover {
    background: #ecf5ff;
    color: #409eff;
  }
  
  .tab.active {
    background: #409eff;
    color: white;
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
  
  .assignment-title {
    font-size: 18px;
    color: #303133;
    margin: 0;
    flex: 1;
  }
  
  .assignment-status {
    display: flex;
    gap: 8px;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-badge.urgent {
    background: #fef0f0;
    color: #f56c6c;
  }
  
  .status-badge.submitted {
    background: #f0f9ff;
    color: #409eff;
  }
  
  .status-badge.graded {
    background: #f0f9f0;
    color: #67c23a;
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
  
  .assignment-description {
    color: #606266;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  .score-info {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  
  .score-display {
    font-size: 24px;
    font-weight: bold;
    color: #67c23a;
    margin-bottom: 8px;
  }
  
  .score-display .total {
    color: #909399;
    font-size: 16px;
  }
  
  .teacher-comment {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .assignment-actions {
    display: flex;
    gap: 12px;
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
  }
  
  .btn-primary {
    background: #303133;
    color: white;
  }
  
  .btn-primary:hover {
    background: #1d1f21;
  }
  
  .btn-secondary {
    background: #909399;
    color: white;
    cursor: not-allowed;
  }
  
  .btn-outline {
    background: white;
    color: #303133;
    border: 1px solid #dcdfe6;
  }
  
  .btn-outline:hover {
    background: #f5f7fa;
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