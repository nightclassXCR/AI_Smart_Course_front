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
      <el-button type="success" @click="downloadImage" style="margin-left: 12px;">下载图片</el-button>
      <h2 style="margin-left: 24px">知识图谱</h2>
    </div>
    <div class="knowledge-map-content">
      <div id="knowledge-map-container" style="position:relative;" v-loading="loading">
        <div ref="echartsRef" style="width: 100%; height: 600px;"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getKnowledgeMap } from '@/api/knowledge'
import { getMyCourses } from '@/api/course'

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
      return {
        name: data.title,
        itemStyle: { color: '#409EFF', borderColor: '#2d8cf0', borderWidth: 2 },
        label: {
          backgroundColor: '#e6f7ff',
          borderRadius: 16,
          padding: [12, 28],
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
          shadowColor: '#b3e5fc',
          shadowBlur: 6
        },
        children: data.chapters.map(chapter => ({
          name: chapter.title,
          itemStyle: { color: '#67C23A', borderColor: '#67C23A', borderWidth: 2 },
          label: {
            backgroundColor: '#e6f7ff',
            borderRadius: 16,
            padding: [12, 28],
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
            shadowColor: '#b3e5fc',
            shadowBlur: 6
          },
          children: chapter.children.map(point => ({
            name: point.name,
            value: point.description,
            itemStyle: {
              color: point.importance === 'high'
                ? '#F56C6C'
                : point.importance === 'medium'
                  ? '#E6A23C'
                  : '#909399',
              borderColor: point.importance === 'high'
                ? '#C0392B'
                : point.importance === 'medium'
                  ? '#B26A00'
                  : '#606266',
              borderWidth: 2,
              shadowColor: point.importance === 'high'
                ? '#F56C6C'
                : point.importance === 'medium'
                  ? '#E6A23C'
                  : '#909399',
              shadowBlur: 15
            },
            label: {
              backgroundColor:
                point.importance === 'high'
                  ? '#ffeaea'      // 红色系
                  : point.importance === 'medium'
                    ? '#fffbe6'    // 黄色系
                    : '#e6f7ff',   // 蓝色系
              borderRadius: 16,
              padding: [12, 28],
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333',
              shadowColor:
                point.importance === 'high'
                  ? '#ffd6d6'
                  : point.importance === 'medium'
                    ? '#fff2b3'
                    : '#b3e5fc',
              shadowBlur: 6
            }
          }))
        }))
      }
    }

    const fetchKnowledgeMap = async () => {
      loading.value = true
      try {
        const res = await getKnowledgeMap(selectedCourse.value)
        console.log('后端返回数据:', res)
        console.log('后端返回数据:', res.data.data)
        const courseData = res.data
        console.log('后端返回数据:', courseData)
        const treeData = convertToTreeData(courseData)
        console.log('ECharts treeData:', treeData)
        if (!chartInstance) {
          chartInstance = echarts.init(echartsRef.value)
        }
        const option = {
          backgroundColor: '#f8f8fa',
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: '#fff',
            borderColor: '#409EFF',
            borderWidth: 1,
            textStyle: { color: '#333', fontSize: 15 },
            padding: 12,
            extraCssText: 'box-shadow: 0 2px 12px rgba(64,158,255,0.15); border-radius: 8px;',
            formatter: function(params) {
              if (params.data.value) {
                return `<b style="font-size:16px;">${params.data.name}</b><br/><span style="color:#888">${params.data.value}</span>`
              }
              return `<b style="font-size:16px;">${params.data.name}</b>`
            }
          },
          series: [
            {
              type: 'tree',
              data: [treeData],
              top: '8%',
              left: '15%',
              bottom: '8%',
              right: '20%',
              symbol: 'roundRect',
              symbolSize: 32,
              edgeShape: 'polyline',
              edgeForkPosition: '63%',
              initialTreeDepth: 1,
              lineStyle: {
                color: '#b3b3b3',
                width: 3,
                curveness: 0.25,
                type: 'dashed'
              },
              itemStyle: {
                shadowColor: 'rgba(64,158,255,0.18)',
                shadowBlur: 10,
                borderRadius: 8
              },
              label: {
                backgroundColor: '#e6f7ff',
                borderRadius: 16,
                padding: [12, 28],
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
                shadowColor: '#b3e5fc',
                shadowBlur: 6
              },
              leaves: {
                label: {
                  backgroundColor: '#fffbe6',
                  borderRadius: 14,
                  padding: [10, 22],
                  fontSize: 18,
                  color: '#666'
                }
              },
              expandAndCollapse: true,
              animationDuration: 800,
              animationDurationUpdate: 1000
            }
          ]
        }
        chartInstance.setOption(option)
      } catch (e) {
        // 可选：弹窗提示
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

    return { echartsRef, selectedCourse, courseList, fetchKnowledgeMap, loading, downloadImage }
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
  