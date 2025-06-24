<template>
  <div class="progress-container">
    <!-- 顶部标题区 -->
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📈</div>
        <div>
          <h1>学习进度</h1>
          <p class="subtitle">查看各课程的学习进度，掌握学习节奏</p>
        </div>
      </div>
      <div class="search-box">
        <input v-model="search" type="text" placeholder="搜索课程..." />
        <button class="search-btn">🔍</button>
      </div>
    </div>
    <!-- 标签切换 -->
    <div class="filter-tabs">
      <button :class="['tab', { active: activeTab === 'all' }]" @click="setActiveTab('all')">全部课程</button>
      <button :class="['tab', { active: activeTab === 'ongoing' }]" @click="setActiveTab('ongoing')">进行中</button>
      <button :class="['tab', { active: activeTab === 'finished' }]" @click="setActiveTab('finished')">已完成</button>
    </div>
    <!-- 进度卡片列表 -->
    <div class="progress-list">
      <div v-for="item in filteredProgress" :key="item.course" class="progress-card">
        <div class="progress-header">
          <div class="progress-title">{{ item.course }}</div>
          <div class="progress-status" :class="item.progress >= 100 ? 'finished' : 'ongoing'">
            {{ item.progress >= 100 ? '已完成' : '进行中' }}
          </div>
        </div>
        <div class="progress-meta">
          <span>当前章节：{{ item.chapter }}</span>
          <span class="last-update">最近学习：{{ item.lastUpdate }}</span>
        </div>
        <div class="progress-bar">
          <el-progress :percentage="item.progress" :stroke-width="16" />
        </div>
      </div>
      <!-- 空状态 -->
      <div v-if="filteredProgress.length === 0" class="empty-state">
        <div class="empty-icon">📈</div>
        <h3>暂无进度</h3>
        <p>当前没有{{ getEmptyMessage() }}课程进度</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getStudentProgress } from '@/api/progress';
import { ElMessage } from 'element-plus';

const progressList = ref([]);
const search = ref('');
const activeTab = ref('all');

const fetchProgress = async () => {
  try {
    const res = await getStudentProgress();
    progressList.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取进度数据失败');
  }
};

onMounted(fetchProgress);

const filteredProgress = computed(() => {
  let list = progressList.value;
  if (activeTab.value === 'ongoing') {
    list = list.filter(c => c.progress < 100);
  } else if (activeTab.value === 'finished') {
    list = list.filter(c => c.progress >= 100);
  }
  if (search.value.trim()) {
    list = list.filter(c => c.course.includes(search.value.trim()));
  }
  return list;
});

function setActiveTab(tab) {
  activeTab.value = tab;
}
function getEmptyMessage() {
  if (activeTab.value === 'ongoing') return '进行中的';
  if (activeTab.value === 'finished') return '已完成的';
  return '';
}
</script>

<style scoped>
.progress-container {
  max-width: 900px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px 24px 24px;
}
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  font-size: 2rem;
}
.subtitle {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.search-box {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 16px;
  padding: 2px 8px;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  padding: 4px 0 4px 4px;
}
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
}
.filter-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}
.tab {
  background: #f5f7fa;
  border: none;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: #409EFF;
  color: #fff;
}
.progress-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  min-height: 180px;
}
.progress-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.progress-title {
  font-weight: bold;
  font-size: 17px;
}
.progress-status {
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 12px;
  color: #fff;
  background: #67c23a;
}
.progress-status.ongoing {
  background: #409EFF;
}
.progress-status.finished {
  background: #67c23a;
}
.progress-meta {
  color: #888;
  font-size: 14px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.last-update {
  font-size: 13px;
  color: #aaa;
}
.progress-bar {
  margin-bottom: 4px;
}
.empty-state {
  width: 100%;
  text-align: center;
  margin: 40px 0 20px 0;
  color: #888;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}
@media (max-width: 900px) {
  .progress-container {
    max-width: 100vw;
    padding: 10px 2vw;
  }
  .progress-card {
    width: 100%;
    min-width: 0;
  }
}
</style>