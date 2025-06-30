import request from './request'

export function getChapterDetail(chapterId) {
  return request({
    url: `/chapters/${chapterId}`,
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