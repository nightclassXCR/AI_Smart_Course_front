<template>
  <div class="teacher-course-detail-container">
    <!-- 顶部信息区 -->
    <div class="header-area">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <div class="header-title">
        <div class="logo">📖</div>

      </div>
    </div>
    <!-- 课程信息编辑区 -->
    <el-card class="info-card">

      <el-form :model="course" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="course.name" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="course.description" type="textarea" />
        </el-form-item>
         <el-form-item label="学分">
          <el-input-number v-model="course.credit" :min="0"></el-input-number>
         </el-form-item>
         <el-form-item label="学时">
          <el-input-number v-model="course.hours" :min="0"></el-input-number>
         </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveCourse">保存课程信息</el-button>
    </el-card>
    <!-- 章节与概念管理区 -->
    <div class="chapter-section">
      <div class="chapter-title">课程章节与知识点</div>
      <el-button type="primary" size="small" @click="addChapter">新增章节</el-button>
      <div v-for="(chapter, cIdx) in chapters" :key="chapter.id" class="chapter-card">
        <div class="chapter-header">
          <el-input v-model="chapter.name" size="small" style="width: 220px;" />
          <el-button type="primary" size="small" @click="moveChapterUp(cIdx)" :disabled="cIdx===0">上移</el-button>
          <el-button type="primary" size="small" @click="moveChapterDown(cIdx)" :disabled="cIdx===chapters.length-1">下移</el-button>
          <el-button type="danger" size="small" @click="removeChapter(cIdx)">删除章节</el-button>
        </div>
        <div class="concept-list">
          <div class="concept-title">知识点：</div>
          <div v-for="(concept, kIdx) in chapter.concepts" :key="kIdx" class="concept-item">
            <el-input v-model="chapter.concepts[kIdx]" size="small" style="width: 180px; margin-right:8px;" />
            <el-button type="danger" size="small" @click="removeConcept(cIdx, kIdx)">删除</el-button>
          </div>
          <el-button type="success" size="small" @click="addConcept(cIdx)">新增知识点</el-button>
        </div>
      </div>
      <el-button type="primary" @click="saveChapters">保存章节与知识点</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getCourseDetail, updateCourse, createCourse } from '@/api/course';
import { ElMessage } from 'element-plus';
const route = useRoute();
const courseId = route.params.id;
const course = reactive({
  name: '',
  teacher: '',
  description: '',
  credit: 0,
  hours: 0
});
const chapters = ref([]);

async function fetchCourseDetail() {
  if (!courseId) {
    course.value = { name: '', teacher: '', description: '', credit: 0, hours: 0 };
    chapters.value = [];
    return;
  }
  try {
    const res = await getCourseDetail(courseId);
    console.log('接口返回:', res.data);
    if (res.data) {
      course.name = res.data.name || '';
      course.teacher = res.data.teacher || '';
      course.description = res.data.description || '';
      course.credit = res.data.credit || 0;
      course.hours = res.data.hours || 0;
      // 如果有章节数据，按实际接口结构赋值
      // chapters.value = res.data.chapters || [];
    } else {
      course.value = {
        name: '',
        teacher: '',
        description: '',
        credit: 0,
        hours: 0
      };
      chapters.value = [];
    }
  } catch (e) {
    console.error('获取课程详情失败', e);
    ElMessage.error('获取课程详情失败');
  }
}

onMounted(fetchCourseDetail);

function addChapter() {
  const newId = chapters.value.length ? Math.max(...chapters.value.map(c => c.id)) + 1 : 1;
  chapters.value.push({ id: newId, name: `新章节${newId}`, concepts: [] });
}
function removeChapter(idx) {
  chapters.value.splice(idx, 1);
}
function addConcept(cIdx) {
  chapters.value[cIdx].concepts.push('新知识点');
}
function removeConcept(cIdx, kIdx) {
  chapters.value[cIdx].concepts.splice(kIdx, 1);
}
function moveChapterUp(idx) {
  if (idx > 0) {
    const temp = chapters.value[idx-1];
    chapters.value[idx-1] = chapters.value[idx];
    chapters.value[idx] = temp;
  }
}
function moveChapterDown(idx) {
  if (idx < chapters.value.length-1) {
    const temp = chapters.value[idx+1];
    chapters.value[idx+1] = chapters.value[idx];
    chapters.value[idx] = temp;
  }
}
async function saveCourse() {
  try {
    if (courseId) {
      await updateCourse({ id: courseId, ...course, chapters: chapters.value });
      ElMessage.success('课程信息已保存');
      fetchCourseDetail();
    } else {
      await createCourse({ ...course, chapters: chapters.value });
      ElMessage.success('课程创建成功');
      // 可选：跳转回课程管理页
    }
  } catch (e) {
    ElMessage.error(courseId ? '保存课程信息失败' : '课程创建失败');
  }
}
async function saveChapters() {
  await saveCourse();
}
</script>

<style scoped>
.teacher-course-detail-container {
  max-width: 900px;
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
.concept-list {
  margin-left: 12px;
  margin-bottom: 8px;
}
.concept-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}
.concept-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
</style> 