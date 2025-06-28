import request from './request'

export function viewConcept(conceptId, durationSeconds){
    return request({
      url:`/concepts/${conceptId}/users/view?durationSeconds=${durationSeconds}`,
      method:'post'
    });
} 