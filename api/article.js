import request from "./../utils/request.js";
// 文章列表
export function postArticleList(argu) {
   return request.post('usercenter/cms/article/page',argu);
}

export function getArticleDetail(argu) {
  return request.get(`usercenter/cms/article/${ argu.id }`)
}
// 测评列表
export function postAssessList(argu) {
   return request.post('usercenter/cms/assess/page',argu);
}

export function getAssessDetail(argu) {
  return request.get(`usercenter/cms/assess/${ argu.id }`)
}
