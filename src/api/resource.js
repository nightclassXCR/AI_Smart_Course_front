import request from './request';

// 获取资源列表
export function getResourceList(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params
  });
}

// 新建资源
export function createResource(data) {
  return request({
    url: '/resource/create',
    method: 'post',
    data
  });
}

// 编辑资源
export function updateResource(data) {
  return request({
    url: '/resource/update',
    method: 'post',
    data
  });
}

// 删除资源
export function deleteResource(resourceId) {
  return request({
    url: `/resource/delete/${resourceId}`,
    method: 'delete'
  });
}

// 获取资源详情
export function getResourceDetail(resourceId) {
  return request({
    url: `/resource/detail/${resourceId}`,
    method: 'get'
  });
}
export function getResourcesByChapterId(chapterId) {
  return request({
    url: `/resource/chapter/${chapterId}`,
    method: 'get'
  });
}

// 获取第2页，每页20条
getResourceList({ pageNum: 2, pageSize: 20 }) 

