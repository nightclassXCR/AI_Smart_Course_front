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
      <!-- <div class="info-row"><span>院系：</span>{{ teacher.department || '计算机学院' }}</div> -->
      <div class="info-row"><span>联系方式：</span>{{ teacher.phoneNumber || '未填写' }}</div>
      <div class="info-row"><span>邮箱：</span>{{ teacher.email || '未填写' }}</div>
    </div>
    <!-- 操作按钮区 -->
    <div class="profile-actions">
      <el-button type="primary" @click="openEdit">修改资料</el-button>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
    <!-- 修改资料弹窗 -->
    <el-dialog v-model="showEdit" title="修改资料" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editForm.phoneNumber" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEdit = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter();
const defaultAvatar = 'https://img1.baidu.com/it/u=1618884812,3704489962&fm=253&fmt=auto&app=138&f=JPEG?w=200&h=200';
const teacher = ref({});
const showEdit = ref(false);
const editForm = ref({ name: '', email: '', phoneNumber: '' });

onMounted(() => {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    // 兼容 phoneNumber 字段
    if (u && !u.phoneNumber && u.phone_number) {
      u.phoneNumber = u.phone_number;
    }
    teacher.value = u || {};
  } catch {
    teacher.value = {};
  }
});

function openEdit() {
  editForm.value = {
    name: teacher.value.name || '',
    email: teacher.value.email || '',
    phoneNumber: teacher.value.phoneNumber || ''
  };
  showEdit.value = true;
}

function saveEdit() {
  teacher.value.name = editForm.value.name;
  teacher.value.email = editForm.value.email;
  teacher.value.phoneNumber = editForm.value.phoneNumber;
  localStorage.setItem('user', JSON.stringify(teacher.value));
  showEdit.value = false;
  ElMessage.success('资料已更新');
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