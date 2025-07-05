import request from './request';

export function getKnowledgeMap(courseName) {
  return request({
    url: '/graph/details',
    method: 'post',
    timeout: 480000,
    data: {
      courseName,
    },
  });
}