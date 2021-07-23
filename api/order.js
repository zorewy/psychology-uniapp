import request from "./../utils/request.js";

export function postPay(argu) {
  return request.post('usercenter/pay', argu)
}

export function getOrderDetail(argu) {
  return request.get(`usercenter/trade/view/${ argu.id }`)
}

export function postOrderList(argu) {
  return request.post('usercenter/trade/page', argu)
}

export function postCreateOrder(argu) {
  return request.post('usercenter/trade/create', argu)
}

export function getTradeRpt(argu) {
  return request.get('usercenter/trade/tradeRpt', argu)
}

