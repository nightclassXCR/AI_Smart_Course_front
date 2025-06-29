<template>
  <div class="teacher-analysis">
    <el-main class="main-content">
      <div class="page-title">
        <h2>成绩分析</h2>
        <div class="actions">
          <el-button type="primary" @click="refreshData">
            <i class="el-icon-refresh"></i> 刷新数据
          </el-button>
        </div>
      </div>
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-title">课程总数</div>
          <div class="stat-value">{{ stats.courseCount }}</div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-title">学生总数</div>
          <div class="stat-value">{{ stats.studentCount }}</div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-title">平均分</div>
          <div class="stat-value">{{ stats.avgScore }}</div>
        </el-card>
      </div>
      <!-- 课程成绩分布表 -->
      <el-card class="page-card">
        <div class="page-header">
          <h2>课程成绩分布</h2>
        </div>
        <el-table :data="courseStats" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="studentCount" label="参与学生数" />
          <el-table-column prop="avgScore" label="平均分" />
          <el-table-column prop="maxScore" label="最高分" />
          <el-table-column prop="minScore" label="最低分" />
          <el-table-column prop="passRate" label="及格率" />
          <el-table-column prop="excellentRate" label="优秀率" />
        </el-table>
      </el-card>
      <!-- 可选：学生成绩明细 -->
      <!-- <el-card class="page-card">
        <div class="page-header">
          <h2>学生成绩明细</h2>
        </div>
        <el-table :data="studentStats" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="studentName" label="学生姓名" />
          <el-table-column prop="studentId" label="学号" />
          <el-table-column prop="courseName" label="课程名称" />
          <el-table-column prop="score" label="分数" />
          <el-table-column prop="rank" label="排名" />
          <el-table-column prop="progress" label="进度" />
          <el-table-column prop="remark" label="备注/建议" />
        </el-table>
      </el-card> -->
      <el-card class="page-card" style="margin-bottom: 24px;">
        <div class="page-header">
          <h2>成绩分布图</h2>
          <el-select v-model="selectedCourse" placeholder="请选择课程" style="width: 200px; margin-left: 20px;" @change="updateChart">
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </div>
        <div id="score-chart" style="width: 100%; height: 350px;"></div>
      </el-card>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const stats = ref({
  courseCount: 3,
  studentCount: 120,
  avgScore: 78
})

const courseStats = ref([
  { name: '高等数学', studentCount: 60, avgScore: 80, maxScore: 98, minScore: 45, passRate: '90%', excellentRate: '25%' },
  { name: '线性代数', studentCount: 40, avgScore: 75, maxScore: 95, minScore: 50, passRate: '85%', excellentRate: '18%' },
  { name: '大学英语', studentCount: 20, avgScore: 70, maxScore: 90, minScore: 55, passRate: '80%', excellentRate: '10%' }
])

// 假设课程列表和成绩分布数据如下，实际可从后端获取
const courseList = ref([
  { id: 1, name: '高等数学' },
  { id: 2, name: '线性代数' },
  { id: 3, name: '大学英语' }
])

const scoreDistributions = ref({
  1: [5, 12, 20, 18, 7], // 高等数学
  2: [2, 10, 15, 22, 11], // 线性代数
  3: [1, 8, 14, 19, 17]   // 大学英语
})

const selectedCourse = ref(courseList.value[0].id)
let chartInstance = null

const updateChart = () => {
  if (!chartInstance) return
  chartInstance.setOption({
    series: [{
      data: scoreDistributions.value[selectedCourse.value]
    }]
  })
}

const refreshData = () => {
  ElMessage.info('刷新成绩分析数据（请对接实际逻辑）')
}

onMounted(() => {
  chartInstance = echarts.init(document.getElementById('score-chart'))
  chartInstance.setOption({
    title: { text: '成绩分布' },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['<60', '60-70', '70-80', '80-90', '90-100']
    },
    yAxis: { type: 'value' },
    series: [{
      name: '人数',
      data: scoreDistributions.value[selectedCourse.value],
      type: 'bar',
      barWidth: '40%'
    }]
  })
})

// 监听课程选择变化，更新图表
watch(selectedCourse, updateChart)
</script>

<style scoped>
.teacher-analysis {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  min-width: 180px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.desc {
  color: #888;
  font-size: 15px;
  margin-bottom: 12px;
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