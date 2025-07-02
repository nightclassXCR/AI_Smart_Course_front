import request from './request';

// 获取作业列表
export function getHomeworkList(params) {
  return request({
    url: '/homework/list',
    method: 'get',
    params
  });
}


// 新建作业
export function createHomework(data) {
  return request({
    url: '/homework/create',
    method: 'post',
    data
  });
}

// 编辑作业
export function updateHomework(data) {
  return request({
    url: '/homework/update',
    method: 'post',
    data
  });
}

// 删除作业
export function deleteHomework(homeworkId) {
  return request({
    url: `/homework/delete/${homeworkId}`,
    method: 'delete'
  });
}

// 获取作业详情
export function getHomeworkDetail(homeworkId) {
  return request({
    url: `/homework/detail/${homeworkId}`,
    method: 'get'
  });
}

// 获取知识图谱数据
export function getKnowledgeMap(params) {
  return request({
    url: '/knowledge/map',
    method: 'get',
    params
  });
}

// 获取某个知识点详情
export function getKnowledgeDetail(knowledgeId) {
  return request({
    url: `/knowledge/detail/${knowledgeId}`,
    method: 'get'
  });
}

// 新建知识点
export function createKnowledge(data) {
  return request({
    url: '/knowledge/create',
    method: 'post',
    data
  });
}

// 编辑知识点
export function updateKnowledge(data) {
  return request({
    url: '/knowledge/update',
    method: 'post',
    data
  });
}

// 删除知识点
export function deleteKnowledge(knowledgeId) {
  return request({
    url: `/knowledge/delete/${knowledgeId}`,
    method: 'delete'
  });
}

// 获取学生进度
export function getStudentProgress(params) {
  return request({
    url: '/progress/student',
    method: 'get',
    params
  });
}

// 获取课程进度
export function getCourseProgress(params) {
  return request({
    url: '/progress/course',
    method: 'get',
    params
  });
}

// 更新学生进度
export function updateStudentProgress(data) {
  return request({
    url: '/progress/student/update',
    method: 'post',
    data
  });
}

// 获取题库列表
export function getQuestionBankList(params) {
  return request({
    url: '/questionBank/list',
    method: 'get',
    params
  });
}

// 获取题目详情
export function getQuestionDetail(questionId) {
  return request({
    url: `/questionBank/detail/${questionId}`,
    method: 'get'
  });
}

// 新建题目
export function createQuestion(data) {
  return request({
    url: '/questionBank/create',
    method: 'post',
    data
  });
}

// 编辑题目
export function updateQuestion(data) {
  return request({
    url: '/questionBank/update',
    method: 'post',
    data
  });
}

// 删除题目
export function deleteQuestion(questionId) {
  return request({
    url: `/questionBank/delete/${questionId}`,
    method: 'delete'
  });
}

// 获取学生端我的作业列表
export function getMyAssignments() {
  return request({
    url: '/homework',
    method: 'get'
  });
}

// 提交作业答案
export function submitHomeworkAnswer(homeworkId, data) {
  return request({
    url: `/homework/submit/${homeworkId}`,
    method: 'post',
    data
  });
}

