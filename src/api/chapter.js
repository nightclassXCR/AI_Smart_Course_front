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