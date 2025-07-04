<template>
  <div class="assignment-answer-container">
    <div class="header">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <h1>{{ assignment.title || '作业答题' }}</h1>
      <!-- <div class="meta">
        <span>课程：{{ assignment.courseName || '未知课程' }}</span>
        <span>教师：{{ assignment.teacherRealName || '未知教师' }}</span>
        <span>截止时间：{{ assignment.deadline || '暂无截止时间' }}</span>
      </div> -->
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="assignment.questions && assignment.questions.length" class="paper-area">
      <el-card
        v-for="(q, idx) in assignment.questions"
        :key="q.id"
        class="question-card"
      >
        <div class="question-title">
          {{ idx + 1 }}. {{ q.content }}
        </div>
        <el-radio-group v-model="answers[idx]" :disabled="submitted">
          <el-radio
            v-for="opt in q.options"
            :key="opt.optKey"
            :value="opt.optKey"
          >
            {{ opt.optKey }}. {{ opt.optValue }}
          </el-radio>
        </el-radio-group>
        <div v-if="submitted && judgeResults[idx]" class="judge-result">
          <span :style="{color: judgeResults[idx].isCorrect ? 'green' : 'red'}">
            {{ judgeResults[idx].isCorrect ? '✔ 正确' : '✘ 错误' }}
          </span>
          <span style="margin-left: 12px;">你的答案：{{ judgeResults[idx].userAnswer }}</span>
          <span style="margin-left: 12px;">正确答案：{{ judgeResults[idx].correctAnswer }}</span>
          <span style="margin-left: 12px;">得分：{{ judgeResults[idx].point }}</span>
        </div>
      </el-card>
      <div class="actions">
        <el-button
          type="primary"
          @click="submitAllAnswers"
          :loading="submitting"
          :disabled="submitted || answers.some(a => a === null || a === undefined)"
        >
          {{ submitted ? '已提交' : '提交全部答案' }}
        </el-button>
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
console.log('submitHomeworkAnswer', submitHomeworkAnswer);
import { ElMessage } from 'element-plus';

export default {
  name: 'AssignmentAnswer',
  data() {
    return {
      assignment: {},
      answers: [],
      loading: true,
      submitting: false,
      submitted: false,
      judgeResults: []
    }
  },
  mounted() {
    this.loadAssignment();
  },
  methods: {
    async loadAssignment() {
      try {
        this.loading = true;
        const assignmentId = Number(this.$route.params.id);
        const response = await getHomeworkDetail(assignmentId);
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          this.assignment = {
            id: assignmentId,
            questions: response.data
          };
          this.answers = response.data.map(() => null);
        } else {
          this.assignment = { id: Number(this.$route.params.id), questions: [] };
        }
      } catch (error) {
        this.assignment = { id: Number(this.$route.params.id), questions: [] };
      } finally {
        this.loading = false;
      }
    },
    async submitAllAnswers() {
      if (this.answers.some(a => !a)) {
        ElMessage.warning('请完成所有题目再提交');
        return;
      }
      try {
        this.submitting = true;
        const taskId = this.assignment.id;
        // 从 localStorage 获取 userId
        let userId = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userId = userObj.id;
          }
        } catch (e) {
          userId = null;
        }
        if (!userId) {
          ElMessage.error('未获取到用户信息，请重新登录');
          this.submitting = false;
          return;
        }
        // 组装提交数据
        const submitData = this.assignment.questions.map((q, idx) => ({
          taskId,
          userId,
          questionId: q.id,
          userAnswer: this.answers[idx]
        }));
        console.log('submitData to backend:', JSON.stringify(submitData, null, 2));
        await submitHomeworkAnswer(submitData).then(res => {
          this.submitted = true;
          this.judgeResults = res.data || [];
          ElMessage.success('答案提交成功！');
        });
      } catch (error) {
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

.paper-area {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  min-height: 400px;
}

.question-card {
  margin-bottom: 18px;
  box-shadow: 0 1px 6px rgba(64,158,255,0.08);
  border-radius: 8px;
  padding: 18px 16px;
}

.question-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
}

.actions {
  text-align: right;
  margin-top: 24px;
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

.judge-result {
  margin-top: 8px;
  font-size: 15px;
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