<template>
  <div class="course-intro-container">
    <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📚</div>
        <div>
          <h1>{{ course.name }}</h1>
          <p class="subtitle">授课教师：{{ course.teacher }}</p>
        </div>
      </div>
      <el-button type="primary" @click="enrollCourseHandler">选课</el-button>
    </div>
    <el-card class="info-card">
      <div class="info-row"><span>课程简介：</span>{{ course.desc }}</div>
    </el-card>
    <div class="chapter-section">
      <div class="chapter-title">课程章节与知识点</div>
      <div v-for="chapter in chapters" :key="chapter.id" class="chapter-card">
        <div class="chapter-header">
          <span class="chapter-name">{{ chapter.name }}</span>
        </div>
        <div class="concept-list">
          <span v-for="concept in chapter.concepts" :key="concept" class="concept-item">
            <i class="el-icon-collection"></i> {{ concept }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCourseIntro, enrollCourse } from '@/api/course';
import { ElMessage } from 'element-plus';

const route = useRoute();
const courseId = route.params.id;
const course = ref({ name: '', teacher: '', desc: '' });
const chapters = ref([]);

async function fetchCourseIntro() {
  try {
    const res = await getCourseIntro(courseId);
    course.value = res.data.course || {};
    chapters.value = res.data.chapters || [];
  } catch (e) {
    ElMessage.error('获取课程信息失败');
  }
}

async function enrollCourseHandler() {
  try {
    await enrollCourse(courseId);
    ElMessage.success('选课成功');
    fetchCourseIntro(); // 选课后可刷新数据
  } catch (e) {
    ElMessage.error('选课失败');
  }
}

onMounted(fetchCourseIntro);
</script>

<style scoped>
.course-intro-container {
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
  justify-content: space-between;
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
  align-items: center;
  margin-bottom: 6px;
}
.chapter-name {
  font-weight: 500;
  font-size: 15px;
}
.concept-list {
  margin-left: 12px;
  margin-bottom: 8px;
}
.concept-item {
  display: inline-block;
  background: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  font-size: 14px;
  margin-right: 8px;
  margin-bottom: 4px;
}
</style> 