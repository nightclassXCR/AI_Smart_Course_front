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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .login-box {
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  
  .logo-icon {
    font-size: 32px;
  }
  
  .logo h1 {
    margin: 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
  }
  
  .subtitle {
    color: #666;
    margin: 0;
    font-size: 14px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 500;
  }
  
  .form-group input, 
  .form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    font-size: 14px;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
  }
  
  .forgot-password {
    color: #667eea;
    text-decoration: none;
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover:not(:disabled) {
    background: #5a6fd8;
  }
  
  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;
  }
  
  .register-link a {
    color: #667eea;
    text-decoration: none;
  }
  
  .error-message {
    margin-top: 15px;
    padding: 10px;
    background: #fee;
    color: #c33;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .register-modal {
    background: white;
    border-radius: 8px;
    padding: 30px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .register-modal h2 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .modal-actions button {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modal-actions button[type="submit"] {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
  
  @media (max-width: 600px) {
    .login-box {
      max-width: 98vw;
      padding: 18px 6vw 18px 6vw;
    }
  }
  </style>