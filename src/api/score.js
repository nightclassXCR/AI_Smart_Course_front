import request from './request';


// 获取某门课程的成绩分布情况（百分比）
export function getScoreDistribution(courseId) {
  return request({
    url: `/score/courses/${courseId}/scoreDistribution`,
    method: 'get',

  });
}