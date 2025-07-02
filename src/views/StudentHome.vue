<template>
  <div class="home-container">
    <!-- 顶部欢迎区 -->
    <div class="header-area">
      <div class="header-title">
        <div class="logo">👋</div>
        <div>
          <h1>你好，{{ props.userInfo.name || '' }}同学</h1>
          <p class="subtitle">继续你的学习之旅，今天也要加油！</p>
        </div>
      </div>
    </div>
    <!-- 新增：全部课程与为你推荐横向并排 -->
    <div class="top-row">
      <div class="module-card recommend-card">
        <div class="module-header">
          <span class="module-title">为你推荐</span>
        </div>
        <div v-if="recommendList && recommendList.length" class="overview-list">
          <div v-for="rec in recommendList" :key="rec.id" class="overview-item" @click="router.push(`/student/course/${rec.id}`)">
            <div class="overview-title">{{ rec.name }}</div>
            <div class="overview-meta">教师：{{ rec.teacherRealName }}</div>
            <div class="overview-meta">课程简介：{{ rec.description}}</div>
            <!-- <el-progress :percentage="rec.progress" :stroke-width="8" /> -->
          </div>
        </div>
        <div v-else class="empty-module">暂无推荐</div>
      </div>
      <div class="module-card all-courses-card">
        <div class="module-header">
          <span class="module-title">全部课程</span>
        </div>
        <div v-if="allCourses && allCourses.length" class="overview-list">
          <div v-for="course in allCourses" :key="course.id" class="overview-item">
            <div class="overview-title" @click="router.push(`/student/courseIntro/${course.id}`)" style="cursor:pointer; color:#409EFF;">{{ course.name }}</div>
            <div class="overview-meta">教师：{{ course.teacherRealName }}</div>
            <div class="overview-meta">课程简介：{{ course.description }}</div>
            <!-- <el-progress :percentage="course.progress" :stroke-width="8" /> -->
            <el-button type="primary" size="small" @click="enrollCourseHandler(course.id)">选课</el-button>
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
    </div>
    <!-- 统计卡片区 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-time"></i></div>
        <div class="stat-content">
          <h3>学习时长</h3>
          <div class="stat-value">{{ stats.studyTime }}h</div>
    
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-tickets"></i></div>
        <div class="stat-content">
          <h3>完成课程</h3>
          <div class="stat-value">{{ stats.completedCourses }}</div>
    
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-trophy"></i></div>
        <div class="stat-content">
          <h3>平均分数</h3>
          <div class="stat-value">{{ averageScore }}</div>

        </div>
      </div>
      <!-- <div class="stat-card">
        <div class="stat-icon"><i class="el-icon-aim"></i></div>
        <div class="stat-content">
          <h3>学习目标</h3>
          <div class="stat-value">{{ stats.studyGoal }}%</div>
    
        </div>
      </div> -->
    </div>
    <!-- 课程/作业/动态模块 -->
    <div class="modules-row">
      
      <!-- 我的课程模块 -->
      <div class="module-card">
        <div class="module-header">
          <span class="module-title">我的课程</span>
          <el-button type="text" @click="router.push('/student/myCourse')">查看全部</el-button>
        </div>
        <div v-if="courses && courses.length" class="module-list">
          <div v-for="course in courses.slice(0,2)" :key="course.id" class="module-item">
            <div class="item-title">{{ course.name }}</div>
            <div class="item-meta">{{ course.learningPosition }}</div>
            <!-- <el-progress :percentage="course.progress" :stroke-width="10" /> -->
          </div>
        </div>
        <div v-else class="empty-module">暂无课程</div>
      </div>
      <!-- 我的作业模块 -->
      <div class="my-block">
        <div class="block-header">
          <span class="block-title">我的作业</span>
          <router-link to="/student/assignment" class="block-more">查看更多</router-link>
        </div>
        <div class="my-assignments-list">
          <div v-if="assignments.length === 0" class="empty-text">暂无作业</div>
          <div v-else>
            <div
              v-for="assignment in assignments.slice(0,2)"
              :key="assignment.id"
              class="assignment-card"
              @click="goToAssignment(assignment.id)"
              style="cursor:pointer"
            >
              <div class="assignment-title">{{ assignment.title }}</div>
              <div class="assignment-info">课程：{{ assignment.courseName }}</div>
              <div class="assignment-deadline">
                截止：{{ assignment.deadline ? assignment.deadline : '无截止时间' }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCompleteCourse, enrollCourse, getNotMyCourse, getMyCourses } from '@/api/course'
import { ElMessage } from 'element-plus'
import { useAttrs } from 'vue'
import { getHomeworkList } from '@/api/homework'
import { getMyTotalStudyTime, getLatestLearningLogInCourse } from '@/api/analysis'

const router = useRouter()
const attrs = useAttrs()

const props = defineProps(['userInfo', 'stats', 'courses', 'assignments', 'recentActivities', 'allCourses'])

const userInfo = ref(props.userInfo || {})
const courses = ref([])
const assignments = ref([])
const recentActivities = ref(props.recentActivities || [])
const allCourses = ref([])
const recommendList = ref([])

const stats = ref(props.stats || {})

// 计算所有课程的平均分数
const averageScore = computed(() => {
  if (!allCourses.value.length) return 0;
  // 只统计有 averageScore 字段的课程
  const scores = allCourses.value.map(c => Number(c.averageScore)).filter(s => !isNaN(s));
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length * 10) / 10;
}); 

async function fetchAllCourses() {
  try {
    const res = await getNotMyCourse()
    allCourses.value = res.data?.list || res.data || []
    // 随机选取3门课程
    const shuffled = allCourses.value.slice().sort(() => 0.5 - Math.random())
    recommendList.value = shuffled.slice(0, 3)
  } catch (e) {
    ElMessage.error('获取课程列表失败')
  }
}

async function enrollCourseHandler(courseId) {
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    await enrollCourse(courseId, user.id);
    ElMessage.success('选课成功');
    fetchAllCourses();
  } catch (e) {
    ElMessage.error('选课失败');
  }
}

// 获取学习时长数据
async function fetchStudyTime() {
  try {
    const res = await getMyTotalStudyTime()
    if (res.data !== undefined && res.data !== null) {
      // 后端返回的是小时，进行四舍五入保留两位小数
      stats.value.studyTime = Math.round(res.data * 100) / 100
    }
  } catch (e) {
    console.error('获取学习时长失败:', e)
    stats.value.studyTime = 0
  }
}

async function fetchCompletedCoursesCount(params) {
  try{
    const res = await getCompleteCourse()
    stats.value.completedCourses =res.data
  } catch(e){
    console.error('获取完成课程失败：',e)
    stats.value.completedCourses = 0
  }
  
}

// 获取课程的最新学习位置
async function fetchCourseLearningProgress() {
  try {
    const res = await getMyCourses()
    const courseList = res.data?.list || res.data || []
    
    // 为每个课程获取最新学习记录
    const coursesWithProgress = await Promise.all(
      courseList.map(async (course) => {
        try {
          const progressRes = await getLatestLearningLogInCourse(course.id)
          const latestLog = progressRes.data
          
          // 根据最新学习记录的 targetType 生成学习位置描述
          let learningPosition = '未开始学习'
          if (latestLog) {
            switch (latestLog.targetType) {
              case 'chapter':
                learningPosition = `正在学习：章节:${latestLog.targetName}`
                break
              case 'concept':
                learningPosition = `正在学习：概念 ${latestLog.targetName}`
                break
              case 'course':
                learningPosition = '正在学习课程'
                break
              case 'task':
                learningPosition = `正在做作业${latestLog.targetName}`
                break
              case 'resource':
                learningPosition = `正在查看资源${latestLog.targetName}`
                break
              default:
                learningPosition = '学习中'
                break
            }
            
            // // 如果有详细信息，可以添加到学习位置中
            // if (latestLog.detail) {
            //   learningPosition += ` - ${latestLog.detail}`
            // }
          }
          
          return {
            ...course,
            learningPosition
          }
        } catch (error) {
          console.error(`获取课程 ${course.id} 学习进度失败:`, error)
          return {
            ...course,
            learningPosition: '未开始学习'
          }
        }
      })
    )
    
    courses.value = coursesWithProgress.slice(0, 2)
  } catch (e) {
    ElMessage.error('获取我的课程失败')
  }
}

onMounted(async () => {
  // 获取学习时长
  await fetchStudyTime()
  await fetchCompletedCoursesCount()
  
  // 获取课程学习进度
  await fetchCourseLearningProgress()
  
  // 其他初始化逻辑
  fetchAllCourses()
  getAssignments()
})

function getAssignments() {
  getHomeworkList().then(res => {
    assignments.value = res.data || [];
  });
}

function goToAssignment(id) {
  router.push(`/student/assignment/${id}/start`)
}
</script>

<style scoped>
.home-container {
  max-width: 1100px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px 24px 24px;
}
.header-area {
  display: flex;
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
.stats-grid {
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
  align-items: center;
  gap: 12px;
}
.stat-icon {
  font-size: 2rem;
  color: #409EFF;
}
.stat-content h3 {
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
.stat-change {
  font-size: 12px;
}
.stat-change.positive {
  color: #67c23a;
}
.modules-row {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.module-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.module-title {
  font-weight: bold;
  font-size: 16px;
}
.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.module-item {
  background: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  font-size: 15px;
}
.item-title {
  font-weight: 500;
  margin-bottom: 2px;
}
.item-meta {
  color: #888;
  font-size: 13px;
}
.item-time {
  color: #aaa;
  font-size: 12px;
  margin-left: 8px;
}
.empty-module {
  color: #aaa;
  text-align: center;
  margin: 18px 0 8px 0;
}
.course-overview-card {
  min-width: 320px;
  max-width: 420px;
  overflow-x: auto;
}
.overview-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.overview-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 12px 16px 10px 16px;
  min-width: 180px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.overview-item:hover {
  box-shadow: 0 4px 16px rgba(64,158,255,0.12);
}
.overview-title {
  font-weight: bold;
  font-size: 15px;
}
.overview-meta {
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.top-row {
  width: 100%;
  display: flex;
  gap: 24px;
  justify-content: flex-start;
  margin-bottom: 18px;
}
.all-courses-card, .recommend-card {
  min-width: 320px;
  max-width: 600px;
  flex: 1;
  margin: 0;
  overflow-x: auto;
}
.my-block {
  background: #f7fafd;
  border-radius: 16px;
  padding: 20px 24px 16px 24px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.block-title {
  font-weight: bold;
  font-size: 18px;
  color: #222;
}
.block-more {
  color: #409eff;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.block-more:hover {
  color: #1867c0;
  text-decoration: underline;
}
.my-assignments-list {
  display: flex;
  gap: 20px;
}
.assignment-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e6eaf1;
  padding: 18px 20px 14px 20px;
  width: 220px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}
.assignment-card:hover {
  box-shadow: 0 6px 18px #dbeafe;
  transform: translateY(-4px) scale(1.03);
}
.assignment-title {
  font-weight: bold;
  font-size: 16px;
  color: #222;
  margin-bottom: 8px;
}
.assignment-info,
.assignment-deadline {
  font-size: 13px;
  color: #8a97a6;
  margin-bottom: 2px;
}
.empty-text {
  color: #bbb;
  font-size: 14px;
  padding: 16px 0;
}
@media (max-width: 900px) {
  .home-container {
    max-width: 100vw;
    padding: 10px 2vw;
  }
  .stats-grid, .modules-row {
    flex-direction: column;
    gap: 12px;
  }
  .top-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 