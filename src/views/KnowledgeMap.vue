<template>
  <el-card class="page-card">
    <div class="page-header">
      <h2>知识图谱</h2>
    </div>
    <div class="knowledge-map-content">
      <!-- 原有知识图谱核心展示区 -->
      <div id="knowledge-map-container">
        <!-- 这里插入原有知识图谱可视化内容 -->
        <slot />
      </div>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'KnowledgeMap',
  data() {
    return {
      subjects: [],
      selectedSubject: '',
      currentSubjectName: '',
      concepts: [],
      connections: [],
      selectedConcept: null,
      zoomLevel: 1,
      learningStats: {
        total: 0,
        completed: 0,
        learning: 0,
        available: 0,
        locked: 0
      },
      aiSuggestions: [],
      loading: false
    }
  },
  computed: {
    completionPercentage() {
      if (this.learningStats.total === 0) return 0
      return (this.learningStats.completed / this.learningStats.total) * 100
    }
  },
  async created() {
    await this.loadSubjects()
    if (this.subjects.length > 0) {
      this.selectedSubject = this.subjects[0].id
      await this.loadKnowledgeMap()
    }
  },
  methods: {
    async loadSubjects() {
      try {
        const response = await axios.get('/api/courses/subjects')
        this.subjects = response.data
      } catch (error) {
        console.error('加载学科列表失败:', error)
        this.$message.error('加载学科列表失败')
      }
    },

    async loadKnowledgeMap() {
      if (!this.selectedSubject) return
      
      this.loading = true
      try {
        const [conceptsResponse, statsResponse, suggestionsResponse] = await Promise.all([
          axios.get(`/api/knowledge-map/concepts/${this.selectedSubject}`),
          axios.get(`/api/knowledge-map/stats/${this.selectedSubject}`),
          axios.get(`/api/recommendations`, { params: { type: 'concept', limit: 3 } })
        ])

        this.concepts = this.processConceptsData(conceptsResponse.data.concepts)
        this.connections = this.processConnectionsData(conceptsResponse.data.connections)
        this.learningStats = statsResponse.data
        this.aiSuggestions = suggestionsResponse.data

        // 设置当前学科名称
        const currentSubject = this.subjects.find(s => s.id == this.selectedSubject)
        this.currentSubjectName = currentSubject ? currentSubject.name : ''

      } catch (error) {
        console.error('加载知识图谱失败:', error)
        this.$message.error('加载知识图谱失败')
      } finally {
        this.loading = false
      }
    },

    processConceptsData(concepts) {
      // 计算知识点在画布上的位置
      const canvasWidth = 800
      const canvasHeight = 600
      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2
      const radius = 200

      return concepts.map((concept, index) => {
        const angle = (index / concepts.length) * 2 * Math.PI
        const x = centerX + Math.cos(angle) * radius - 75 // 75是节点宽度的一半
        const y = centerY + Math.sin(angle) * radius - 50 // 50是节点高度的一半

        return {
          ...concept,
          x: Math.max(0, Math.min(x, canvasWidth - 150)),
          y: Math.max(0, Math.min(y, canvasHeight - 100)),
          masteryPercentage: Math.round((concept.mastery_level || 0) * 100),
          masteryLevel: this.getMasteryLevel(concept.mastery_level || 0)
        }
      })
    },

    processConnectionsData(connections) {
      return connections.map(conn => {
        const fromConcept = this.concepts.find(c => c.id === conn.from_concept_id)
        const toConcept = this.concepts.find(c => c.id === conn.to_concept_id)
        
        if (!fromConcept || !toConcept) return null

        return {
          from: conn.from_concept_id,
          to: conn.to_concept_id,
          x1: fromConcept.x + 75,
          y1: fromConcept.y + 50,
          x2: toConcept.x + 75,
          y2: toConcept.y + 50,
          weight: conn.weight || 1
        }
      }).filter(Boolean)
    },

    getMasteryLevel(masteryValue) {
      if (masteryValue >= 0.8) return 'high'
      if (masteryValue >= 0.5) return 'medium'
      if (masteryValue >= 0.2) return 'low'
      return 'none'
    },

    selectConcept(concept) {
      this.selectedConcept = concept
    },

    handleCanvasClick() {
      this.selectedConcept = null
    },

    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2)
    },

    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5)
    },

    resetZoom() {
      this.zoomLevel = 1
    },

    getConceptIcon(importance) {
      const iconMap = {
        'high': 'icon-star',
        'medium': 'icon-circle',
        'low': 'icon-dot'
      }
      return iconMap[importance] || 'icon-circle'
    },

    getImportanceText(importance) {
      const textMap = {
        'high': '重要',
        'medium': '一般',
        'low': '了解'
      }
      return textMap[importance] || '一般'
    },

    getSuggestionIcon(type) {
      const iconMap = {
        'next': 'icon-arrow-right',
        'review': 'icon-refresh',
        'practice': 'icon-edit'
      }
      return iconMap[type] || 'icon-lightbulb'
    },

    getSuggestionTypeText(type) {
      const textMap = {
        'next': '下一步学习',
        'review': '复习巩固',
        'practice': '强化练习'
      }
      return textMap[type] || '学习建议'
    },

    getSuggestionActionText(type) {
      const textMap = {
        'next': '开始学习',
        'review': '立即复习',
        'practice': '开始练习'
      }
      return textMap[type] || '立即行动'
    },

    isConnectionHighlighted(connection) {
      if (!this.selectedConcept) return false
      return connection.from === this.selectedConcept.id || connection.to === this.selectedConcept.id
    },

    async startLearning(conceptId) {
      try {
        // 记录学习行为
        await axios.post('/api/learning-logs', {
          target_type: 'concept',
          target_id: conceptId,
          action_type: 'click'
        })
        
        // 跳转到学习页面
        this.$router.push(`/learn/concept/${conceptId}`)
      } catch (error) {
        console.error('开始学习失败:', error)
      }
    },

    async viewResources(conceptId) {
      this.$router.push(`/resources/concept/${conceptId}`)
    },

    async applySuggestion(suggestion) {
      if (suggestion.type === 'next') {
        await this.startLearning(suggestion.recommend_id)
      } else if (suggestion.type === 'review') {
        this.$router.push(`/review/concept/${suggestion.recommend_id}`)
      } else if (suggestion.type === 'practice') {
        this.$router.push(`/practice/concept/${suggestion.recommend_id}`)
      }

      // 标记建议为已查看
      try {
        await axios.patch(`/api/recommendations/${suggestion.id}`, { viewed: true })
      } catch (error) {
        console.error('更新建议状态失败:', error)
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      return date.toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.page-card {
  max-width: 1100px;
  width: 100%;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.knowledge-map-content {
  min-height: 500px;
  padding: 20px 0;
  overflow-x: auto;
}
#knowledge-map-container {
  width: 100%;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 20px;
}
@media (max-width: 600px) {
  .page-card {
    max-width: 100vw;
    margin: 10px 0;
    padding: 10px 2vw;
  }
  .page-header h2 {
    font-size: 1.1rem;
  }
  #knowledge-map-container {
    padding: 8px;
  }
}
</style>
  