<template>
  <el-card class="page-card" style="position:relative;">
    <div class="page-header">
      <el-select v-model="selectedCourse" filterable placeholder="请选择或输入课程名" style="width: 240px; margin-right: 16px" @change="fetchKnowledgeMap">
        <el-option
          v-for="item in courseList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button type="primary" @click="fetchKnowledgeMap">查询</el-button>
      <el-button type="info" @click="goToQuestionnaire" style="margin-left: 12px;">问卷</el-button>
      <el-button type="success" @click="downloadImage" style="margin-left: 12px;">下载图片</el-button>
      <h2 style="margin-left: 24px">知识图谱</h2>
    </div>
    <div class="knowledge-map-content">
      <div id="knowledge-map-container" style="position:relative;" v-loading="loading">
        <div ref="echartsRef" style="width: 100%; height: 900px;"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getKnowledgeMap } from '@/api/knowledge'
import { getMyCourses } from '@/api/course'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { GetQuestionnaire } from '@/api/questionnaire'
import { ElMessage } from 'element-plus'
export default {
  name: 'KnowledgeMap',
  setup() {
    const echartsRef = ref(null)
    const selectedCourse = ref('')
    const courseList = ref([])
    let chartInstance = null
    const loading = ref(false)

    const fetchMyCourses = async () => {
      const res = await getMyCourses()
      console.log('getMyCourses 原始响应:', res)
      console.log('res.data:', res.data)
      courseList.value = (res.data || []).map(item => item.name)
      if (courseList.value.length > 0) {
        selectedCourse.value = courseList.value[0]
      }
      console.log('courseList:', courseList.value)
    }

    onMounted(() => {
      fetchMyCourses()
    })

    function convertToTreeData(data) {
      // 根节点不折叠，章节节点默认折叠
      return {
        name: data.title,
        children: data.chapters.map(chapter => ({
          name: chapter.title,
          collapsed: true, // 初始折叠章节
          children: chapter.children.map(point => ({
            name: point.name,
            value: point.description,
            // 可根据 importance 设置不同颜色
            itemStyle: {
              color: point.importance === 'high'
                ? '#F56C6C'
                : point.importance === 'medium'
                  ? '#E6A23C'
                  : '#67C23A',
            }
          }))
        }))
      }
    }

    const fetchKnowledgeMap = async () => {
      loading.value = true
      try {
        const res = await getKnowledgeMap(selectedCourse.value)
        const courseData = res.data || []
        if (!courseData || !courseData.chapters || courseData.chapters.length === 0) {
          console.warn('courseData 为空或无章节，无法绘制知识图谱')
          return
        }
        const treeData = convertToTreeData(courseData)
        if (chartInstance) {
          chartInstance.dispose()
        }
        chartInstance = echarts.init(echartsRef.value)
        const option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: '#fff',
            borderColor: '#409EFF',
            borderWidth: 1,
            textStyle: { color: '#333', fontSize: 14 },
            padding: 10,
            extraCssText: 'box-shadow: 0 2px 12px rgba(64,158,255,0.15); border-radius: 8px;',
            formatter: function(params) {
              if (params.data.value) {
                return `<b style=\"font-size:15px;\">${params.data.name}</b><br/><span style=\"color:#888\">${params.data.value}</span>`
              }
              return `<b style=\"font-size:15px;\">${params.data.name}</b>`
            }
          },
          series: [
            {
              type: 'tree',
              data: [treeData],
              top: '1%',
              left: '7%',
              bottom: '1%',
              right: '20%',
              symbol: 'circle',
              symbolSize: 14,
              orient: 'LR',
              layout: 'orthogonal',
              nodePadding: 40,
              layerPadding: 120,
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 15,
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: 8,
                padding: [6, 14],
                color: '#333',
                fontWeight: 'bold'
              },
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left',
                  fontSize: 14,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: 8,
                  padding: [5, 10],
                  color: '#666'
                }
              },
              emphasis: {
                focus: 'descendant'
              },
              expandAndCollapse: true,
              animationDuration: 600,
              animationDurationUpdate: 900,
              roam: true
            }
          ]
        }
        chartInstance.setOption(option)
      } catch (e) {
        // 错误处理
      } finally {
        loading.value = false
      }
    }

    // 下载图片方法
    const downloadImage = () => {
      if (!chartInstance) return;
      const url = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedCourse.value + '-知识图谱.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    const router = useRouter()
    const route = useRoute()
    const courseName = route.query.course || ''
    const goToQuestionnaire = () => {
    if (!selectedCourse.value) {
      ElMessage.warning('请先选择课程')
      return
    }
    router.push({ 
      path: '/questionnaire', 
      query: { course: selectedCourse.value } 
    })
  }
    onMounted(async () => {
      if (!courseName) {
        // ElMessage.error('未指定课程名') // This line was removed as per the new_code, as ElMessage is not imported.
        loading.value = false
        return
      }
      try {
        const res = await GetQuestionnaire(courseName)
        // questionnaire.value = res.data // This line was removed as per the new_code, as questionnaire is not defined.
        // questionnaire.value.questions.forEach(q => { // This line was removed as per the new_code, as answers is not defined.
        //   answers.value[q.id] = '' // This line was removed as per the new_code, as answers is not defined.
        // })
        loading.value = false
      } catch (err) {
        // ElMessage.error('问卷加载失败') // This line was removed as per the new_code, as ElMessage is not imported.
        loading.value = false
      }
    })
    return { echartsRef, selectedCourse, courseList, fetchKnowledgeMap, loading, downloadImage, goToQuestionnaire}
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
  position: relative;
}
.page-header {
  display: flex;
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
    max-width: 100%;
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
  