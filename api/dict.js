import request from "./../utils/request.js";

export function getDictData(argu) {
  return request.post('sys/dict/type/all', argu,{noAuth:true})
}

export function getMessage() {
  return request.get('consult/api/index')
}