<template>
  <div class="question-select-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📝</div>
        <div>
          <h1>选择题目</h1>
          <p class="subtitle">根据知识点查询并选择题目加入作业</p>
        </div>
      </div>
      <el-button type="primary" @click="openEditQuestion()">新增题目</el-button>
    </div>

    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="知识点名称">
          <el-input v-model="searchForm.conceptName" placeholder="请输入知识点名称" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchQuestions">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 题目表格 -->
    <el-card class="table-card">
      <el-table
          :data="questionList"
          @selection-change="handleSelection"
          style="width:100%;"
          :row-key="row=>row.id"
          ref="questionTable"
          v-loading="loading"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="题目ID" width="100" />
        <el-table-column prop="content" label="题干内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="conceptNames" label="知识点" width="180">
          <template #default="scope">
            <el-tag
                v-for="(c, idx) in Array.isArray(scope.row.conceptNames) ? scope.row.conceptNames : [scope.row.conceptNames]"
                :key="idx"
                size="small"
                type="info"
                style="margin-right: 2px"
            >{{ c }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="scope">
            <el-tag :type="getDifficultyType(scope.row.difficulty)">
              {{ getDifficultyText(scope.row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" @click.stop="openEditQuestion(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click.stop="removeQuestion(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 底部操作按钮 -->
    <div class="bottom-actions">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm" :disabled="selectedQuestions.length === 0">
        添加选中题目 ({{ selectedQuestions.length }})
      </el-button>
    </div>

    <!-- 题目编辑弹窗 -->
    <el-dialog v-model="showEditDialog" :title="editIdx===-1?'新增题目':'编辑题目'" width="500px" @close="resetEditForm">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="题目内容">
          <el-input v-model="editForm.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="选项内容">
          <div v-for="(opt, idx) in editForm.options" :key="idx" style="margin-bottom: 6px; display: flex; align-items: center;">
            <span style="width: 22px;">{{ String.fromCharCode(65+idx) }}.</span>
            <el-input v-model="editForm.options[idx]" :placeholder="`选项${String.fromCharCode(65+idx)}`" style="flex:1;" />
          </div>
        </el-form-item>
        <el-form-item label="答案">
          <el-radio-group v-model="editForm.answer">
            <el-radio :label="0">A</el-radio>
            <el-radio :label="1">B</el-radio>
            <el-radio :label="2">C</el-radio>
            <el-radio :label="3">D</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="editForm.difficulty" style="width:120px;">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点">
          <el-input v-model="editForm.conceptNames" placeholder="请输入知识点，多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="editForm.point" :min="1" :max="100" :precision="0" placeholder="请输入题目分值" style="width: 120px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog=false">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="editLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getQuestionBankList, getQuestionsByConcept, createQuestion, updateQuestion, deleteQuestion } from '@/api/questionBank';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

// 响应式数据
const questionList = ref([]);
const selectedQuestions = ref([]);
const loading = ref(false);
const showEditDialog = ref(false);
const editLoading = ref(false); // 编辑保存loading
const deleteLoading = ref(false); // 删除loading
const editForm = ref({
  content: '',
  options: ['', '', '', ''], // A, B, C, D
  answer: 0,
  difficulty: 'medium',
  conceptNames: '',
  point: 5
});
let editIdx = ref(-1);

// 查询表单
const searchForm = ref({
  conceptName: ''
});

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const questionTable = ref(null);

// 在页面加载时检查是否有已选择的题目
onMounted(() => {
  const storedFormData = localStorage.getItem('homeworkFormData');
  if (storedFormData) {
    const parsedData = JSON.parse(storedFormData);
    if (parsedData.questions && parsedData.questions.length > 0) {
      // 设置已选择的题目
      selectedQuestions.value = parsedData.questions;
    }
  }
  // 初始加载题目列表
  fetchQuestions();
});

// 获取题目列表
const fetchQuestions = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      conceptName: searchForm.value.conceptName
    };

    // 如果有conceptName，使用专门的concept查询接口
    let res;
    if (searchForm.value.conceptName) {
      res = await getQuestionsByConcept(params);
    } else {
      res = await getQuestionBankList(params);
    }

    if (res.data) {
      // 只取 list 字段，确保是数组，并补充id字段
      questionList.value = (Array.isArray(res.data.list) ? res.data.list : []).map(item => ({
        ...item,
        id: item.id || item.question_id
      }));
      pagination.value.total = res.data.total || 0;
    }
  } catch (error) {
    // 如果API调用失败，使用模拟数据
    console.warn('API调用失败，使用模拟数据:', error);

    // 模拟数据
    const mockData = [
      {
        question_id: 1,
        content: '下列哪个属于牛顿第一定律的内容？',
        answer: 1,
        difficulty: 'hard',
        concept: '牛顿定律'
      },
      {
        question_id: 2,
        content: '速度的单位是？',
        answer: 0,
        difficulty: 'medium',
        concept: '运动学'
      },
      {
        question_id: 3,
        content: '牛顿第三定律的内容是什么？',
        answer: 0,
        difficulty: 'hard',
        concept: '牛顿定律'
      },
      {
        question_id: 4,
        content: '下列哪些属于力的基本性质？',
        answer: [0,1,2],
        difficulty: 'medium',
        concept: '力学基础'
      },
      {
        question_id: 5,
        content: '重力加速度在地球表面的数值约为？',
        answer: 0,
        difficulty: 'easy',
        concept: '动力学'
      },
      {
        question_id: 6,
        content: '机械能守恒定律适用于什么情况？',
        answer: 3,
        difficulty: 'hard',
        concept: '能量守恒'
      },
      {
        question_id: 7,
        content: '动量守恒定律适用于什么情况？',
        answer: 1,
        difficulty: 'medium',
        concept: '动量守恒'
      }
    ];

    // 根据查询条件过滤数据
    let filteredData = mockData;
    if (searchForm.value.conceptName) {
      filteredData = filteredData.filter(item => item.concept && item.concept.includes(searchForm.value.conceptName));
    }

    // 分页处理
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    questionList.value = filteredData.slice(start, end).map(item => ({
      ...item,
      id: item.question_id
    }));
    pagination.value.total = filteredData.length;
  } finally {
    loading.value = false;
  }
};

// 查询题目
const searchQuestions = () => {
  pagination.value.currentPage = 1;
  fetchQuestions();
};

// 重置查询
const resetSearch = () => {
  searchForm.value = {
    conceptName: ''
  };
  pagination.value.currentPage = 1;
  fetchQuestions();
};

// 分页处理
const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  fetchQuestions();
};

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  fetchQuestions();
};

// 选择处理
const handleSelection = (val) => {
  selectedQuestions.value = val;
};

const getDifficultyText = (difficulty) => {
  return difficulty==='easy'?'简单':difficulty==='medium'?'中等':'困难';
};

const getDifficultyType = (difficulty) => {
  return difficulty==='easy'?'success':difficulty==='medium'?'warning':'danger';
};

// 编辑题目
const openEditQuestion = (row) => {
  if (row) {
    editForm.value = {
      ...JSON.parse(JSON.stringify(row)),
      id: row.id || row.question_id // 保证有id
    };
    // 还原 options 为字符串数组（兼容OptionDTO对象数组、嵌套数组、字符串数组）
    if (Array.isArray(editForm.value.options)) {
      if (typeof editForm.value.options[0] === 'object' && editForm.value.options[0] !== null && 'optValue' in editForm.value.options[0]) {
        editForm.value.options = editForm.value.options.map(opt => opt.optValue);
      } else if (Array.isArray(editForm.value.options[0])) {
        editForm.value.options = editForm.value.options.map(opt => String(opt[0] || ''));
      } else {
        editForm.value.options = editForm.value.options.map(opt => String(opt || ''));
      }
    }
    if (!Array.isArray(editForm.value.options) || editForm.value.options.length !== 4) {
      editForm.value.options = ['', '', '', ''];
    }
    // 还原 conceptNames
    if (Array.isArray(editForm.value.conceptNames)) {
      editForm.value.conceptNames = editForm.value.conceptNames.join(',');
    } else if (!editForm.value.conceptNames) {
      editForm.value.conceptNames = '';
    }
    // 将 answer 字母转为数字
    const answerMap = { A: 0, B: 1, C: 2, D: 3 };
    if (typeof editForm.value.answer === 'string' && answerMap[editForm.value.answer] !== undefined) {
      editForm.value.answer = answerMap[editForm.value.answer];
    }
    editIdx.value = questionList.value.findIndex(item => item.id === row.id || item.question_id === row.question_id);
  } else {
    editForm.value = {
      content: '',
      options: ['', '', '', ''],
      answer: 0,
      difficulty: 'medium',
      conceptNames: ''
    };
    editIdx.value = -1;
  }
  showEditDialog.value = true;
};

const resetEditForm = () => {
  editForm.value = { content: '', options: ['', '', '', ''], answer: 0, difficulty: 'medium', conceptNames: '', point: 5 };
  editIdx.value = -1;
};

const saveEdit = async () => {
  // 校验
  if (!editForm.value.content.trim()) {
    ElMessage.error('题目内容不能为空');
    return;
  }
  if (editForm.value.options.some(opt => !String(Array.isArray(opt) ? opt[0] : (typeof opt === 'object' && opt !== null && 'optValue' in opt ? opt.optValue : opt || '')).trim())) {
    ElMessage.error('所有选项内容不能为空');
    return;
  }
  if (editForm.value.answer === null || editForm.value.answer === undefined) {
    ElMessage.error('请选择答案');
    return;
  }
  if (!editForm.value.conceptNames.trim()) {
    ElMessage.error('知识点不能为空');
    return;
  }
  if (!editForm.value.point || editForm.value.point < 1) {
    ElMessage.error('请输入有效的分值');
    return;
  }
  let conceptArr = editForm.value.conceptNames.split(',').map(s => s.trim()).filter(Boolean);
  const optionsArr = editForm.value.options.map((opt, idx) => ({
    optKey: String.fromCharCode(65 + idx),
    optValue: typeof opt === 'string' ? opt : (Array.isArray(opt) ? opt[0] : (opt && opt.optValue ? opt.optValue : ''))
  }));
  const answerArr = ['A', 'B', 'C', 'D'];
  const submitData = {
    ...editForm.value,
    conceptNames: conceptArr,
    options: optionsArr,
    answer: answerArr[editForm.value.answer],
    point: editForm.value.point
  };
  console.log('新增/编辑题目提交数据:', submitData);
  try {
    editLoading.value = true;
    let res;
    if (editIdx.value === -1) {
      delete submitData.id; // <--- 正确！只在新增时删除ID
      console.log('新增题目提交数据:', submitData);
      res = await createQuestion(submitData);
      if (res.code !== 200) throw new Error(res.message || '创建失败');
      ElMessage.success('题目创建成功');
    } else {
      // 编辑时必须有 id
      if (!submitData.id) {
        ElMessage.error('编辑题目时缺少题目ID');
        return;
      }
      console.log('编辑题目提交数据:', submitData);
      res = await updateQuestion(submitData);
      if (res.code !== 200) throw new Error(res.message || '更新失败');
      ElMessage.success('题目更新成功');
    }
    showEditDialog.value = false;
    resetEditForm();
    fetchQuestions(); // 刷新列表
  } catch (error) {
    ElMessage.error(error.message || '保存失败，请重试');
    console.warn('API调用失败，使用模拟数据更新:', error);
    if (editIdx.value === -1) {
      submitData.id = Date.now();
      questionList.value.push({ ...submitData });
      ElMessage.success('题目创建成功（模拟数据）');
    } else {
      questionList.value[editIdx.value] = { ...submitData };
      ElMessage.success('题目更新成功（模拟数据）');
    }
    showEditDialog.value = false;
    resetEditForm();
  } finally {
    editLoading.value = false;
  }
};

// 删除题目
const removeQuestion = async (questionId) => {
  try {
    deleteLoading.value = true;
    await ElMessageBox.confirm('确定要删除这道题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteQuestion(questionId);
    ElMessage.success('题目删除成功');
    fetchQuestions(); // 刷新列表
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error('删除失败，请重试');
    console.warn('API调用失败，使用模拟数据删除:', error);
    const index = questionList.value.findIndex(item => item.id === questionId);
    if (index > -1) {
      questionList.value.splice(index, 1);
      ElMessage.success('题目删除成功（模拟数据）');
    }
  } finally {
    deleteLoading.value = false;
  }
};

const cancel = () => {
  router.push('/teacher/homeworkManagement');
};

const confirm = () => {
  // 将选中的题目数据存储到localStorage
  const storedFormData = localStorage.getItem('homeworkFormData');
  let formData = {};
  if (storedFormData) {
    formData = JSON.parse(storedFormData);
  }
  formData.questions = selectedQuestions.value;
  localStorage.setItem('homeworkFormData', JSON.stringify(formData));

  ElMessage.success(`已选择 ${selectedQuestions.value.length} 道题目`);

  // 返回到作业管理页面
  router.push('/teacher/homeworkManagement');
};
</script>

<style scoped>
.question-select-container {
  max-width: 1200px;
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

.search-card {
  margin-bottom: 18px;
  border-radius: 8px;
}

.table-card {
  margin-bottom: 18px;
  border-radius: 8px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .question-select-container {
    margin: 10px;
    padding: 16px;
  }

  .header-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-card .el-form {
    flex-direction: column;
  }

  .search-card .el-form-item {
    margin-right: 0;
  }
}
</style> 