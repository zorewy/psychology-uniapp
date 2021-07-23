module.exports = {
   HTTP_REQUEST_URL:'https://openapi.chuanglx.com/',
   HOST_URL: 'https://openapi.chuanglx.com/',
   H5_URL: 'https://openapi.chuanglx.com/',
   BASE_URL:'https://openapi.chuanglx.com/',
   // Socket链接 暂不做配置
   WSS_SERVER_URL: 'wss://openapi.chuanglx.com/wss/',


  // 请求头
  HEADER:{
    'Content-Type': 'application/json'
  },
  // Socket调试模式
  SERVER_DEBUG:true,
  // 心跳间隔
  PINGINTERVAL:3000,
  // 回话密钥名称 
  TOKENNAME: 'Authorization',
  //用户信息缓存名称
  CACHE_USERINFO:'USERINFO',
  //token缓存名称
  CACHE_TOKEN:'TOKEN',
  //token过期事件
  CACHE_EXPIRES_TIME:'EXPIRES_TIME',
  //模板缓存
  CACHE_SUBSCRIBE_MESSAGE:'SUBSCRIBE_MESSAGE',
  //用户信息缓存名称
  CACHE_USERINFO: 'USERINFO',
  //缓存经度
  CACHE_LONGITUDE: 'LONGITUDE',
  //缓存纬度
  CACHE_LATITUDE: 'LATITUDE',
}