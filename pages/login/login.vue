<template>
	<view class="container">
		<view class="container1">
			<view class="container1-img1">
				<image src="../../static/top-c1.png" mode="aspectFit"></image>
			</view>
			<view class="container1-img2">
				<image src="../../static/bot-c2.png" mode="aspectFit"></image>
			</view>
			<!-- #ifdef H5 -->
			<view class="middle">
				<view class="middle-item">
					<image src="../../static/account-icon.png" mode="aspectFit"></image>
					<input type="text" value="" placeholder="请输入您的手机号" placeholder-class="placeholder"
						@input="phoneinput" />
				</view>
				<view class="middle-item" v-if="reg || bindphone || forget">
					<image src="../../static/code.png" mode="aspectFit"></image>
					<input class="code" type="text" value="" placeholder="请输入您的验证码" placeholder-class="placeholder"
						@input="change_code" />
					<button class="getcode" @click="getcode" :disabled="flag">{{timetext}}</button>
				</view>
				<view class="middle-item" v-if="!bindphone">
					<image src="../../static/password-icon.png" mode="aspectFit"></image>
					<input type="password" value="" placeholder="请输入您的登录密码" placeholder-class="placeholder"
						@input="change_password" />
				</view>
				<view class="middle-item" v-if="reg">
					<image src="../../static/password-icon.png" mode="aspectFit"></image>
					<input type="password" value="" placeholder="请再次输入您的密码" placeholder-class="placeholder"
						@input="change_repassword" />
				</view>
				<view class="middle-item loginbtn" v-if="reg || bindphone || forget" @click="regbtn">
					<text v-if="reg">立即注册</text>
					<text v-if="forget">修改密码</text>
					<text v-if="bindphone">绑定手机号</text>
				</view>
				<view class="middle-item loginbtn" v-if="!reg &&!bindphone && !forget" @click="login">
					<text>立即登录</text>
				</view>
				<view class="info" v-if="reg &&!bindphone">
					<text class="regbtn" @click="login_now">返回登录</text>
				</view>
				<view class="info" v-if="!reg &&!bindphone && !forget">
					<text>还没有账号?</text><text class="regbtn" @click="reg_now">立即注册</text>|<text class="regbtn"
						@click="forget_pwd">忘记密码?</text>
				</view>
				<view class="info" v-if="bindphone">
					<text style="color: #DD524D;">请您绑定手机号,如手机号已被占用,请点击</text><text class="regbtn"
						@click="qhzh">切换账号</text>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN || APP-PLUS -->
			<view class="bottom" v-if="!reg &&!bindphone">
				<view class="logintype">
					一键登录方式
				</view>
				<button class="wechat-login" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<!-- @click="wxlogin" -->
					<image src="../../static/wechat.png" mode="aspectFit"></image>
				</button>
			</view>
			<!-- #endif -->
		</view>
		<Modal v-model="show" title='提示' text='描述文字' @cancel='cancel' @confirm='confirm' @event='event' />
	</view>
</template>

<script>
	import {
		postDecrypt,
		postWxauth,
		bindWechat
	} from '@/api/userinfo';
	import {
		sendSms,
		postRegister,
		postLogin,
		postResetPwd
	} from '@/api/login_reg.js';
	import Modal from '@/components/x-modal/x-modal'
	export default {
		components: {
			Modal
		},
		data() {
			return {
				reg: false,
				forget: false,
				phonenum: '',
				code: '',
				password: '',
				repassword: '',
				flag: false,
				timetext: '获取验证码',
				bindphone: false,
				openId: '',
				sessionKey: '',
				adopt: false
			};
		},

		onLoad(e) {
			var bindphone1 = e.bindphone
			if (bindphone1 == 1) {
				this.bindphone = true
			}
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.loadLogin()
			// #endif


			// #ifdef H5
			var userinfo = uni.getStorageSync('userinfo')
			if (!userinfo) {
				this.loadLogin()
			} else {
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1000)
			}
			// #endif
			// #ifndef H5
			var userinfo = uni.getStorageSync('userinfo')
			if (userinfo && userinfo.userdata) {
				if (!this.bindphone) {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			}
			// #endif
		},
		methods: {
			qhzh() {
				uni.showModal({
					title: '提示',
					content: '确定要切换账号吗？',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorageSync('userinfo')
							uni.switchTab({
								url: '/pages/index/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			loadLogin: function() {
				let that = this
				uni.login({
					success: res => {
						let code = res.code
						let argu = {
							code: code
						}
						postWxauth(argu).then((res) => {
							if (res.code == '0') {
								that.adopt = true
								that.code = res.code
								uni.setStorageSync('userinfo', res.data)
								getApp().globalData.token = res.data.token
								getApp().globalData.openid = res.data.wechat
								console.log(getApp().globalData.token)
								uni.switchTab({
									url: '/pages/index/index'
								})
							} else {
								that.adopt = true
								that.openId = res.data.openId,
									that.sessionKey = res.data.session_key,
									that.code = res.code
								uni.setStorageSync('openId', res.data.openId)
								uni.setStorageSync('sessionKey', res.data.session_key)
							}
						})
					}
				});
			},
			// wxlogin(){
			// 	let openId = this.openId
			// 	wx_login(openId)
			// },
			getPhoneNumber: function(e) {

				if (this.adopt == true) {
					this.verifyLogin(e)
				} else {
					this.loadLogin();
					this.verifyLogin(e)
				}

			},
			verifyLogin: function(e) {
				console.log(e)
				const code = this.code
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					if (code == '10020' || code == '10025' || code == '10024') {
						console.log(this.sessionKey)
						let argu = {
							session_key: this.sessionKey,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}
						postDecrypt(argu).then((res) => {
							console.log(res)
							var phone = res.data.phoneNumber
							console.log(phone)
							uni.checkSession({
								success: (res) => {
									uni.showModal({
										title: '完善资料',
										content: '请授权获取微信头像及昵称',
										success: function(res) {
											uni.getUserProfile({
												desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
												success: (infoRes) => {
													console.log(infoRes);
													var user = infoRes
														.userInfo
													// var user1 =JSON.parse(JSON.stringify(user).replace(/avatarUrl/g,"label"));
													user.firstName =
														"Thomas";
													// uni.setStorageSync('userinfo', user);
													var openid = uni
														.getStorageSync(
															'openId')
													var user = infoRes
														.userInfo
													var that = this
													console.log(openid)
													let argu = {
														avatarUrl: user
															.avatarUrl,
														country: user
															.country,
														province: user
															.province,
														city: user
															.city,
														openid: openid,
														nickName: user
															.nickName,
														gender: user
															.gender,
														mobile: phone
													}
													bindWechat(argu).then((
														res) => {
														if (res
															.code ==
															'0') {
															console
																.log(
																	res
																	)
															uni.setStorageSync(
																'token',
																res
																.data
																);
															getApp
																()
																.globalData
																.token =
																res
																.data
															uni.switchTab({
																url: '/pages/index/index'
															})
														} else {
															console
																.log(
																	"绑定失败"
																	)
														}
													})
												}
											})
										}
									})
								}
							})
						})

					} else if (code == '10023') {
						if (e.detail.errMsg == "getPhoneNumber:ok") {
							console.log(this.sessionKey)
							var openid = uni.getStorageSync('openId')
							let argu = {
								session_key: this.sessionKey,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv
							}

							postDecrypt(argu).then((res) => {
								console.log(res)
								var phone = res.data.phoneNumber
								let argu = {
									openid: openid,
									mobile: phone
								}
								bindWechat(argu).then((res) => {
									if (res.code == '0') {
										console.log(res)
										uni.setStorageSync('token', res.data);
										getApp().globalData.token = res.data
										uni.switchTab({
											url: '/pages/index/index'
										})
									} else {
										console.log("绑定失败")
									}
								})
							})
						}
					} else {
						var userinfo = uni.getStorageSync('userinfo')
						if (userinfo) {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					}
				}
			},
			phoneinput(e) {
				this.phonenum = e.detail.value
			},
			reg_now() {
				this.reg = true;
			},
			forget_pwd() {
				this.forget = true;
			},
			login_now() {
				this.reg = false;
			},
			change_code(e) {
				this.code = e.detail.value
			},
			change_password(e) {
				this.password = e.detail.value
			},
			change_repassword(e) {
				this.repassword = e.detail.value
			},
			login() {
				var that = this;
				let phone = that.phonenum;
				let password = that.password;
				if (phone == '') {
					uni.showToast({
						title: '手机号码不能为空',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
					uni.showToast({
						title: '手机号码格式不正确,请重试',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (password == '') {
					uni.showToast({
						title: '密码不能为空',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				let argu = {
					mobile: phone,
					password: password
				}
				postLogin(argu).then((res) => {
					console.log(res)
					if (res.code === 0) {
						uni.showToast({
							title: '登陆成功',
							duration: 1500
						});
						uni.setStorageSync('userinfo', res.data);
						uni.navigateBack({
							delta: 1
						});
					} else {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: 'none'
						});
					}
				});
			},
			regbtn() {
				var that = this;
				const userinfo = uni.getStorageSync('userinfo');
				let phone = that.phonenum;
				let code = that.code;
				let password = that.password;
				let repassword = that.repassword;
				if (phone == '') {
					uni.showToast({
						title: '手机号码不能为空',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
					uni.showToast({
						title: '手机号码格式不正确,请重试',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (code == '') {
					uni.showToast({
						title: '验证码不能为空',
						duration: 2000,
						icon: 'none'
					});
					return false;
				} else {
					var re = /^\d{4}$/;
					if (!re.test(code)) {
						uni.showToast({
							title: '验证码格式不正确',
							duration: 2000,
							icon: 'none'
						});
						return false;
					}
				}
				if (that.reg == true) {
					if (password == '') {
						uni.showToast({
							title: '密码不能为空',
							duration: 2000,
							icon: 'none'
						});
						return false;
					} else {
						var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
						if (!re.test(password)) {
							uni.showToast({
								title: '密码至少包含大写字母，小写字母，数字，且不少于8位',
								duration: 2000,
								icon: 'none'
							});
							return false;
						}
					}
					if (repassword == '') {
						uni.showToast({
							title: '确认密码不能为空',
							duration: 2000,
							icon: 'none'
						});
						return false;
					} else {
						var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
						if (!re.test(repassword)) {
							uni.showToast({
								title: '密码至少包含大写字母，小写字母，数字，且不少于8位',
								duration: 2000,
								icon: 'none'
							});
							return false;
						}
					}
					if (repassword != password) {
						uni.showToast({
							title: '两次密码不一致,请重试',
							duration: 2000,
							icon: 'none'
						});
						return false;
					}
					let argu = {
						mobile: phone,
						password: password
					}
					postRegister(argu).then((res) => {
						console.log(res)
						if (res.code == 0) {
							uni.showToast({
								title: '注册成功',
								duration: 1500
							});
							setTimeout(function() {
								uni.showModal({
									title: '注册成功',
									content: '是否立即登录？',
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
											that.reg = false;
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
							}, 1500)
						} else {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: 'none'
							});
						}
					})

				} else if (that.bindphone == true) {
					uni.request({
						url: BASE_URL + 'index/user/bindphone',
						data: {
							uid: userinfo.userdata.id,
							phone: phone,
							code: code,
						},
						method: 'POST',
						success: (res) => {
							console.log(res.data);
							if (res.data.code == "0") {
								uni.showToast({
									title: res.data.msg,
									duration: 1500
								});
								userinfo.phone = phone
								userinfo.userdata = res.data
								// uni.setStorageSync('userinfo',userinfo)
								setTimeout(function() {
									uni.navigateBack()
								}, 1000)

							} else {
								uni.showToast({
									title: res.data.msg,
									duration: 2000,
									icon: 'none'
								});
							}
						},
						fail: (res) => {
							console.log(res.data);
						}
					});
				} else if (that.forget == true) {
					let argu = {
						mobile: phone,
						password: password,
						smsCode: code
					}
					postResetPwd(argu).then((res) => {
						console.log(res)
						if (res.code == 0) {
							uni.showToast({
								title: '修改成功',
								duration: 1500
							});
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)
						} else {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: 'none'
							});
						}
					})

				}
			},
			//发送验证码
			getcode() {
				var that = this
				var time = 60;
				//设置点击标记，防止60内再次点击生效
				var phone = that.phonenum;
				const BASE_URL = uni.BASE_URL
				if (phone == '') {
					uni.showToast({
						title: '手机号码不能为空',
						duration: 2000,
						icon: 'none'
					});
					return false;
				} else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
					uni.showToast({
						title: '手机号码格式不正确,请重试',
						duration: 2000,
						icon: 'none'
					});
					return false;
				} else {
					that.flag = true;
				}
				if (that.flag) {
					var timer = setInterval(function() {
						if (time == 60 && that.flag) {
							that.flag = false;
							let argu = {
								mobile: phone,
								smsType: "REGISTER"
							}
							sendSms(argu).then((res) => {
								console.log(res)
								if (res.Code == 200) {
									uni.showToast({
										title: '已发送',
										duration: 2000
									});
								}
							})
						} else if (time == 0) {
							clearInterval(timer);
							time = 60;
							that.flag = false;
							that.timetext = "获取验证码"
						} else {
							that.flag = true;
							that.timetext = time + ' s'
							time--;
						}
					}, 1000);
				}
			}
		}
	}
</script>
<style lang="less">
	page {
		background-color: #fff;
		font-size: 35upx;
		font-family: SimHei;
		color: #262626;
	}

	.container1 {
		&-img1 {
			width: 243upx;
			height: 270upx;
			position: absolute;
			top: 0;
			left: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		&-img2 {
			width: 218upx;
			height: 350upx;
			position: absolute;
			bottom: 150upx;
			right: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.middle {
			margin-top: 150upx;
			width: 100%;
			z-index: 99;

			&-item {
				display: flex;
				background-color: #e0e5ff;
				width: 75%;
				padding: 30upx 40upx;
				margin: 60upx auto;
				border-radius: 50upx;
				font-size: 30upx;

				image {
					width: 32upx;
					height: 40upx;
				}

				input {
					margin-left: 25upx;
				}

				.placeholder {
					font-size: 30upx;
				}

				.code {
					width: 50%;
					border-right: 1upx solid #ccc;
				}

				.getcode {
					text-align: center;
					display: flex;
					align-items: center;
					font-size: 30upx;
					background-color: transparent;
					line-height: inherit;
					margin: 0upx;
					padding-left: 20upx;
					padding-right: 0upx;
				}

				.getcode:after {
					border: none;
				}
			}

			.loginbtn {
				font-size: 35upx;
				display: flex;
				align-items: center;
				text-align: center;
				margin-top: 120upx;
				color: #fff;
				background-image: linear-gradient(to right, #a9b7ff, #3e5eff);
				background-size: 100% 100%;

				text {
					margin: 0 auto;
				}
			}

			.info {
				margin-top: 30upx;
				text-align: center;
				font-size: 30upx;
			}

			.regbtn {
				color: #3e5eff;
			}
		}

		.bottom {
			margin-top: 160upx;

			.logintype {
				text-align: center;
				font-size: 30upx;
			}

			.wechat-login {
				border: none;
				background-color: transparent;
				outline: none;
				margin-top: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 94upx;
					height: 94upx;
				}
			}

			.wechat-login::after {
				border: none;
				outline: none;
			}
		}

	}
</style>
