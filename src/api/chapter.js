import request from './request'

export function getChapterDetail(chapterId) {
  return request({
    url: `/chapters/${chapterId}/content`,
    method: 'get'
  })
}
export function getConceptsByChapter(chapterId) {
  return request({
    url: `/chapters/${chapterId}/concepts`,
    method: 'get'
  })
}
export function getResourcesByChapter(chapterId) {
  return request({
    url: `/resource/chapter/${chapterId}`,
    method: 'get'
  })
}
// 添加知识点
export function addConcept(conceptDto) {
  return request({
    url: '/concepts',
    method: 'post',
    data: conceptDto
  });
}
// 更新知识点
export function updateConcept(conceptDto) {
  return request({
    url: '/concepts',
    method: 'put',
    data: conceptDto
  });
}
// 删除知识点
export function deleteConcept(id) {
  return request({
    url: `/concepts/${id}`,
    method: 'delete'
  });
}
// 删除章节
export function deleteChapter(id) {
  return request({
    url: `/chapters/${id}`,
    method: 'delete'
  });
}
// 新增章节
export function addChapter(chapterDto) {
  return request({
    url: '/chapters',
    method: 'post',
    data: chapterDto
  });
}

// 获取概念详情
export function getConceptDetail(id) {
  return request({
    url: `/concepts/${id}`,
    method: 'get'
  });
} 