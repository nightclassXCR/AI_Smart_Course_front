<template>
  <div class="question-bank-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📝</div>
        <div>
          <h1>题库管理</h1>
          <p class="subtitle">管理课程相关题目，可用于作业组卷</p>
        </div>
      </div>
      <el-button type="primary" @click="addQuestion">新增题目</el-button>
    </div>
    <el-table :data="questions" style="width: 100%; margin-top: 18px;">
      <el-table-column prop="content" label="题目内容" min-width="220" />
      <el-table-column label="选项">
        <template #default="scope">
          <div v-for="(opt, idx) in scope.row.options" :key="idx">
            <span :style="{color: scope.row.answer === idx ? '#67c23a' : '#333'}">{{ String.fromCharCode(65+idx) }}. {{ opt }}</span>
            <span v-if="scope.row.answer === idx" style="margin-left:6px;color:#67c23a;">✔</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button size="small" @click="editQuestion(scope.$index)">编辑</el-button>
          <el-button size="small" type="danger" @click="removeQuestion(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑/新增题目弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editIdx===-1?'新增题目':'编辑题目'">
      <el-form :model="editForm">
        <el-form-item label="题目内容">
          <el-input v-model="editForm.content" />
        </el-form-item>
        <el-form-item label="选项">
          <div v-for="(opt, idx) in editForm.options" :key="idx" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <el-input v-model="editForm.options[idx]" style="width:180px;" />
            <el-radio v-model="editForm.answer" :label="idx">正确答案</el-radio>
            <el-button size="small" type="danger" @click="removeOption(idx)" :disabled="editForm.options.length<=2">删除</el-button>
          </div>
          <el-button size="small" type="success" @click="addOption">新增选项</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getQuestionBankList, createQuestion, updateQuestion, deleteQuestion } from '@/api/questionBank';
import { ElMessage } from 'element-plus';

const questions = ref([]);
const dialogVisible = ref(false);
const editForm = ref({ content: '', options: ['', ''], answer: 0 });
let editIdx = ref(-1);
const loading = ref(false);

const fetchQuestions = async () => {
  loading.value = true;
  try {
    const res = await getQuestionBankList();
    questions.value = res.data?.list || res.data || [];
  } catch (e) {
    ElMessage.error('获取题库列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuestions);

function addQuestion() {
  editForm.value = { content: '', options: ['', ''], answer: 0 };
  editIdx.value = -1;
  dialogVisible.value = true;
}
function editQuestion(idx) {
  editForm.value = JSON.parse(JSON.stringify(questions.value[idx]));
  editIdx.value = idx;
  dialogVisible.value = true;
}
async function removeQuestion(idx) {
  loading.value = true;
  try {
    await deleteQuestion(questions.value[idx].id);
    ElMessage.success('题目删除成功');
    fetchQuestions();
  } catch (e) {
    ElMessage.error('题目删除失败');
  } finally {
    loading.value = false;
  }
}
function addOption() {
  editForm.value.options.push('');
}
function removeOption(idx) {
  if (editForm.value.options.length > 2) {
    editForm.value.options.splice(idx, 1);
    if (editForm.value.answer >= editForm.value.options.length) {
      editForm.value.answer = 0;
    }
  }
}
async function saveEdit() {
  if (!editForm.value.content.trim() || editForm.value.options.some(opt=>!opt.trim())) {
    ElMessage.error('题目和选项不能为空');
    return;
  }
  loading.value = true;
  try {
    if (editIdx.value === -1) {
      await createQuestion(editForm.value);
      ElMessage.success('题目创建成功');
    } else {
      await updateQuestion({ id: questions.value[editIdx.value].id, ...editForm.value });
      ElMessage.success('题目更新成功');
    }
    dialogVisible.value = false;
    fetchQuestions();
  } catch (e) {
    ElMessage.error(editIdx.value === -1 ? '题目创建失败' : '题目更新失败');
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.question-bank-container {
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
  justify-content: space-between;
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
</style> 