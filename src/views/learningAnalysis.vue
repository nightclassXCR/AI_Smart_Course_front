<template>
  <div class="learning-analysis">
  
    <!-- 学习分析主内容 -->
    <el-main class="main-content">
      <div class="page-title">
        <h2>学习分析</h2>
        <div class="actions">
          <el-button type="primary" @click="refreshData">
            <i class="el-icon-refresh"></i> 刷新数据
          </el-button>
          <el-button type="primary" @click="exportReport">
            <i class="el-icon-download"></i> 导出报告
          </el-button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-title">总学习时长</div>
            <div class="stat-value">{{ stats.totalStudyTime }}h</div>
            <div class="stat-trend">+{{ stats.totalStudyTimeTrend }}% 本周</div>
          </div>
          <div class="stat-icon"><i class="el-icon-time"></i></div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-title">平均完成率</div>
            <div class="stat-value">{{ stats.averageCompletionRate }}%</div>
            <div class="stat-trend">+{{ stats.averageCompletionRateTrend }}% 本月</div>
          </div>
          <div class="stat-icon"><i class="el-icon-check"></i></div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-title">活跃学生</div>
            <div class="stat-value">{{ stats.activeStudents }}</div>
            <div class="stat-trend">{{ stats.activeStudentRate }}% 参与率</div>
          </div>
          <div class="stat-icon"><i class="el-icon-user"></i></div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-title">优秀率</div>
            <div class="stat-value">{{ stats.excellentRate }}%</div>
            <div class="stat-trend">+{{ stats.excellentRateTrend }}% 提升</div>
          </div>
          <div class="stat-icon"><i class="el-icon-medal"></i></div>
        </el-card>
      </div>

      <!-- 标签切换 -->
      <el-tag-group class="filter-tags">
        <el-tag
          v-for="(tag, index) in filterTags"
          :key="index"
          :type="tag === activeFilter ? 'primary' : ''"
          @click="handleFilter(tag)"
        >
          {{ tag }}
        </el-tag>
      </el-tag-group>

      <!-- 科目表现分析 -->
      <el-card class="subject-analysis" v-if="activeFilter === '学科表现'">
        <h3>各科目表现分析</h3>
        <div class="subject-item" v-for="(subject, index) in subjects" :key="index">
          <div class="subject-info">
            <span class="subject-name">{{ subject.name }}</span>
            <span>平均分: {{ subject.averageScore }}</span>
          </div>
          <div class="progress-container">
            <el-progress
              :percentage="subject.progress"
              :stroke-width="6"
              :color="getProgressColor(subject.progress)"
            />
            <span class="progress-info">
              {{ subject.change }} {{ subject.studentCount }} 学生
            </span>
          </div>
        </div>
      </el-card>

      <!-- 学习模式分析（可扩展） -->
      <el-card class="mode-analysis" v-if="activeFilter === '学习模式'">
        <h3>学习模式分析</h3>
        <p>这里可以展示不同学习模式的数据分析（如线上/线下、自主/辅导等）</p>
        <!-- 可扩展图表组件 -->
      </el-card>

      <!-- 进度追踪分析（可扩展） -->
      <el-card class="tracking-analysis" v-if="activeFilter === '进度追踪'">
        <h3>进度追踪分析</h3>
        <p>这里可以展示学生学习进度的追踪数据</p>
        <!-- 可扩展进度图表 -->
      </el-card>

      <!-- 智能洞察分析（可扩展） -->
      <el-card class="insight-analysis" v-if="activeFilter === '智能洞察'">
        <h3>智能洞察分析</h3>
        <p>这里可以展示AI驱动的学习洞察建议</p>
        <!-- 可扩展洞察内容 -->
      </el-card>

      <el-card class="page-card">
        <div class="page-header">
          <h2>学习分析</h2>
        </div>
        <el-table :data="analysisList" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="subject" label="科目" />
          <el-table-column prop="score" label="平均分" />
          <el-table-column prop="rank" label="班级排名" />
          <el-table-column prop="progress" label="进度">
            <template #default="scope">
              <el-progress :percentage="scope.row.progress" :text-inside="true" :stroke-width="18" />
            </template>
          </el-table-column>
          <el-table-column prop="advice" label="学习建议" />
        </el-table>
      </el-card>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  ElHeader,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElInput,
  ElCard,
  ElTag,
  ElProgress,
  ElTable,
  ElTableColumn,
} from 'element-plus';

// 模拟数据
const stats = ref({
  totalStudyTime: 2847,
  totalStudyTimeTrend: 12,
  averageCompletionRate: 87.3,
  averageCompletionRateTrend: 5.2,
  activeStudents: 142,
  activeStudentRate: 91,
  excellentRate: 34.2,
  excellentRateTrend: 2.8,
});

const filterTags = ref(['学科表现', '学习模式', '进度追踪', '智能洞察']);
const activeFilter = ref('学科表现');
const subjects = ref([
  {
    name: '数学',
    averageScore: 85.2,
    progress: 85,
    change: '+3.2',
    studentCount: 156,
  },
  {
    name: '物理',
    averageScore: 78.9,
    progress: 79,
    change: '+1.8',
    studentCount: 142,
  },
  {
    name: '化学',
    averageScore: 82.1,
    progress: 82,
    change: '-0.5',
    studentCount: 138,
  },
  {
    name: '英语',
    averageScore: 76.5,
    progress: 77,
    change: '+2.1',
    studentCount: 165,
  },
  {
    name: '语文',
    averageScore: 81.3,
    progress: 81,
    change: '+1.2',
    studentCount: 158,
  },
]);

// 响应式数据
const activeMenu = ref('analysis');

// 方法：处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index;
  // 可添加路由跳转逻辑
  console.log('切换到：', index);
};

// 方法：处理筛选标签
const handleFilter = (tag) => {
  activeFilter.value = tag;
};

// 方法：刷新数据
const refreshData = () => {
  console.log('刷新学习分析数据');
  // 可添加实际刷新逻辑
};

// 方法：导出报告
const exportReport = () => {
  console.log('导出学习分析报告');
  // 可添加实际导出逻辑
};

// 辅助方法：获取进度条颜色
const getProgressColor = (progress) => {
  if (progress >= 80) return '#67C23A';
  if (progress >= 60) return '#E6A23C';
  return '#F56C6C';
};

const analysisList = ref([
  { subject: '数学', score: 88, rank: 3, progress: 85, advice: '保持良好，继续巩固难点。' },
  { subject: '物理', score: 91, rank: 1, progress: 92, advice: '表现优秀，适当挑战更高难度。' },
  { subject: '化学', score: 76, rank: 8, progress: 67, advice: '加强基础知识复习。' },
  { subject: '英语', score: 68, rank: 15, progress: 45, advice: '多做阅读理解练习。' },
  { subject: '语文', score: 82, rank: 6, progress: 78, advice: '作文部分需提升。' }
]);
</script>

<style scoped>
.learning-analysis {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.logo i {
  color: #409eff;
  margin-right: 5px;
}

.el-menu-demo {
  border-bottom: none;
}

.search-bar {
  display: flex;
  align-items: center;
}

.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.stat-trend {
  font-size: 12px;
  color: #67c23a;
}

.stat-icon {
  font-size: 36px;
  color: #409eff;
}

.filter-tags {
  margin-bottom: 20px;
}

.subject-analysis,
.mode-analysis,
.tracking-analysis,
.insight-analysis {
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.subject-info {
  display: flex;
  flex-direction: column;
}

.subject-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-info {
  font-size: 14px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }

  .el-menu-demo {
    margin: 10px 0;
  }

  .search-bar {
    margin-top: 10px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

.page-card {
  max-width: 900px;
  width: 100%;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.el-table {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .page-card {
    max-width: 100vw;
    margin: 10px 0;
    padding: 10px 2vw;
  }
  .page-header h2 {
    font-size: 1.1rem;
  }
  .el-table {
    font-size: 13px;
  }
}
</style>