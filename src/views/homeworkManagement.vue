<template>
  <div class="homework-mgmt-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo"><i class="el-icon-tickets"></i></div>
        <div>
          <h1>作业管理</h1>
          <p class="subtitle">管理所有课程作业，支持新增、编辑、删除</p>
        </div>
      </div>
      <el-button type="primary" @click="showAdd = true">新增作业</el-button>
    </div>
    <el-card class="table-card">
      <el-table :data="homeworkList" style="width: 100%; margin-top: 10px; border-radius: 10px;" :header-cell-style="{background:'#f5f7fa',color:'#409EFF',fontWeight:'bold'}">
        <el-table-column prop="title" label="作业标题" />
        <el-table-column prop="courseName" label="所属课程" />
        <el-table-column prop="type" label="作业类型">
          <template #default="scope">
            {{ typeMap[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="作业状态">
          <template #default="scope">
            {{ statusMap[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" />
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="scope">
            <el-tag :type="getDifficultyType(scope.row.difficulty)" size="small">
              {{ getDifficultyText(scope.row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editHomework(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteHomeworkHandler(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!homeworkList.length" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无作业</h3>
        <p>点击右上角"新增作业"按钮添加作业</p>
      </div>
    </el-card>
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="showAdd" :title="editId ? '编辑作业' : '新增作业'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="作业标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-input v-model="form.courseName" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="阅读" value="read" />
            <el-option label="作业" value="homework" />
            <el-option label="项目" value="project" />
            <el-option label="测试" value="quiz" />
            <el-option label="考试" value="exam" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="form.status" placeholder="请选择类型">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
              v-model="form.deadline"
              type="datetime"
              placeholder="选择截止日期和时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0;">
        <el-button type="primary" @click="goToQuestionSelect">选择题目</el-button>
      </div>
      <div v-if="form.questions && form.questions.length">
        <div style="font-weight:bold;margin-bottom:8px;">已选题目：</div>
        <el-table :data="form.questions" size="small" style="width:100%;">
          <el-table-column prop="question_id" label="题目ID" width="80" />
          <el-table-column prop="content" Nameslabel="题目内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="conceptNames" label="知识点" width="100">
            <template #default="scope">
              <el-tag size="small" type="info">{{ scope.row.concept || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="100">
            <template #default="scope">
              <el-tag :type="getWeightType(scope.row.weight)" size="small">
                {{ getWeightText(scope.row.weight) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="point" label="分值" width="80">
            <template #default="scope">
              <span>{{ scope.row.point || 5 }}分</span>
            </template>
          </el-table-column>
          <el-table-column label="答案" min-width="120">
            <template #default="scope">
              <span v-if="Array.isArray(scope.row.answer)">{{ scope.row.answer.map(i => String.fromCharCode(65+i)).join('，') }}</span>
              <span v-else>{{ String.fromCharCode(65 + scope.row.answer) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveHomework">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getHomeworkList, createHomework, updateHomework, deleteHomework } from '@/api/homework';
import { ElMessage } from 'element-plus';

const router = useRouter();
const homeworkList = ref([]);
const showAdd = ref(false);
const form = ref({ title: '',courseName:'', status:'', type:'', courseId: '', deadline: '', questions: [] });
const editId = ref(null);
const loading = ref(false);

const typeMap = {
  reading: '阅读',
  homework: '作业',
  project: '项目',
  quiz: '小测',
  exam: '考试'
}

const statusMap = {
  draft: '草稿',
  published: '已发布',
  completed: '已完成'
}

// 工具函数
const getWeightText = (weight) => {
  return weight==='low'?'低':weight==='medium'?'中':'高';
};

const getWeightType = (weight) => {
  return weight==='low'?'info':weight==='medium'?'warning':'danger';
};

const getDifficultyText = (difficulty) => {
  return difficulty==='easy'?'简单':difficulty==='medium'?'中等':'困难';
};

const getDifficultyType = (difficulty) => {
  return difficulty==='easy'?'success':difficulty==='medium'?'warning':'danger';
};

const fetchHomework = async () => {
  loading.value = true;
  try {
    const res = await getHomeworkList();

    homeworkList.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取作业列表失败');
  } finally {
    loading.value = false;
  }
};

function editHomework(row) {
  form.value = { ...row };
  if (!form.value.questions) form.value.questions = [];
  editId.value = row.id;
  showAdd.value = true;
}

async function saveHomework() {
  loading.value = true;
  try {
    if (editId.value) {
      await updateHomework({ id: editId.value, ...form.value });
      ElMessage.success('作业更新成功');
    } else {
      await createHomework(form.value);
      ElMessage.success('作业创建成功');
    }
    showAdd.value = false;
    editId.value = null;
    fetchHomework();
  } catch (e) {
    ElMessage.error(editId.value ? '作业更新失败' : '作业创建失败');
  } finally {
    loading.value = false;
  }
}

async function deleteHomeworkHandler(id) {
  loading.value = true;
  try {
    await deleteHomework(id);
    ElMessage.success('作业删除成功');
    fetchHomework();
  } catch (e) {
    ElMessage.error('作业删除失败');
  } finally {
    loading.value = false;
  }
}

function goToQuestionSelect() {
  // 将当前表单数据存储到localStorage，以便在问题选择页面使用
  localStorage.setItem('homeworkFormData', JSON.stringify(form.value));
  // 跳转到问题选择页面
  router.push('/teacher/questionSelect');
}

// 监听页面显示事件，处理从问题选择页面返回的数据
onMounted(() => {
  fetchHomework();

  // 检查是否有从问题选择页面返回的数据
  const storedFormData = localStorage.getItem('homeworkFormData');
  if (storedFormData) {
    const parsedData = JSON.parse(storedFormData);
    // 恢复表单数据，包括已选择的题目
    form.value = { ...form.value, ...parsedData };
    if (parsedData.questions && parsedData.questions.length > 0) {
      ElMessage.success(`已选择 ${parsedData.questions.length} 道题目`);
    }
    localStorage.removeItem('homeworkFormData');
  }
});
</script>

<style scoped>
.homework-mgmt-container {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px 24px 24px;
}
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  font-size: 2rem;
  color: #409EFF;
}
.subtitle {
  color: #888;
  font-size: 15px;
  margin-top: 2px;
}
.table-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 18px;
  padding-bottom: 8px;
}
.empty-state {
  color: #bbb;
  text-align: center;
  padding: 32px 0 16px 0;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}
@media (max-width: 600px) {
  .homework-mgmt-container {
    max-width: 100%;
    margin: 10px 0;
    padding: 10px 2vw;
  }
  .header-title h1 {
    font-size: 1.1rem;
  }
  .table-card {
    padding: 0 2px 8px 2px;
  }
}
</style>
