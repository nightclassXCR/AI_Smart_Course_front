<template>
  <div class="assignment-answer-container">
    <div class="header">
      <h1>{{ assignment.title || '作业答题' }}</h1>
      <div class="meta">
        <span>课程：{{ assignment.courseName || '未知课程' }}</span>
        <span>教师：{{ assignment.teacherRealName || '未知教师' }}</span>
        <span>截止时间：{{ assignment.deadline || '暂无截止时间' }}</span>
      </div>
    </div>
    <div class="answer-area">
      <h2>答题区</h2>
      <textarea v-model="answer" placeholder="请在此输入你的答案..." rows="8"></textarea>
      <div class="actions">
        <button @click="submitAnswer">提交答案</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignmentAnswer',
  data() {
    return {
      assignment: {},
      answer: ''
    }
  },
  mounted() {
    // 这里可以根据路由参数获取作业详情
    // 示例：this.loadAssignment(this.$route.params.id)
  },
  methods: {
    submitAnswer() {
      // 提交答案逻辑，后续可对接API
      this.$message.success('答案已提交！');
    }
  }
}
</script>

<style scoped>
.assignment-answer-container {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
}
.header h1 {
  margin-bottom: 10px;
}
.meta {
  color: #888;
  font-size: 15px;
  margin-bottom: 18px;
  display: flex;
  gap: 24px;
}
.answer-area {
  margin-top: 24px;
}
textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 16px;
  resize: vertical;
}
.actions {
  text-align: right;
}
button {
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 28px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #3076c9;
}
</style> 