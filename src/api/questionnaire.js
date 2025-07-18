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

export function SubmitQuestionnaire(data){
    return request({
        url:`/questionnaire/submit`,
        method:'post',
        data
    });
}