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
        <el-form-item label="所属课程" prop="courseId">
          <el-select
            v-model="form.courseId"
            placeholder="请选择课程"
            @change="handleCourseChange"
          >
            <el-option
              v-for="item in courseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-button type="primary" @click="showQuestionDialog = true">选择题目</el-button>
      </div>
      <div v-if="form.questions && form.questions.length">
        <div style="font-weight:bold;margin-bottom:4px;">已选题目：</div>
        <el-table :data="form.questions" size="small" style="width:100%;">
          <el-table-column prop="content" label="题目内容" />
          <el-table-column label="正确答案">
            <template #default="scope">
              <span>{{ scope.row.options[scope.row.answer] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveHomework">保存</el-button>
      </template>
    </el-dialog>
    <!-- 题库选择弹窗 -->
    <el-dialog v-model="showQuestionDialog" title="选择题目" width="600px" :visible="false" />
    <!-- 题库选择弹窗已废弃，改为跳转新页面 -->
    <router-view v-if="showQuestionDialog" @question-selected="onQuestionSelected" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getHomeworkList, createHomework, updateHomework, deleteHomework } from '@/api/homework';
import { getAllCourses } from '@/api/course';
import { ElMessage } from 'element-plus';
const homeworkList = ref([]);
const showAdd = ref(false);
const form = reactive({
  title: '',
  courseName: '',
  status: '',
  type: '',
  courseId: '',
  deadline: '',
  questions: []
});
const editId = ref(null);
const showQuestionDialog = ref(false);
const loading = ref(false);
const courseOptions = ref([]);


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
onMounted(fetchHomework);
onMounted(async () => {
  // 假设 getCourseList 返回 [{ id: 1, name: '数学' }, ...]
  const res = await getAllCourses()
  courseOptions.value = res.data.map(item => ({
    value: item.id,
    label: item.name
  }))
})

function editHomework(row) {
  form.title = row.title;
  form.courseName = row.courseName;
  form.status = row.status;
  form.type = row.type;
  form.courseId = row.courseId;
  form.deadline = row.deadline;
  if (!form.questions) form.questions = [];
  editId.value = row.id;
  showAdd.value = true;
}

async function saveHomework() {
  loading.value = true;
  try {
    if (editId.value) {
      await updateHomework({ id: editId.value, ...form });
      ElMessage.success('作业更新成功');
    } else {
      await createHomework(form);
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

function onQuestionSelected(selectedQuestions) {
  form.questions = selectedQuestions;
  showQuestionDialog.value = false;
}

function handleCourseChange(value) {
  const selected = courseOptions.value.find(item => item.value === value)
  form.courseName = selected ? selected.label : ''
}
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
