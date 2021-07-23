import request from "./../utils/request.js";
// 发送短信
export function sendSms(argu) {
  return request.post('usercenter/sms/send', argu, {noAuth: true})
}
// 注册
export function postRegister(argu) {
  return request.post('usercenter/auth/register', argu, {noAuth: true})
}
// app登陆
export function postLogin(argu) {
  return request.post('usercenter/auth/login', argu, {noAuth: true})
}
// 重置密码
export function postResetPwd(argu) {
  return request.post('usercenter/auth/resetPwd', argu, {noAuth: true})
}

export function getChat(argu) {
   return request.get(`consult/api/chat/${ argu.id }`);
}
