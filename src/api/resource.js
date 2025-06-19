import request from './request';

export function getResourceList(params) {
  // mock: 实际应为request.get('/resources', { params })
  return Promise.resolve([
    { id: 1, name: '高三数学讲义.pdf', type: '文档', uploader: '王老师', uploadDate: '2024-03-20' },
    { id: 2, name: '物理实验视频.mp4', type: '视频', uploader: '李老师', uploadDate: '2024-03-18' },
    { id: 3, name: '化学知识点.png', type: '图片', uploader: '张老师', uploadDate: '2024-03-15' }
  ]);
}

export function uploadResource(data) {
  // mock
  return Promise.resolve({ success: true });
}

export function deleteResource(id) {
  // mock
  return Promise.resolve({ success: true });
} 