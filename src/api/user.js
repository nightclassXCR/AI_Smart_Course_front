import request from './request';

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  });
}

// 用户注册
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
}

