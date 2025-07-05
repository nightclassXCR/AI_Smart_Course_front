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

// 上移章节
export function moveChapterUp(chapterId) {
  return request({
    url: `/chapters/reorder/${chapterId}`,
    method: 'put'
  });
}
// 下移章节
export function moveChapterDown(chapterId) {
  return request({
    url: `/chapters/reorder/${chapterId}`,
    method: 'put'
  })
}

export function reorderChapters(courseId, orderedChapterIds) {
  return request({
    url: `/chapters/reorder/${courseId}`,
    method: 'put',
    data: orderedChapterIds,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getConceptDetail(conceptId) {
  return request({
    url: `/concepts/${conceptId}`,
    method: 'get'
  });
}

// 获取所有章节
export function getAllChapter() {
  return request({
    url: '/chapters',
    method: 'get'
  });
}

// 根据课程ID获取章节
export function getCourseChapters(courseId) {
  return request({
    url: `/chapters/${courseId}`,
    method: 'get'
  });
}

// 添加章节
export function addChapter(data) {
  return request({
    url: '/chapters',
    method: 'post',
    data
  });
}

// 更新章节
export function updateChapter(data) {
  return request({
    url: '/chapters',
    method: 'put',
    data
  });
}

// 删除章节
export function deleteChapter(id) {
  return request({
    url: `/chapters/${id}`,
    method: 'delete'
  });
}

// 获取某章节下的所有知识点
export function getConceptsByChapterId(chapterId) {
  return request({
    url: `/chapters/${chapterId}/concepts`,
    method: 'get'
  });
}

// 获取章节内容
export function getChapterContentById(chapterId) {
  return request({
    url: `/chapters/${chapterId}/content`,
    method: 'get'
  });
}

// 以下为知识点相关方法（空实现或待补充）
export function addConcept() { return Promise.resolve(); }
export function updateConcept() { return Promise.resolve(); }
export function deleteConcept() { return Promise.resolve(); }

