<template>
  <div class="question-select-container">
    <div class="header-area">
      <div class="header-title">
        <div class="logo">📝</div>
        <div>
          <h1>选择题目</h1>
          <p class="subtitle">可直接管理题库并多选题目加入作业</p>
        </div>
      </div>
      <el-button type="primary" @click="openEditQuestion()">新增题目</el-button>
    </div>
    <el-table :data="questionBank" @selection-change="handleSelection" style="width:100%;margin-bottom:16px;" :row-key="row=>row.id" ref="questionTable" :default-selection="selected">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="content" label="题目内容" />
      <el-table-column prop="type" label="题型" width="80">
        <template #default="scope">
          <el-tag>{{ typeText(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="答案/参考答案">
        <template #default="scope">
          <span v-if="scope.row.type==='single'">{{ scope.row.options[scope.row.answer] }}</span>
          <span v-else-if="scope.row.type==='multiple'">{{ scope.row.answer.map(i=>scope.row.options[i]).join('，') }}</span>
          <span v-else-if="scope.row.type==='blank'">{{ scope.row.answer }}</span>
          <span v-else-if="scope.row.type==='short'">{{ scope.row.answer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click.stop="openEditQuestion(scope.row, scope.$index)">编辑</el-button>
          <el-button size="small" type="danger" @click.stop="removeQuestion(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:right;">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
    <!-- 题目编辑弹窗 -->
    <el-dialog v-model="showEditDialog" :title="editIdx===-1?'新增题目':'编辑题目'" width="420px">
      <el-form :model="editForm">
        <el-form-item label="题型">
          <el-select v-model="editForm.type" style="width:120px;">
            <el-option label="单选" value="single" />
            <el-option label="多选" value="multiple" />
            <el-option label="填空" value="blank" />
            <el-option label="简答" value="short" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input v-model="editForm.content" />
        </el-form-item>
        <el-form-item v-if="editForm.type==='single'||editForm.type==='multiple'" label="选项">
          <div v-for="(opt, idx) in editForm.options" :key="idx" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <el-input v-model="editForm.options[idx]" style="width:180px;" />
            <el-button size="small" type="danger" @click="removeEditOption(idx)" :disabled="editForm.options.length<=2">删除</el-button>
          </div>
          <el-button size="small" type="success" @click="addEditOption">新增选项</el-button>
        </el-form-item>
        <el-form-item label="答案">
          <template v-if="editForm.type==='single'">
            <el-radio-group v-model="editForm.answer">
              <el-radio v-for="(opt, idx) in editForm.options" :key="idx" :label="idx">{{ String.fromCharCode(65+idx) }}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="editForm.type==='multiple'">
            <el-checkbox-group v-model="editForm.answer">
              <el-checkbox v-for="(opt, idx) in editForm.options" :key="idx" :label="idx">{{ String.fromCharCode(65+idx) }}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="editForm.type==='blank'">
            <el-input v-model="editForm.answer" placeholder="填空答案" />
          </template>
          <template v-else-if="editForm.type==='short'">
            <el-input v-model="editForm.answer" type="textarea" placeholder="参考答案" />
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog=false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const questionBank = ref([
  { id: 1, type: 'single', content: '下列哪个属于牛顿第一定律的内容？', options: ['物体受力才运动','物体不受力也能保持匀速直线运动','力越大加速度越大'], answer: 1 },
  { id: 2, type: 'blank', content: '速度的单位是？', answer: 'm/s' },
  { id: 3, type: 'short', content: '简述牛顿第三定律的内容。', answer: '作用力与反作用力总是成对出现，大小相等，方向相反。' },
  { id: 4, type: 'multiple', content: '下列哪些属于力的基本性质？', options: ['力的大小','力的方向','力的作用点','力的种类'], answer: [0,1,2] }
]);
const selected = ref([]);
const showEditDialog = ref(false);
const editForm = ref({ type: 'single', content: '', options: ['', ''], answer: 0 });
let editIdx = ref(-1);
function typeText(type) {
  return type==='single'?'单选':type==='multiple'?'多选':type==='blank'?'填空':'简答';
}
function handleSelection(val) {
  selected.value = val;
}
function openEditQuestion(row, idx) {
  if (row) {
    editForm.value = JSON.parse(JSON.stringify(row));
    editIdx.value = idx;
    if(editForm.value.type==='multiple' && !Array.isArray(editForm.value.answer)) editForm.value.answer=[];
  } else {
    editForm.value = { type: 'single', content: '', options: ['', ''], answer: 0 };
    editIdx.value = -1;
  }
  showEditDialog.value = true;
}
function addEditOption() {
  editForm.value.options.push('');
}
function removeEditOption(idx) {
  if (editForm.value.options.length > 2) {
    editForm.value.options.splice(idx, 1);
    if (editForm.value.type==='single' && editForm.value.answer >= editForm.value.options.length) {
      editForm.value.answer = 0;
    }
    if (editForm.value.type==='multiple') {
      editForm.value.answer = editForm.value.answer.filter(i=>i<editForm.value.options.length);
    }
  }
}
function saveEdit() {
  if (!editForm.value.content.trim() || (['single','multiple'].includes(editForm.value.type) && editForm.value.options.some(opt=>!opt.trim()))) {
    window.$message?.error?.('题目和选项不能为空');
    return;
  }
  if (editForm.value.type==='multiple' && !Array.isArray(editForm.value.answer)) editForm.value.answer=[];
  if (editIdx.value === -1) {
    questionBank.value.push({ ...editForm.value, id: Date.now() });
  } else {
    questionBank.value[editIdx.value] = { ...editForm.value };
  }
  showEditDialog.value = false;
}
function removeQuestion(idx) {
  questionBank.value.splice(idx, 1);
}
function cancel() {
  window.history.back();
}
function confirm() {
  // 通过事件抛出选中题目
  window.parent.postMessage({ type: 'question-selected', data: selected.value }, '*');
  // 或用emit('question-selected', selected.value)（如父组件监听）
  window.history.back();
}
</script>
<style scoped>
.question-select-container {
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