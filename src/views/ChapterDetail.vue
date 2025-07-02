<template>
  <div class="chapter-detail-container">
    <div class="chapter-header">
      <el-button
        type="primary"
        plain
        round
        icon="el-icon-arrow-left"
        @click="router.back()"
        class="back-btn"
      >
        返回
      </el-button>
      <h2>{{ chapter.title }}</h2>
    </div>
    <el-card class="info-card">
      <div class="info-row"><span>章节简介：</span>{{ chapter.content || '暂无简介' }}</div>
    </el-card>
    <el-card class="concept-card">
      <h3>概念列表</h3>
      <div v-if="concepts.length" class="concept-list">
        <el-tag 
          v-for="concept in concepts" 
          :key="concept.id" 
          class="concept-tag" 
          :type="currentConceptId === concept.id ? 'primary' : 'info'"
          @click="showConceptDetail(concept.id); handleConceptClick(concept.id)"
          style="cursor: pointer;"
        >
          <i class="el-icon-collection"></i> {{ concept.name }}
        </el-tag>
      </div>
      <div v-else class="empty-state">暂无概念</div>
    </el-card>
    <el-card class="resource-card">
      <h3>包含的资源</h3>
      <el-table
        v-if="resources.length"
        :data="resources"
        style="width: 100%; margin-top: 10px; border-radius: 10px;"
        :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}"
      >
        <el-table-column prop="name" label="资源名称" />
        <el-table-column prop="fileType" label="类型">
          <template #default="scope">
            {{ resourceTypeMap[scope.row.fileType] }}
          </template>
        </el-table-column>
        <el-table-column prop="ownerType" label="所属类型">
          <template #default="scope">
            {{ resourceOwnerTypeMap[scope.row.ownerType] }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="上传时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.fileType === 'video'"
              size="small"
              @click="previewVideo(scope.row)"
            >预览</el-button>
            <el-button size="small" @click="downloadResource(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="empty-state">暂无资源</div>
    </el-card>
    <el-dialog v-model="showVideoDialog" title="视频预览" width="600px">
      <video
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        controls
        style="width: 100%; max-height: 400px;"
      ></video>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapterDetail, getConceptsByChapter, getResourcesByChapter, getConceptDetail } from '@/api/chapter'
import { viewConcept } from '@/api/concept'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const chapterId = route.params.id
const chapter = ref({})
const concepts = ref([])
const resources = ref([])

// 记录页面进入时间
const pageEnterTime = ref(Date.now())
// 记录当前查看的概念ID
const currentConceptId = ref(null)

const resourceTypeMap = {
  video: '视频',
  document: '文档',
  image: '图片',
  ppt: 'ppt',
  doc: 'doc',
  pdf: 'pdf'
}
const resourceOwnerTypeMap = {
  task: '任务',
  question: '问题',
  concept: '概念'
}

const showVideoDialog = ref(false)
const currentVideoUrl = ref('')

// 处理概念点击 - 记录开始查看某个概念
const handleConceptClick = async (conceptId) => {
  // 如果之前有查看其他概念，先记录之前概念的学习时长
  if (currentConceptId.value && currentConceptId.value !== conceptId) {
    await recordConceptDuration(currentConceptId.value)
  }
  
  // 更新当前查看的概念
  currentConceptId.value = conceptId
  pageEnterTime.value = Date.now()
  
  console.log(`开始查看概念: ${conceptId}`)
}

// 记录概念学习时长
const recordConceptDuration = async (conceptId) => {
  const now = Date.now()
  const durationSeconds = Math.floor((now - pageEnterTime.value) / 1000)
  
  // 如果学习时长超过1秒才记录
  if (durationSeconds > 1) {
    try {
      await viewConcept(conceptId, durationSeconds)
      console.log(`记录概念 ${conceptId} 学习时长: ${durationSeconds}秒`)
    } catch (error) {
      console.error('记录学习时长失败:', error)
    }
  }
}

// 页面卸载时记录最后一个概念的学习时长
onUnmounted(async () => {
  if (currentConceptId.value) {
    await recordConceptDuration(currentConceptId.value)
  }
})

function downloadResource(row) {
  if (row.fileUrl) {
    const a = document.createElement('a');
    a.href = row.fileUrl;
    a.download = row.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function previewVideo(row) {
  currentVideoUrl.value = row.fileUrl
  showVideoDialog.value = true
}

onMounted(async () => {
  // 获取章节详情
  const chapterRes = await getChapterDetail(chapterId)
  chapter.value.content = chapterRes.data?.content || chapterRes.data?.description || '暂无简介'

  // 获取该章节下的所有概念
  const conceptRes = await getConceptsByChapter(chapterId)
  concepts.value = conceptRes.data || []

  // 获取该章节下的所有资源
  const resourceRes = await getResourcesByChapter(chapterId)
  resources.value = resourceRes.data || []
})

// 新增方法
async function showConceptDetail(conceptId) {
  conceptDetailLoading.value = true
  conceptDetailDialog.value = true
  try {
    const res = await getConceptDetail(conceptId)
    conceptDetail.value = res.data || {}
  } catch (e) {
    ElMessage.error('获取概念详情失败')
    conceptDetail.value = {}
  } finally {
    conceptDetailLoading.value = false
  }
}
</script>

<style scoped>
.chapter-detail-container {
  max-width: 700px;
  margin: 36px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
}
.chapter-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.info-card, .concept-card, .resource-card {
  margin-bottom: 18px;
  border-radius: 10px;
}
.info-row {
  font-size: 15px;
  color: #333;
}
.info-row span {
  color: #409EFF;
  margin-right: 8px;
}
.concept-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}
.concept-tag {
  font-size: 15px;
  padding: 6px 16px;
  border-radius: 16px;
  background: #f0f9ff;
  color: #409EFF;
  border: none;
}
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.resource-link {
  font-size: 15px;
  color: #337ecc;
  display: flex;
  align-items: center;
  gap: 6px;
}
.empty-state {
  color: #aaa;
  margin: 12px 0;
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
.concept-detail-content {
  font-size: 16px;
  color: #333;
  padding: 8px 0;
}
.detail-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}
.detail-label {
  min-width: 80px;
  color: #409EFF;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.detail-label i {
  margin-right: 4px;
}
.detail-value {
  flex: 1;
  color: #222;
  word-break: break-all;
}
</style> 