import request from './request';

export function getHomeworkList(params) {
  return request.get('/homeworks', { params });
}

export function getHomeworkDetail(id) {
  return request.get(`/homeworks/${id}`);
}

export function addHomework(data) {
  return request.post('/homeworks', data);
}

export function updateHomework(id, data) {
  return request.put(`/homeworks/${id}`, data);
}

export function deleteHomework(id) {
  return request.delete(`/homeworks/${id}`);
} 