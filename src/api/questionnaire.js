import request from './request'

export function GetQuestionnaire(courseName){
    return request({
      url:`/questionnaire/detail`,
      method:'post',
      timeout: 480000,
      data: {
        courseName,
      },
    });
} 