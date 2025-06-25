import request from './request';

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  });
} 