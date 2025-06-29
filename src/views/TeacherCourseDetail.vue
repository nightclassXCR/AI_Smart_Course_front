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
      <el-button type="primary" @click="saveCourse" :disabled="!isCourseValid">保存课程信息</el-button>
    </el-card>
    <!-- 章节与概念管理区 -->
    <div class="chapter-section">
      <div class="chapter-title">课程章节与知识点</div>
      <el-button type="primary" size="small" @click="showAddChapterInput">新增章节</el-button>
      <div v-for="(chapter, cIdx) in chapters" :key="chapter.id" class="chapter-card">
        <div class="chapter-header">
          <el-input v-model="chapter.title" size="small" style="width: 220px;" />
          <el-button type="primary" size="small" @click="moveChapterUp(cIdx)" :disabled="cIdx===0">上移</el-button>
          <el-button type="primary" size="small" @click="moveChapterDown(cIdx)" :disabled="cIdx===chapters.length-1">下移</el-button>
          <el-button type="danger" size="small" @click="handleDeleteChapter(chapter.id)">删除章节</el-button>
        </div>
        <div class="concept-list">
          <div class="concept-title">知识点：</div>
          <div v-for="(concept, kIdx) in conceptsMap[chapter.id] || []" :key="concept.id || kIdx" class="concept-item">
            <el-input v-model="concept.name" size="small" style="width: 180px; margin-right:8px;" @blur="handleUpdateConcept(concept)" />
            <el-button type="danger" size="small" @click="handleDeleteConcept(concept.id)">删除</el-button>
          </div>
          <el-button type="success" size="small" @click="showAddConceptDialog(chapter.id)">新增知识点</el-button>
        </div>
        <div v-if="showNewConceptInput[chapter.id]" style="margin: 8px 0; display: flex; align-items: center;">
          <el-input v-model="newConceptInput[chapter.id]" size="small" style="width: 180px; margin-right:8px;" placeholder="请输入知识点名称" />
          <el-button type="primary" size="small" @click="submitNewConcept(chapter.id)">提交</el-button>
        </div>
      </div>
      <div v-if="showNewChapterInput" style="margin: 8px 0; display: flex; align-items: center;">
        <el-input v-model="newChapterInput" size="small" style="width: 220px; margin-right:8px;" placeholder="请输入章节名称" />
        <el-button type="primary" size="small" @click="submitNewChapter">提交</el-button>
      </div>
    </div>
    <el-dialog v-model="addConceptDialog" title="新增知识点" width="400px">
      <el-form :model="addConceptForm">
        <el-form-item label="名称" required>
          <el-input v-model="addConceptForm.name" placeholder="请输入知识点名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addConceptForm.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="资源ID">
          <el-input v-model="addConceptForm.resourceId" placeholder="请输入资源ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addConceptDialog = false">取消</el-button>
        <el-button type="primary" :loading="addConceptLoading" @click="submitAddConcept">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getCourseDetail, updateCourse, createCourse, getCourseChapters, getGroupedConcepts } from '@/api/course';
import { ElMessage } from 'element-plus';
import { addConcept, updateConcept, deleteConcept, deleteChapter, addChapter } from '@/api/chapter';
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
const conceptsMap = ref({});
const newConceptInput = ref({});
const showNewConceptInput = ref({});
const newChapterInput = ref('');
const showNewChapterInput = ref(false);
const addConceptDialog = ref(false);
const addConceptForm = ref({ chapterId: null, name: '', description: '', resourceId: '' });
const addConceptLoading = ref(false);

const isCourseValid = computed(() => {
  return !!course.name && !!course.description && !!course.credit && !!course.hours;
});

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

async function fetchChaptersAndConcepts() {
  if (!courseId) return;
  try {
    const res1 = await getCourseChapters(courseId);
    chapters.value = (res1.data || []).map(chapter => ({
      ...chapter,
      concepts: Array.isArray(chapter.concepts) ? chapter.concepts : []
    }));
    const res2 = await getGroupedConcepts(courseId);
    conceptsMap.value = res2.data || {};
  } catch (e) {
    ElMessage.error('获取章节或知识点失败');
  }
}

onMounted(() => {
  fetchCourseDetail();
  fetchChaptersAndConcepts();
});

async function handleAddChapter() {
  if (!courseId) {
    ElMessage.error('请先保存课程信息');
    return;
  }
  try {
    await addChapterByCourse(courseId, `新章节${chapters.value.length + 1}`);
    ElMessage.success('新增章节成功');
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('新增章节失败');
  }
}

function removeChapter(idx) {
  chapters.value.splice(idx, 1);
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

function showAddConceptInput(chapterId) {
  showNewConceptInput.value[chapterId] = true;
  newConceptInput.value[chapterId] = '';
}

async function submitNewConcept(chapterId) {
  const name = newConceptInput.value[chapterId]?.trim();
  if (!name) {
    ElMessage.warning('知识点名称不能为空');
    return;
  }
  const payload = { chapterId: chapterId, name }; // 构造请求体
  console.log('前端实际发送的新增知识点请求体:', payload); // 打印请求体
  try {
    await addConcept({ chapterId, name });
    ElMessage.success('新增知识点成功');
    showNewConceptInput.value[chapterId] = false;
    newConceptInput.value[chapterId] = '';
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('新增知识点失败');
  }
}

// 更新知识点
async function handleUpdateConcept(concept) {
  try {
    await updateConcept(concept);
    ElMessage.success('知识点已更新');
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('知识点更新失败');
  }
}

// 删除知识点
async function handleDeleteConcept(conceptId) {
  try {
    await deleteConcept(conceptId);
    ElMessage.success('删除知识点成功');
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('删除知识点失败');
  }
}

async function handleDeleteChapter(chapterId) {
  try {
    await deleteChapter(chapterId);
    ElMessage.success('删除章节成功');
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('删除章节失败');
  }
}

function showAddChapterInput() {
  showNewChapterInput.value = true;
  newChapterInput.value = '';
}

async function submitNewChapter() {
  const title = newChapterInput.value.trim();
  if (!title) {
    ElMessage.warning('章节标题不能为空');
    return;
  }
  try {
    await addChapter({ title, courseId });
    ElMessage.success('新增章节成功');
    showNewChapterInput.value = false;
    newChapterInput.value = '';
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('新增章节失败');
  }
}

function showAddConceptDialog(chapterId) {
  addConceptForm.value = { chapterId, name: '', description: '', resourceId: '' };
  addConceptDialog.value = true;
}

async function submitAddConcept() {
  if (!addConceptForm.value.name.trim()) {
    ElMessage.warning('知识点名称不能为空');
    return;
  }
  addConceptLoading.value = true;
  try {
    await addConcept({
      chapterId: addConceptForm.value.chapterId,
      name: addConceptForm.value.name,
      description: addConceptForm.value.description,
      resourceId: addConceptForm.value.resourceId
    });
    ElMessage.success('新增知识点成功');
    addConceptDialog.value = false;
    await fetchChaptersAndConcepts();
  } catch (e) {
    ElMessage.error('新增知识点失败');
  } finally {
    addConceptLoading.value = false;
  }
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