import request from './request';

// 获取学习分析数据
export function getAnalysisData(params) {
  return request({
    url: '/analysis/data',
    method: 'get',
    params
  });
}

// 获取学生学习进度
export function getStudentProgress(params) {
  return request({
    url: '/analysis/progress',
    method: 'get',
    params
  });
}

// 获取课程学习统计
export function getCourseStatistics(params) {
  return request({
    url: '/analysis/statistics',
    method: 'get',
    params
  });
}

export function getLearningAnalysis(params) {
  // mock: 实际应为request.get('/analysis', { params })
  // return Promise.resolve([
  //   { subject: '数学', score: 88, rank: 3, progress: 85, advice: '保持良好，继续巩固难点。' },
  //   { subject: '物理', score: 91, rank: 1, progress: 92, advice: '表现优秀，适当挑战更高难度。' },
  //   { subject: '化学', score: 76, rank: 8, progress: 67, advice: '加强基础知识复习。' },
  //   { subject: '英语', score: 68, rank: 15, progress: 45, advice: '多做阅读理解练习。' },
  //   { subject: '语文', score: 82, rank: 6, progress: 78, advice: '作文部分需提升。' }
  // ]);
} 

// 获得学生学习总时长
export function getMyTotalStudyTime() {
  return request({
    url:'/analysis/my-total-study-time',
    method:'get'
  });
}

// 获取最新的学习记录
export function getLatestLearningLogInCourse(courseId) {
  return request({
    url: `/log/latest/${courseId}`,
    method: 'get'
  });
}