import request from './request';

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