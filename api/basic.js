import request from "./../utils/request.js";

/**
 * 获取banner图
 */
export function getIndexInfo(argu) {
   return request.get('usercenter/index',argu);
}

export function getLoginOut(argu) {
   return request.get('usercenter/auth/logout',argu);
}

/**
 * 课程评价
 */
export function postCms(argu) {
   return request.post('usercenter/cms/note',argu);
}

/**
 * 咨询师评价
 */
export function postConsultant(argu) {
	return request.post('usercenter/consultant/note',argu);
}

/**
 * 消息通知
 */
export function getNotice(argu) {
	return request.get('consult/api/chat',argu);
}
