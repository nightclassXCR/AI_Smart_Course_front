import request from './request';

// 邮箱登录
export function loginByEmail(data) {
    return request({
        url: '/auth/email',
        method: 'post',
        data
    });
}

// 手机号登录
export function loginByPhoneNumber(data) {
    return request({
        url: '/auth/phoneNumber',
        method: 'post',
        data
    });
}