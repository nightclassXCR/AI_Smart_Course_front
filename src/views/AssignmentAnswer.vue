<template>
  <div class="assignment-answer-container">
    <div class="header">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <h1>{{ assignment.title || '作业答题' }}</h1>
      <div class="meta">
        <span>课程：{{ assignment.courseName || '未知课程' }}</span>
        <span>教师：{{ assignment.teacherRealName || '未知教师' }}</span>
        <span>截止时间：{{ assignment.deadline || '暂无截止时间' }}</span>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <el-loading :fullscreen="false">加载中...</el-loading>
    </div>
    
    <div v-else-if="assignment.id" class="answer-area">
      <div class="assignment-content">
        <h2>作业内容</h2>
        <div class="content-text">{{ assignment.content || '暂无作业内容' }}</div>
      </div>
      
      <div class="answer-section">
        <h2>答题区</h2>
        <textarea 
          v-model="answer" 
          placeholder="请在此输入你的答案..." 
          rows="8"
          :disabled="submitted"
        ></textarea>
        <div class="actions">
          <el-button 
            type="primary" 
            @click="submitAnswer"
            :loading="submitting"
            :disabled="submitted || !answer.trim()"
          >
            {{ submitted ? '已提交' : '提交答案' }}
          </el-button>
        </div>
      </div>
    </div>
    
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>作业不存在</h3>
      <p>该作业可能已被删除或不存在</p>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getHomeworkDetail, submitHomeworkAnswer } from '@/api/homework';
import { ElMessage } from 'element-plus';

export default {
  name: 'AssignmentAnswer',
  data() {
    return {
      assignment: {},
      answer: '',
      loading: true,
      submitting: false,
      submitted: false
    }
  },
  mounted() {
    this.loadAssignment();
  },
  methods: {
    async loadAssignment() {
      try {
        this.loading = true;
        const assignmentId = this.$route.params.id;
        console.log('加载作业详情，ID:', assignmentId);
        
        const response = await getHomeworkDetail(assignmentId);
        console.log('作业详情响应:', response);
        
        this.assignment = response.data || response || {};
        
        // 检查是否已经提交过答案
        if (this.assignment.submittedAnswer) {
          this.answer = this.assignment.submittedAnswer;
          this.submitted = true;
        }
      } catch (error) {
        console.error('获取作业详情失败:', error);
        ElMessage.error('获取作业详情失败');
        this.assignment = {};
      } finally {
        this.loading = false;
      }
    },
    
    async submitAnswer() {
      if (!this.answer.trim()) {
        ElMessage.warning('请输入答案');
        return;
      }
      
      try {
        this.submitting = true;
        const assignmentId = this.$route.params.id;
        
        await submitHomeworkAnswer(assignmentId, {
          answer: this.answer
        });
        
        ElMessage.success('答案提交成功！');
        this.submitted = true;
      } catch (error) {
        console.error('提交答案失败:', error);
        ElMessage.error('提交答案失败，请重试');
      } finally {
        this.submitting = false;
      }
    }
  }
}
</script>

<style scoped>
.assignment-answer-container {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 16px 0 12px 0;
  color: #303133;
  font-size: 24px;
}

.meta {
  color: #606266;
  font-size: 14px;
  margin-bottom: 18px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  padding: 40px;
}

.assignment-content {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid #409eff;
}

.assignment-content h2 {
  margin: 0 0 12px 0;
  color: #409eff;
  font-size: 18px;
}

.content-text {
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
}

.answer-section {
  margin-top: 24px;
}

.answer-section h2 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 18px;
}

textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  padding: 16px;
  font-size: 16px;
  margin-bottom: 16px;
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #409eff;
}

textarea:disabled {
  background-color: #f5f7fa;
  color: #909399;
  cursor: not-allowed;
}

.actions {
  text-align: right;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.error-state p {
  color: #606266;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .assignment-answer-container {
    margin: 20px;
    padding: 20px;
  }
  
  .meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 