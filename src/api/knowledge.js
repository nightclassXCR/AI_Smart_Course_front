import request from './request';

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