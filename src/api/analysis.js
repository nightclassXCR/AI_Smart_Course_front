import request from './request';

export function getLearningAnalysis(params) {
  // mock: 实际应为request.get('/analysis', { params })
  return Promise.resolve([
    { subject: '数学', score: 88, rank: 3, progress: 85, advice: '保持良好，继续巩固难点。' },
    { subject: '物理', score: 91, rank: 1, progress: 92, advice: '表现优秀，适当挑战更高难度。' },
    { subject: '化学', score: 76, rank: 8, progress: 67, advice: '加强基础知识复习。' },
    { subject: '英语', score: 68, rank: 15, progress: 45, advice: '多做阅读理解练习。' },
    { subject: '语文', score: 82, rank: 6, progress: 78, advice: '作文部分需提升。' }
  ]);
} 