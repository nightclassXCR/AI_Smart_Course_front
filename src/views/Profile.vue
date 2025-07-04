<template>
  <div class="profile-container">
    <!-- 顶部头像昵称区 -->
    <div class="profile-header">
      <!-- <el-avatar :size="72" :src="user.avatar || defaultAvatar" /> -->
      <div class="profile-info">
        <div class="profile-name">{{ user.name || '用户' }}</div>
        <div class="profile-id">ID：{{ user.id || '未登录' }}</div>
      </div>
    </div>
    <!-- 基本信息卡片 -->
    <div class="info-card">
      <div class="info-row"><span>邮箱：</span>{{ user.email || '未填写' }}</div>
      <div class="info-row"><span>联系方式：</span>{{ user.phoneNumber || '未填写' }}</div>
      <div class="info-row"><span>身份：</span>{{ roleText }}</div>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { updateUser } from '@/api/user';
const router = useRouter();
const defaultAvatar = 'https://img1.baidu.com/it/u=1618884812,3704489962&fm=253&fmt=auto&app=138&f=JPEG?w=200&h=200';
const user = ref({});
const showEdit = ref(false);
const editForm = ref({ name: '', email: '', phoneNumber: '' });

onMounted(() => {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    // 兼容后端未映射phoneNumber的情况
    if (u && !u.phoneNumber && u.phone_number) {
      u.phoneNumber = u.phone_number;
    }
    user.value = u || {};
  } catch {
    user.value = {};
  }
});

const roleText = computed(() => {
  if (user.value.role === 'ROLE_STUDENT') return '学生';
  if (user.value.role === 'ROLE_TEACHER') return '教师';
  return '未知';
});

function openEdit() {
  editForm.value = {
    name: user.value.name || '',
    email: user.value.email || '',
    phoneNumber: user.value.phoneNumber || ''
  };
  showEdit.value = true;
}

async function saveEdit() {
  try {
    const res = await updateUser({
      ...user.value,
      name: editForm.value.name,
      email: editForm.value.email,
      phoneNumber: editForm.value.phoneNumber
    });
    if (res === 1) {
      user.value.name = editForm.value.name;
      user.value.email = editForm.value.email;
      user.value.phoneNumber = editForm.value.phoneNumber;
      localStorage.setItem('user', JSON.stringify(user.value));
      showEdit.value = false;
      ElMessage.success('资料已更新');
    } else {
      ElMessage.error('资料更新失败');
    }
  } catch (e) {
    ElMessage.error('资料更新失败');
  }
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
@media (max-width: 600px) {
  .profile-container {
    max-width: 100%;
    padding: 10px 2vw;
  }
}
</style> 