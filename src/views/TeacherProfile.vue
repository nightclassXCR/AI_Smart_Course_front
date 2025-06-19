<template>
  <div class="profile-container">
    <!-- 顶部头像昵称区 -->
    <div class="profile-header">
      <el-avatar :size="72" :src="teacher.avatar || defaultAvatar" />
      <div class="profile-info">
        <div class="profile-name">{{ teacher.name || '教师' }}</div>
        <div class="profile-id">工号：{{ teacher.id || 'T20240001' }}</div>
      </div>
    </div>
    <!-- 基本信息卡片 -->
    <div class="info-card">
      <div class="info-row"><span>院系：</span>{{ teacher.department || '计算机学院' }}</div>
      <div class="info-row"><span>联系方式：</span>{{ teacher.phone || '未填写' }}</div>
      <div class="info-row"><span>邮箱：</span>{{ teacher.email || '未填写' }}</div>
    </div>
    <!-- 操作按钮区 -->
    <div class="profile-actions">
      <el-button type="primary" @click="editProfile">修改资料</el-button>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const defaultAvatar = 'https://img1.baidu.com/it/u=1618884812,3704489962&fm=253&fmt=auto&app=138&f=JPEG?w=200&h=200';
const teacher = ref({
  name: '李教授',
  id: 'T20240001',
  avatar: '',
  department: '计算机学院',
  phone: '',
  email: ''
});
function editProfile() {
  // 实际应弹窗或跳转到资料编辑页
  alert('资料编辑功能开发中');
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}
</script>

<style scoped>
.profile-container {
  max-width: 420px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
}
.profile-info {
  margin-top: 12px;
  text-align: center;
}
.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}
.profile-id {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.info-card {
  width: 100%;
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  margin-bottom: 18px;
}
.info-row {
  font-size: 15px;
  color: #303133;
  margin-bottom: 10px;
}
.info-row span {
  color: #409EFF;
  margin-right: 8px;
}
.profile-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  justify-content: center;
}
</style> 