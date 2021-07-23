import request from "./../utils/request.js";

export function getTutorList(argu) {
  return request.post('usercenter/consultant/page', argu)
}

export function getTutorAlbum(argu) {
  return request.post('usercenter/consultant/album', argu)
}

export function getTutorDetail(argu) {
  return request.get(`usercenter/consultant/${ argu.id }`)
}

export function postBeforehand(argu) {
  return request.post('usercenter/appoint', argu)
}

export function postComment(argu) {
  return request.post('usercenter/consultant/note/page', argu)
}

export function postAppointment(argu) {
  return request.post('usercenter/appoint', argu)
}

export function getConsultDate(argu) {
  return request.get(`usercenter/appoint/consultDate/${ argu.id }`)
}

export function getConsultTimes(argu) {
  return request.get(`usercenter/appoint/consultTimes/${ argu.id }/${ argu.consultDate }`)
}

export function postIndexGoods(argu) {
  return request.post('usercenter/consultant/page', argu)
}
// 获取省市区数据
export function getRegion() {
  return request.get('sys/region/region')
}