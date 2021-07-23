const BASE_URL = uni.BASE_URL
// const userinfo = uni.getStorageSync('userinfo')
export const checkUserinfo = () => {
	var token = getApp().globalData.token
	if (!token) {
		setTimeout(function() {
			uni.navigateTo({
				url: '/pages/login/login',
			});
		}, 1500)
	} else {
		console.log("登录成功")
	}
	// return userinfo
}

export const wx_login = (e) => {
	// #ifdef H5
	// var appid=set.h5.appid
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/micromessenger/i) == 'micromessenger') {
		function GetQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
			var context = "";
			if (r != null)
				context = r[2];
			reg = null;
			r = null;
			return context == null || context == "" || context == "undefined" ? "" : context;
		}
		var code1 = GetQueryString('code')
		localStorage.setItem('code', code1)
		var code = localStorage.getItem('code')
		if (code == null || code === '') {
			var H5_URL = window.location.href.split('#')[0]
			//var H5_URL=uni.H5_URL
			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +
				'&redirect_uri=' + encodeURIComponent(H5_URL) +
				'&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'

		} else {
			console.log(code)
			//window.location.href ='https://h5.sxjiangyan.com/#/'
			const BASE_URL = uni.BASE_URL
			uni.request({
				url: BASE_URL + 'index/user/gzh_code',
				data: {
					code: code,
					pid: pid
				},
				method: 'POST',
				success: (res) => {
					console.log(res.data);
					var userinfo = {}
					userinfo.uid = res.data.data.uid
					userinfo.phone = res.data.data.phone
					userinfo.token = res.data.data.token
					userinfo.userdata = res.data.data
					uni.setStorageSync('userinfo', userinfo)
					uni.showToast({
						title: '登录成功！'
					})
					uni.switchTab({
						url: '/pages/index/index'
					})
				},
				fail: (res) => {
					console.log(res.data);
				}
			});
		}
	}
	// #endif
	// #ifdef MP-WEIXIN
	// if (uni.getUserProfile) {
		console.log(e)
		uni.getUserProfile({
			desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			success: (infoRes) => {
				console.log(infoRes);
				console.log(infoRes.userInfo);
				if (!userinfo || userinfo == '') {
					var userinfo = {}
					userinfo.wxinfo = infoRes.userInfo
				} else {
					userinfo.wxinfo = infoRes.userInfo
				}
				uni.setStorageSync('userinfo', userinfo);

				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						const BASE_URL = uni.BASE_URL
						const code = loginRes.code
						uni.request({
							url: BASE_URL + 'usercenter/auth/wxauth',
							data: {
								code: code
							},
							method: 'POST',
							success: (res) => {
								let openid = res.data.data.openid
								let unionid = res.data.unionid
								var userinfo = uni.getStorageSync('userinfo');
								let token = res.data.data.token
								let code = res.data.code
								let nickname = res.data.data.nickname
								userinfo.userdata = res.data.data
								if (code=='10020' || code=='10023' || code=='10025') {
									uni.showModal({
									    title: '确认登陆',
									    content: '用手机号已完成登陆',
									    success: function (res) {
									        if (res.confirm) {
									            console.log('用户点击确定');
												console.log(res)
												if (res.detail.errMsg == "getPhoneNumber:ok") {
												        console.log(res)
												        var phone = res.phoneNumber
												        console.log(phone)
												        uni.checkSession({
												          success: (res) => {
												            console.log(res)
												            let argu = {
												              phone: phone
												            }
												            uni.request({
												            	url: BASE_URL + 'usercenter/auth/bindWechat',
												            	data: {
												            		avatarUrl: userinfo.wxinfo.avatarUrl,
												            		country: userinfo.wxinfo.country,
												            		province: userinfo.wxinfo.province,
												            		city: userinfo.wxinfo.city,
												            		openid: openid,
												            		nickName: userinfo.wxinfo.nickName,
												            		gender: userinfo.wxinfo.gender
												            	},
												            	header: {
												            		Authorization: token
												            	},
												            	method: 'POST',
												            	success: (res) => {
												            		console.log(res.data);
												            		var userinfo = uni
												            			.getStorageSync(
												            				'userinfo');
												            		uni.setStorageSync(
												            			'userinfo',
												            			userinfo)
												            		uni.showToast({
												            			title: '登录成功！'
												            		})
												            		uni.switchTab({
												            			url: '/pages/user/user'
												            		})
												            	},
												            	fail: (res) => {
												            		console.log(res.data);
												            	}
												            });
												          },
												          fail:(res) => {
												            console.log("session_key过期")
												            this.wxLogin();
												          }
												        })
												    }
												
									        } else if (res.cancel) {
									            console.log('用户点击取消');
												uni.showToast({
												    title: '登录失败',
												    duration: 2000
												});
									        }
									    }
									});
									
								} else {
									uni.request({
										url: BASE_URL +
											'usercenter/auth/bindWechat',
										data: {
											avatarUrl: userinfo.wxinfo
												.avatarUrl,
											country: userinfo.wxinfo
												.country,
											province: userinfo.wxinfo
												.province,
											city: userinfo.wxinfo.city,
											openid: openid,
											nickName: userinfo.wxinfo
												.nickName,
											gender: userinfo.wxinfo
												.gender
										},
										header: {
											Authorization: token
										},
										method: 'POST',
										success: (res) => {
											console.log(res.data);
											var userinfo = uni
												.getStorageSync(
													'userinfo');
											uni.setStorageSync(
												'userinfo',
												userinfo)
											uni.showToast({
												title: '登录成功！'
											})
											uni.switchTab({
												url: '/pages/user/user'
											})
										},
										fail: (res) => {
											console.log(res.data);
										}
									});
								}
							},
							fail: (res) => {
								console.log(res.data);
							}
						});

					}
				});

			},
		})



	// #endif
	// #ifdef APP-PLUS || MP-TOUTIAO || MP-ALIPAY || MP-BAIDU || MP-360 || MP-QQ
	var apptype = 'APP-PLUS'
	const userinfo = uni.getStorageSync('userinfo');
	uni.login({
		provider: 'weixin',
		success: function(loginRes) {
			console.log(loginRes);
			const BASE_URL = uni.BASE_URL
			uni.request({
				url: BASE_URL + 'index/user/app_wxauth',
				data: {
					token: loginRes.authResult.access_token,
					openid: loginRes.authResult.openid,
					apptype: apptype,
					pid: pid
				},
				method: 'POST',
				success: (res) => {
					console.log(res.data);
					var userinfo = {}
					userinfo.uid = res.data.data.uid
					userinfo.phone = res.data.data.phone ? res.data.data.phone : ''
					userinfo.token = res.data.data.token
					userinfo.userdata = res.data.data
					uni.setStorageSync('userinfo', userinfo)
					uni.showToast({
						title: '登录成功！'
					})
					uni.switchTab({
						url: '/pages/user/user'
					})
				},
				fail: (res) => {
					console.log(res.data);
				}
			});

		}
	});

	// #endif
}
