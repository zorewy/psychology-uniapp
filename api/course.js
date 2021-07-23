import request from "./../utils/request.js";

export function addActivity(argu) {
  return request.post('activity', argu)
}

export function getCourseList(argu) {
  return request.post('usercenter/cms/lesson/page', argu)
}

export function getLessonList(argu) {
  return request.get(`usercenter/lesson/list/${ argu.articleId }`)
}

export function getArticleDetail(argu) {
  return request.get(`usercenter/cms/article/${ argu.articleId }`)
}

export function classHourList(argu) {
  return request.get(`usercenter/lesson/list/${ argu.articleId }`)
}

export function classHourdetail(argu) {
  return request.get(`usercenter/lesson/${ argu.id }`)
}


export function getEvaluateList(argu) {
  return request.post('usercenter/cms/note/page', argu)
}

export function getLessonCate(argu) {
  return request.get(`usercenter/cms/category/${ argu.cate }`)
}

export function getCourseDetails(argu) {
  return request.get(`usercenter/cms/course/${ argu.articleId }`)
}

