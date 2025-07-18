<template>
    <div class="questionnaire-container">
      <h1 class="questionnaire-title">{{ questionnaire.title }}</h1>
      <p class="questionnaire-instructions">{{ questionnaire.instructions }}</p>
      <hr class="divider" />
      <form @submit.prevent="handleSubmit">
        <div v-for="(question, index) in questionnaire.questions" :key="question.id" class="question-card">
          <h3 class="question-text">{{ index + 1 }}. {{ question.question_text }}</h3>
          <div class="options-preview" v-if="question.options && question.options.length">
            <span v-for="(option, optIdx) in question.options" :key="optIdx" class="option-preview">
              {{ option }}<span v-if="optIdx !== question.options.length - 1"> | </span>
            </span>
          </div>
  
          <!-- 单选题/判断题 -->
<div v-if="question.type === 'single_choice' || question.type === 'true_false'" class="options-group">
  <div v-for="(option, optIdx) in (question.options && question.options.length ? question.options : ['正确', '错误'])" :key="optIdx" class="option-item">
    <input
      type="radio"
      :id="`q${question.id}-opt${optIdx}`"
      :name="`question-${question.id}`"
      :value="option"
      v-model="answers[question.id]"
      class="radio-input"
    />
    <label :for="`q${question.id}-opt${optIdx}`" class="option-label">{{ option }}</label>
  </div>
</div>

<!-- 多选题 -->
<div v-else-if="question.type === 'multiple_choice'" class="options-group">
  <div v-for="(option, optIdx) in question.options" :key="optIdx" class="option-item">
    <input
      type="checkbox"
      :id="`q${question.id}-opt${optIdx}`"
      :value="option"
      v-model="answers[question.id]"
      class="checkbox-input"
    />
    <label :for="`q${question.id}-opt${optIdx}`" class="option-label">{{ option }}</label>
  </div>
</div>
  
          <div v-else-if="question.type === 'short_answer'" class="short-answer-group">
            <textarea
              :name="`question-${question.id}`"
              rows="4"
              v-model="answers[question.id]"
              class="textarea-input"
              placeholder="请输入您的答案..."
            ></textarea>
          </div>
  
          </div>
  
        <button type="submit" class="submit-button">提交问卷</button>
      </form>
    </div>
  </template>
  
  <script>
  import { jwtDecode } from 'jwt-decode';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { GetQuestionnaire,SubmitQuestionnaire } from '@/api/questionnaire';

  export default {
    name: 'Questionnaire',
    setup() {
      const token = localStorage.getItem('token'); 
      let userId = null;
      if (token) {
        try {
         const decoded = jwtDecode(token);
         userId = decoded.userID; 
        } catch (e) {
          console.error('token解析失败', e);
        }
      }
      const questionnaire = ref({ title: '', instructions: '', questions: [] });
      const loading = ref(true);
      const error = ref(null);
      const answers = ref({});
      const route = useRoute();
      const courseName = route.query.course || '';
      const fetchQuestionnaire = async () => {
    try {
        console.log('准备请求问卷，courseName:', courseName);
        const res = await GetQuestionnaire(courseName);
        console.log('问卷接口返回:', res);
        questionnaire.value = res.data;
        (res.data.questions || []).forEach(q => {
        answers.value[q.id] = '';
        });
    } catch (err) {
        error.value = err;
        console.error('问卷接口调用失败:', err);
    } finally {
        loading.value = false;
    }
    };
      const handleSubmit = async () => {
        const submittedQuestions = questionnaire.value.questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        type: q.type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        userAnswer: answers.value[q.id]
  }));

  const payload = {
    userId,
    submittedQuestions
  };

  try {
    const res = await SubmitQuestionnaire(payload);
    alert('提交成功！');
    // 可选：跳转页面或清空表单

  } catch (err) {
    alert('提交失败，请重试');
    console.error(err);
  }
      };

      onMounted(() => {
        fetchQuestionnaire();
      });

      return {
        questionnaire,
        loading,
        error,
        answers,
        handleSubmit,
      };
    },
  };
  </script>
  
  <style scoped>
  .questionnaire-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  .questionnaire-title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 2.2em;
    font-weight: 700;
  }
  
  .questionnaire-instructions {
    text-align: center;
    color: #555;
    margin-bottom: 35px;
    font-size: 1.1em;
    line-height: 1.6;
  }
  
  .divider {
    border: none;
    border-top: 1px solid #f0f0f0;
    margin-bottom: 35px;
  }
  
  .question-card {
    margin-bottom: 30px;
    padding: 25px;
    border: 1px solid #f5f5f5;
    border-radius: 8px;
    background-color: #fcfcfc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }
  
  .question-text {
    color: #007bff;
    margin-bottom: 20px;
    font-size: 1.3em;
    font-weight: 600;
  }
  
  .options-group, .short-answer-group {
    margin-left: 15px;
  }
  
  .option-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  
  .radio-input {
    margin-right: 10px;
    transform: scale(1.2); /* 使单选框稍大 */
  }
  
  .option-label {
    font-size: 1.1em;
    color: #444;
    cursor: pointer;
  }
  
  .textarea-input {
    width: calc(100% - 20px);
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    resize: vertical;
    min-height: 100px;
    box-sizing: border-box; /* 确保 padding 不会增加总宽度 */
  }
  
  .submit-button {
    display: block;
    width: 100%;
    padding: 15px 25px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.2em;
    cursor: pointer;
    margin-top: 30px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-weight: 600;
  }
  
  .submit-button:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }
  
  .submit-button:active {
    transform: translateY(0);
  }
  
  /* 隐藏正确答案和解释的样式，除非您决定显示它们 */
  .correct-answer-info, .explanation-info {
    margin-top: 15px;
    font-size: 0.95em;
    color: #666;
    padding-left: 5px;
    border-left: 3px solid #ccc;
  }
  .correct-answer-info strong, .explanation-info strong {
    color: #333;
  }
  </style>