import request from "@/utils/request.js";

export function postDecrypt(argu) {
  return request.post('usercenter/auth/decrypt', argu,{noAuth:true})
}

export function postWxauth(argu) {
  return request.post('usercenter/auth/wxauth',argu,{noAuth:true})
}

export function bindWechat(argu) {
  return request.post('usercenter/auth/bindWechat',argu,{noAuth:true})
}

export function getUserInfo(argu) {
  return request.get('usercenter/auth/userInfo',argu)
}

export function addCollection(argu) {
  return request.get(`usercenter/favorites/favorite/${ argu.id }`)
}

export function cancelCollection(argu) {
  return request.get(`usercenter/favorites/cancelFavorite/${ argu.id }`)
}

export function addFollow(argu) {
  return request.get(`usercenter/favorites/consultant/${ argu.id }`)
}

export function cancelFollow(argu) {
  return request.get(`usercenter/favorites/cancelConsultant/${ argu.id }`)
}

export function myCollection() {
  return request.get('usercenter/favorites/myFavorite')
}

export function myFollow() {
  return request.get('usercenter/favorites/myConsultant')
}
