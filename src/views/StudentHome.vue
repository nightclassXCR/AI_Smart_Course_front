<template>
  <div class="main-content">
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
              <div class="overview-meta course-desc">{{ rec.description }}</div>
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
              <div class="overview-meta course-desc">{{ course.description }}</div>
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
        <div class="module-card">
          <div class="module-header">
            <span class="module-title">我的作业</span>
            <!-- <router-link to="/student/assignment" class="text">查看更多</router-link> -->
            <el-button type="text" @click="router.push('/student/assignment')">查看全部</el-button>
          </div>
          <div class="module-list">
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
const courseLists = ref([])

const stats = ref(props.stats || {})

const averageScore = computed(() => {
  if (!courseLists.value.length) return 0
  const scores = courseLists.value.map(c => Number(c.averageScore)).filter(s => !isNaN(s))
  console.log('参与平均分计算的分数:', scores)
  if (!scores.length) return 0
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length * 10) / 10
})

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
    courseLists.value = coursesWithProgress
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
  await fetchAllCourses()
  console.log('allCourses:', allCourses.value)
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
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.10), 0 1.5px 8px #e0e7ff;
  padding: 40px 36px 32px 36px;
  max-width: 1100px;
  margin: 40px auto;
}
.header-title h1 {
  font-size: 2.1rem;
  font-weight: 800;
  color: #22223b;
  margin-bottom: 4px;
  letter-spacing: 1px;
}
.subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-top: 6px;
  letter-spacing: 1px;
}
.module-card {
  background: #f8fafc; /* 极浅蓝色，和内层卡片区分 */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(64,158,255,0.06);
  padding: 22px 20px 18px 20px;
  margin-bottom: 18px;
  transition: box-shadow 0.2s;
}
.module-card:hover {
  box-shadow: 0 8px 32px rgba(64,158,255,0.13);
}
.overview-item {
  background: #e3eefe !important; /* 强制生效，避免被覆盖 */
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 14px 18px 12px 18px;
  min-width: 200px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.overview-item:hover {
  box-shadow: 0 4px 16px rgba(64,158,255,0.12);
  transform: translateY(-2px) scale(1.03);
}
.overview-title {
  font-weight: bold;
  font-size: 16px;
  color: #409EFF;
  margin-bottom: 2px;
}
.course-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  min-height: 2.8em;
  color: #666;
  font-size: 14px;
}
.el-button, .overview-item .el-button {
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 18px;
}
.stats-grid {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
  justify-content: center;
}
.stat-card {
  background: #e3eefe; /* 由#f6faff调整为更深的淡蓝色 */
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 22px 24px 18px 24px;
  min-width: 180px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #22223b;
  margin-bottom: 4px;
}
.module-list, .my-assignments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.module-item, .assignment-card {
  background: #e3eefe; /* 由#f6faff调整为更深的淡蓝色 */
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 10px 14px;
  font-size: 15px;
  margin-bottom: 2px;
  border: 2px solid #b3cfff; /* 边框色加深 */
}
.module-item .item-title {
  font-weight: 600;
  color: #409EFF;
}
.module-item .item-meta {
  color: #888;
  font-size: 13px;
}
.assignment-title {
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 2px;
}
.assignment-info, .assignment-deadline {
  color: #888;
  font-size: 13px;
  margin-bottom: 2px;
}
/* 推荐和全部课程卡片美化 */
.module-card.recommend-card,
.module-card.all-courses-card {
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(64,158,255,0.06);
  padding: 22px 20px 18px 20px;
  margin-bottom: 18px;
  transition: box-shadow 0.2s;
}
.module-card.recommend-card:hover,
.module-card.all-courses-card:hover {
  box-shadow: 0 8px 32px rgba(64,158,255,0.13);
}
.overview-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 14px 18px 12px 18px;
  min-width: 200px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.overview-item:hover {
  box-shadow: 0 4px 16px rgba(64,158,255,0.12);
  transform: translateY(-2px) scale(1.03);
}
.overview-title {
  font-weight: bold;
  font-size: 16px;
  color: #409EFF;
  margin-bottom: 2px;
}
.course-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  min-height: 2.8em;
  color: #666;
  font-size: 14px;
}
.el-button, .overview-item .el-button {
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 18px;
}
@media (max-width: 900px) {
  .home-container {
    max-width: 100%;
    padding: 10px 2vw;
  }
  .stats-grid, .modules-row, .top-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 
