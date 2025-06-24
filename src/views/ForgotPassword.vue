<template>
  <div class="forgot-container">
    <div class="forgot-box">
      <div class="logo-section">
        <div class="logo">
          <span class="logo-icon">📚</span>
          <h1>找回密码</h1>
        </div>
        <p class="subtitle">请输入注册邮箱，我们将发送重置链接</p>
      </div>
      <form @submit.prevent="handleSubmit" class="forgot-form">
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="email" placeholder="请输入注册邮箱" required />
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '发送中...' : '发送重置链接' }}
        </button>
      </form>
      <div v-if="message" class="success-message">{{ message }}</div>
      <button class="back-btn" @click="goToLogin">返回登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      message: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.message = ''
      // 这里应调用后端API发送重置邮件，假设成功
      setTimeout(() => {
        this.loading = false
        this.message = '重置链接已发送到您的邮箱，请注意查收！'
      }, 1200)
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.forgot-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f8fb;
}
.forgot-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 40px 32px 32px 32px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo-section {
  text-align: center;
  margin-bottom: 24px;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon {
  font-size: 2.2rem;
  margin-right: 8px;
}
.subtitle {
  color: #6b7b8d;
  font-size: 1rem;
  margin-top: 4px;
}
.forgot-form {
  width: 100%;
  margin-bottom: 16px;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #3a4a5d;
}
.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dbe4ee;
  border-radius: 6px;
  font-size: 1rem;
}
.submit-btn {
  width: 100%;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.submit-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.success-message {
  color: #67c23a;
  margin-bottom: 10px;
  text-align: center;
}
.back-btn {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 8px;
}
</style> 