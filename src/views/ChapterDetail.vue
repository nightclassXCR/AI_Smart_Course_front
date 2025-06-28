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
          @click="handleConceptClick(concept.id)"
          style="cursor: pointer;"
        >
          <i class="el-icon-collection"></i> {{ concept.name }}
        </el-tag>
      </div>
      <div v-else class="empty-state">暂无概念</div>
    </el-card>
    <el-card class="resource-card">
      <h3>包含的资源</h3>
      <div v-if="resources.length" class="resource-list">
        <el-link v-for="resource in resources" :key="resource.id" :href="resource.url || '#'" target="_blank" class="resource-link">
          <i class="el-icon-link"></i> {{ resource.title }}
        </el-link>
      </div>
      <div v-else class="empty-state">暂无资源</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapterDetail, getConceptsByChapter, getResourcesByChapter } from '@/api/chapter'
import { viewConcept } from '@/api/concept'

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

onMounted(async () => {
  // 获取章节详情
  const chapterRes = await getChapterDetail(chapterId)
  chapter.value = chapterRes.data || {}

  // 获取该章节下的所有概念
  const conceptRes = await getConceptsByChapter(chapterId)
  concepts.value = conceptRes.data || []

  // 获取该章节下的所有资源
  const resourceRes = await getResourcesByChapter(chapterId)
  resources.value = resourceRes.data || []
})
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
</style> 