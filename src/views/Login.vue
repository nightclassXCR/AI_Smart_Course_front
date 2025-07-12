<template>
    <div class="login-container">
      <div class="login-box">
        <div class="logo-section">
          <div class="logo">
            <span class="logo-icon">📚</span>
            <h1>智能学习平台</h1>
          </div>
          <p class="subtitle">让学习更智能，让成长更高效</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>手机号/邮箱</label>
            <input 
              type="text" 
              v-model="loginForm.username"
              placeholder="请输入电话号或邮箱"
              required
            />
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              type="password" 
              v-model="loginForm.password"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="loginForm.remember">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="goToForgotPassword">忘记密码？</a>
          </div>
          
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          
          <div class="register-link">
            还没有账号？ <a href="#" @click="showRegister = true">立即注册</a>
          </div>
        </form>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
      
      <!-- 注册弹窗 -->
      <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
        <div class="register-modal" @click.stop>
          <h2>用户注册</h2>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="registerForm.username" required>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="registerForm.email" required>
            </div>
            <div class="form-group">
              <label>手机号</label>
              <input type="text" v-model="registerForm.phoneNumber" required>
            </div>
            <div class="form-group">
              <label>姓名</label>
              <input type="text" v-model="registerForm.name" required>
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="registerForm.role" required>
                <option value="student">学生</option>
                <option value="teacher">教师</option>
              </select>
            </div>
            <div class="form-group">
              <label>密码</label>
              <input type="password" v-model="registerForm.password" required>
            </div>
            <div class="form-group">
              <label>确认密码</label>
              <input type="password" v-model="registerForm.confirmPassword" required>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showRegister = false">取消</button>
              <button type="submit">注册</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { loginByEmail, loginByPhoneNumber } from '@/api/login'
  import { register } from '@/api/user'
  import axios from 'axios'

  const router = useRouter()

  const loginForm = reactive({
    username: '',
    password: '',
    remember: false
  })

  const registerForm = reactive({
    username: '',
    email: '',
    phoneNumber: '',
    name: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  })

  const loading = ref(false)
  const error = ref('')
  const showRegister = ref(false)

  function goToForgotPassword() {
    router.push('/forgot-password')
  }

  async function handleLogin() {
    loading.value = true
    error.value = ''
    try {
      let response
      const username = loginForm.username.trim()
      const password = loginForm.password
      if (/^\d{11}$/.test(username)) {
        response = await loginByPhoneNumber({ phoneNumber: username, password })
      } else if (/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(username)) {
        response = await loginByEmail({ email: username, password })
      } else {
        error.value = '请输入正确的邮箱或手机号'
        loading.value = false
        return
      }
      console.log('登录返回：', response)
      const data = response.data || response
      if (!data.token || !data.user) {
        error.value = '登录失败，返回数据异常'
        loading.value = false
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.role === 'ROLE_STUDENT') {
        router.push('/student')
      } else if (data.user.role === 'ROLE_TEACHER') {
        router.push('/teacher')
      } else {
        router.push('/')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '登录失败，请检查账号和密码'
    } finally {
      loading.value = false
    }
  }

  async function handleRegister() {
    if (registerForm.password !== registerForm.confirmPassword) {
      return
    }
    try {
      await register({
        username: registerForm.username,
        email: registerForm.email,
        phoneNumber: registerForm.phoneNumber,
        name: registerForm.name,
        role: registerForm.role,
        password: registerForm.password
      })
      showRegister.value = false
      Object.assign(registerForm, {
        username: '',
        email: '',
        phoneNumber: '',
        name: '',
        role: 'student',
        password: '',
        confirmPassword: ''
      })
    } catch (err) {
    }
  }

  function preview(role) {
    localStorage.setItem('user', JSON.stringify({ role, guest: true }))
    router.push(`/${role}`)
  }

  const userInfo = ref({ name: '薛聪睿' })
  console.log('userInfo:', userInfo.value)
  </script>
  
  <style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #6a93ff 0%, #a4bafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.10), 0 1.5px 8px #e0e7ff;
  padding: 48px 38px 32px 38px;
  width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-icon {
  font-size: 2.5rem;
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #409EFF;
  margin: 0;
}

.subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-top: 6px;
  letter-spacing: 1px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #dbeafe;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  background: #f8fafc;
  margin-top: 2px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #409EFF;
  background: #fff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  margin-bottom: 2px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 4px;
}

.forgot-password {
  color: #409EFF;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.98rem;
}

.login-btn {
  width: 100%;
  padding: 12px 0;
  background: #409EFF;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px #e0e7ff;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  margin-top: 8px;
}
.login-btn:hover:not(:disabled) {
  background: #2563eb;
}
.login-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 18px;
  font-size: 1rem;
  color: #888;
}

.register-link a {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.error-message {
  color: #fff;
  background: #ff4d4f;
  border-radius: 6px;
  padding: 8px 0;
  text-align: center;
  margin-top: 18px;
  font-size: 1rem;
  box-shadow: 0 2px 8px #ffeaea;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.register-modal {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.13);
  padding: 36px 32px 24px 32px;
  width: 370px;
  max-width: 95vw;
  position: relative;
}

.register-modal h2 {
  text-align: center;
  color: #409EFF;
  margin-bottom: 18px;
}

.register-modal .form-group {
  margin-bottom: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.modal-actions button {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  background: #f0f9ff;
  color: #409EFF;
  transition: background 0.2s;
}

.modal-actions button[type='submit'] {
  background: #409EFF;
  color: #fff;
}

@media (max-width: 600px) {
  .login-box, .register-modal {
    width: 98vw;
    padding: 18px 4vw 12px 4vw;
  }
  .logo h1 {
    font-size: 1.2rem;
  }
}
</style>