<template>
  <div class="course-detail-container">
    <!-- 顶部信息区 -->
    <div class="header-area">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <div class="header-title">
        <div class="logo">📖</div>
        <div>
          <h1>{{ course.name || '课程名称' }}</h1>
          <p class="subtitle">授课教师：{{ course.teacherName || course.teacher || '未知' }}</p>
        </div>
        <el-button v-if="!course.selected" type="primary" @click="enrollCourseHandler">选课</el-button>
      </div>
    </div>
    <!-- 课程简介卡片 -->
    <div class="info-card">
      <div class="info-row"><span>课程简介：</span>{{ course.desc || course.description || '暂无简介' }}</div>
    </div>
    <!-- 章节与知识点区 -->
    <div class="chapter-section">
      <div class="chapter-title">课程章节与知识点</div>
      <div v-if="chapters.length">
        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-card">
          <div class="chapter-header">
            <span class="chapter-name">{{ chapter.name }}</span>
          </div>
          <div class="concept-list">
            <span v-for="concept in groupedConcepts[chapter.id] || []" :key="concept.id" class="concept-item">
              <i class="el-icon-collection"></i> {{ concept.name }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">暂无章节</div>
    </div>
    <!-- 智能问答区 -->
    <div class="qa-card">
      <div class="qa-header">
        <span class="qa-title">智能问答</span>
        <span class="qa-desc">有疑问？试试向AI提问吧！</span>
      </div>
      <div class="qa-list">
        <div v-for="(item, idx) in qaList" :key="idx" class="qa-item" :class="item.role">
          <div class="qa-bubble">
            <span v-if="item.role==='user'">🙋‍♂️</span>
            <span v-else>🤖</span>
            <span class="qa-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
      <div class="qa-input-row">
        <input v-model="question" @keyup.enter="askAI" placeholder="请输入你的问题..." />
        <el-button type="primary" @click="askAI">提问</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCourseDetail, getCourseChapters, enrollCourse, getGroupedConcepts } from '@/api/course';
import { ElMessage } from 'element-plus';

const route = useRoute();
const courseId = route.params.id;
const course = ref({});
const chapters = ref([]);
const groupedConcepts = ref({});

async function fetchCourseDetail() {
  try {
    // 获取课程详情
    const res = await getCourseDetail(courseId);
    course.value = res.data || {};
    // 获取章节
    const chapterRes = await getCourseChapters(courseId);
    chapters.value = chapterRes.data || [];
    // 获取按章节分组的知识点
    const conceptRes = await getGroupedConcepts(courseId);
    groupedConcepts.value = conceptRes.data || {};
    // 调试打印
    console.log('groupedConcepts:', groupedConcepts.value);
    console.log('chapters:', chapters.value);
  } catch (e) {
    ElMessage.error('获取课程详情失败');
  }
}

async function enrollCourseHandler() {
  try {
    await enrollCourse(course.value.id);
    ElMessage.success('选课成功');
    fetchCourseDetail();
  } catch (e) {
    ElMessage.error('选课失败');
  }
}

onMounted(fetchCourseDetail);

// 智能问答
const qaList = ref([
  { role: 'ai', text: '欢迎提问，我会尽力为你解答课程相关问题！' }
]);
const question = ref('');
function askAI() {
  if (!question.value.trim()) return;
  qaList.value.push({ role: 'user', text: question.value });
  const userQ = question.value;
  question.value = '';
  setTimeout(() => {
    // 模拟AI回复
    qaList.value.push({ role: 'ai', text: `AI正在思考："${userQ}"...（此处可对接真实AI接口）` });
  }, 800);
}
</script>

<style scoped>
.course-detail-container {
  max-width: 800px;
  margin: 36px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
}
.header-area {
  display: flex;
  align-items: center;
  gap: 18px;
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
.info-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info-row {
  font-size: 15px;
  color: #333;
}
.info-row span {
  color: #888;
  margin-right: 8px;
}
.chapter-section {
  margin-bottom: 22px;
}
.chapter-title {
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
  color: #409EFF;
}
.chapter-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 14px 18px 10px 18px;
  margin-bottom: 12px;
}
.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.chapter-name {
  font-weight: 500;
  font-size: 15px;
}
.chapter-progress {
  color: #67c23a;
  font-size: 13px;
}
.concept-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 2px;
}
.concept-item {
  background: #fff;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 14px;
  color: #222;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  gap: 4px;
}
.qa-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px 14px 20px;
  margin-top: 18px;
}
.qa-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 10px;
}
.qa-title {
  font-weight: bold;
  font-size: 16px;
}
.qa-desc {
  color: #888;
  font-size: 13px;
}
.qa-list {
  min-height: 60px;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.qa-item.user .qa-bubble {
  background: #eaf6ff;
  color: #222;
  align-self: flex-end;
}
.qa-item.ai .qa-bubble {
  background: #fff;
  color: #222;
  align-self: flex-start;
}
.qa-bubble {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 16px;
  padding: 8px 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  font-size: 15px;
  max-width: 90%;
}
.qa-input-row {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.qa-input-row input {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 16px;
  padding: 8px 14px;
  font-size: 15px;
  outline: none;
}
@media (max-width: 600px) {
  .course-detail-container {
    max-width: 100vw;
    padding: 10px 2vw;
  }
}
</style> 