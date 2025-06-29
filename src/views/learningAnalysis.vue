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
      <!-- <el-card class="page-card">
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
      </el-card> -->
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
import { getCourseByTeacherID } from '@/api/course'

const stats = ref({
  courseCount: 0,
  studentCount: 0,
  avgScore: 0
})

const courseStats = ref([])
const courseList = ref([])

// 成绩分布数据（暂时使用模拟数据，后续可以从后端获取）
const scoreDistributions = ref({
  1: [5, 12, 20, 18, 7], // 高等数学
  2: [2, 10, 15, 22, 11], // 线性代数
  3: [1, 8, 14, 19, 17]   // 大学英语
})

const selectedCourse = ref(null)
let chartInstance = null

// 获取课程统计数据
const fetchCourseStats = async () => {
  try {
    const response = await getCourseByTeacherID()
    const data = response.data || response
    
    if (Array.isArray(data)) {
      courseStats.value = data.map(course => ({
        name: course.name,
        studentCount: course.studentCount || 0,
        avgScore: course.averageScore ? Math.round(course.averageScore * 10) / 10 : 0,
        maxScore: course.maxScore || 0,
        minScore: course.minScore || 0,
        passRate: course.passRate || '0%',
        excellentRate: course.excellentRate || '0%'
      }))
      
      // 更新课程列表
      courseList.value = data.map(course => ({
        id: course.id,
        name: course.name
      }))
      
      // 更新统计信息
      stats.value = {
        courseCount: data.length,
        studentCount: data.reduce((sum, course) => sum + (course.studentCount || 0), 0),
        avgScore: data.length > 0 ? Math.round(data.reduce((sum, course) => sum + (course.averageScore || 0), 0) / data.length * 10) / 10 : 0
      }
      
      // 设置默认选中的课程
      if (courseList.value.length > 0 && !selectedCourse.value) {
        selectedCourse.value = courseList.value[0].id
      }
      
      // 更新图表
      if (chartInstance && selectedCourse.value) {
        updateChart()
      }
    }
  } catch (error) {
    console.error('获取课程统计数据失败:', error)
    ElMessage.error('获取课程统计数据失败')
  }
}

const updateChart = () => {
  if (!chartInstance || !selectedCourse.value) return
  
  // 这里可以根据选中的课程从后端获取具体的成绩分布数据
  // 暂时使用模拟数据
  const distributionData = scoreDistributions.value[selectedCourse.value] || [0, 0, 0, 0, 0]
  
  chartInstance.setOption({
    title: { 
      text: `${courseList.value.find(c => c.id === selectedCourse.value)?.name || '课程'}成绩分布` 
    },
    series: [{
      data: distributionData
    }]
  })
}

const refreshData = () => {
  fetchCourseStats()
  ElMessage.success('数据已刷新')
}

onMounted(async () => {
  // 初始化图表
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
      data: [0, 0, 0, 0, 0],
      type: 'bar',
      barWidth: '40%'
    }]
  })
  
  // 获取数据
  await fetchCourseStats()
})

// 监听选中课程变化
watch(selectedCourse, () => {
  updateChart()
})
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