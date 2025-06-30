<template>
  <div class="course-detail-container">
    <!-- 顶部信息区 -->
    <div class="header-area">
      <el-button
        type="primary"
        plain
        round
        icon="el-icon-arrow-left"
        @click="$router.back()"
        class="back-btn"
      >
        返回
      </el-button>
      <div class="header-title">
        <div class="logo">📖</div>
        <div>
          <h1>{{ course.name || '课程名称' }}</h1>
          <p class="subtitle">授课教师：{{ course.teacherRealName || course.teacherName || course.teacher || '未知' }}</p>
        </div>
        <el-button v-if="!(course.statusStudent === 'underway' || course.selected)" type="primary" @click="enrollCourseHandler">选课</el-button>
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
        <el-card
          v-for="chapter in chapters"
          :key="chapter.id"
          class="chapter-block"
          shadow="hover"
          @click="goToChapterDetail(chapter.id)"
          style="cursor:pointer"
        >
          <div class="chapter-header">
            <i class="el-icon-notebook-2 chapter-icon"></i>
            <span class="chapter-name">{{ chapter.title }}</span>
          </div>
          <div class="concept-list">
            <el-tag
              v-for="concept in groupedConcepts[chapter.id] || []"
              :key="concept.id"
              class="concept-tag"
              :type="getTagType(concept.importance)"
              @click="showConceptDetail(concept.id)"
              style="cursor:pointer;"
            >
              <i class="el-icon-collection"></i> {{ concept.name }}
            </el-tag>
            <span v-if="!(groupedConcepts[chapter.id] && groupedConcepts[chapter.id].length)" class="no-concept">暂无知识点</span>
          </div>
        </el-card>
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
    <!-- 知识点详情弹窗 -->
    <el-dialog v-model="conceptDetailDialog" title="知识点详情" width="400px">
      <div v-if="conceptDetailLoading" style="text-align:center;">
        <el-icon><Loading /></el-icon>
      </div>
      <div v-else>
        <div><b>名称：</b>{{ conceptDetail.name }}</div>
        <div><b>描述：</b>{{ conceptDetail.description || '暂无描述' }}</div>
        <div><b>资源ID：</b>{{ conceptDetail.resourceId || '无' }}</div>
      </div>
      <template #footer>
        <el-button @click="conceptDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourseDetail, getCourseChapters, enrollCourse, getGroupedConcepts } from '@/api/course';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;
const course = ref({});
const chapters = ref([]);
const groupedConcepts = ref({});

async function fetchCourseDetail() {
  try {
    console.log('开始获取课程详情，课程ID:', courseId);
    
    // 获取课程详情
    try {
      const res = await getCourseDetail(courseId);
      console.log('课程详情API响应:', res);
      course.value = res.data || res || {};
    } catch (e) {
      console.error('获取课程详情失败:', e);
      ElMessage.error('获取课程详情失败');
      return;
    }
    
    // 获取章节
    try {
      const chapterRes = await getCourseChapters(courseId);
      console.log('章节API响应:', chapterRes);
      chapters.value = chapterRes.data || chapterRes || [];
    } catch (e) {
      console.error('获取章节失败:', e);
      ElMessage.error('获取章节信息失败');
      return;
    }
    
    // 获取按章节分组的知识点
    try {
      const conceptRes = await getGroupedConcepts(courseId);
      console.log('分组概念API响应:', conceptRes);
      groupedConcepts.value = conceptRes.data || conceptRes || {};
    } catch (e) {
      console.error('获取知识点失败:', e);
      ElMessage.error('获取知识点信息失败');
      return;
    }
    
    // 调试打印每个章节下的概念
    Object.keys(groupedConcepts.value).forEach(key => {
      console.log(`章节ID: ${key}，概念数据:`, groupedConcepts.value[key]);
    });
    console.log('groupedConcepts:', groupedConcepts.value);
    console.log('chapters:', chapters.value);
    console.log('所有数据获取完成');
  } catch (e) {
    console.error('获取课程详情失败，详细错误:', e);
    console.error('错误响应:', e.response);
    console.error('错误状态:', e.response?.status);
    console.error('错误数据:', e.response?.data);
    
    // 根据具体错误类型给出更精确的错误提示
    if (e.response?.status === 404) {
      ElMessage.error('课程不存在');
    } else if (e.response?.status === 401) {
      ElMessage.error('请先登录');
    } else if (e.response?.status >= 500) {
      ElMessage.error('服务器错误，请稍后重试');
    } else {
      ElMessage.error('获取课程详情失败');
    }
  }
}

async function enrollCourseHandler() {
  try {
    await ElMessageBox.confirm(
      '确定要选修该课程吗？',
      '选课确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    await enrollCourse(course.value.id);
    ElMessage.success('选课成功');
    fetchCourseDetail();
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('选课失败');
    }
    // 用户取消时不提示错误
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

function goToChapterDetail(id) {
  router.push(`/student/chapter/${id}`);
}

function getTagType(importance) {
  if (importance === 'high') return 'danger';   // 红色
  if (importance === 'medium') return 'warning'; // 橙色
  if (importance === 'low') return 'success';   // 绿色
  return 'info'; // 默认蓝色
}

async function showConceptDetail(conceptId) {
  conceptDetailLoading.value = true;
  conceptDetailDialog.value = true;
  try {
    const res = await getConceptDetail(conceptId);
    conceptDetail.value = res.data || {};
  } catch (e) {
    ElMessage.error('获取知识点详情失败');
    conceptDetail.value = {};
  } finally {
    conceptDetailLoading.value = false;
  }
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
.chapter-block {
  margin-bottom: 18px;
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(64,158,255,0.06);
  padding: 18px 20px 14px 20px;
}
.chapter-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
  gap: 8px;
}
.chapter-icon {
  font-size: 22px;
}
.chapter-name {
  font-weight: 500;
  font-size: 15px;
}
.concept-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 24px;
}
.concept-tag {
  font-size: 15px;
  padding: 6px 16px;
  border-radius: 16px;
  background: #f0f9ff;
  color: #409EFF;
  border: none;
}
.no-concept {
  color: #aaa;
  margin-left: 24px;
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
.back-btn {
  margin-bottom: 18px;
  font-size: 15px;
  padding: 6px 18px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.back-btn:hover {
  background: #409EFF;
  color: #fff;
  box-shadow: 0 4px 16px rgba(64,158,255,0.15);
}
</style> 