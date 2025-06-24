import request from './request';

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