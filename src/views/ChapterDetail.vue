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
        <el-tag v-for="concept in concepts" :key="concept.id" class="concept-tag" type="info">
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapterDetail, getConceptsByChapter, getResourcesByChapter } from '@/api/chapter'

const route = useRoute()
const router = useRouter()
const chapterId = route.params.id
const chapter = ref({})
const concepts = ref([])
const resources = ref([])

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