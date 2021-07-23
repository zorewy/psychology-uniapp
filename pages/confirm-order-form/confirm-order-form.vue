<template>
	<view class="container">

		<block v-if="goodstype=='CONSULT'">
			<view class="zx">
				<view class="zx-top">
					<text>咨询师</text>
				</view>

				<view class="zx-con">
					<view class="zx-con-img">
						<image :src="orderDetails.imageUrl"></image>
					</view>
					<view class="zx-con-in">
						<view class="zx-con-in-line1">{{orderDetails.consultantName}}</view>
						<view class="zx-con-in-line2">{{orderDetails.qualifyName}}</view>
					</view>
					<view class="zx-con-icon">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<!-- 订单内容 -->
			<view class="order">
				<view class="time">
					<view class="time-left">
						<text>咨询人</text>
					</view>
					<view class="time-right">
						<text>{{orderDetails.detail.userName}}</text>
					</view>
				</view>
				<view class="time">
					<view class="time-left">
						<text>咨询方式</text>
					</view>
					<view class="time-right">
						<text v-if="orderDetails.busiInfo ==='WORD'">图文咨询</text>
						<text v-if="orderDetails.busiInfo ==='VOICE'">图文咨询</text>
						<text v-if="orderDetails.busiInfo ==='TEL'">电话咨询</text>
						<text v-if="orderDetails.busiInfo ==='FACE'">图文咨询</text>
					</view>
				</view>
				<view class="time">
					<view class="time-left">
						<text>咨询时间</text>
					</view>
					<view class="time-right">
						<text>{{orderDetails.expireDate}}</text>
					</view>
				</view>
			</view>
		</block>

		<block v-else>
			<view class="zx-top">
				<text>订单信息</text>
			</view>
			<view class="order">
				<view class="time">
					<view class="time-left">
						<text>订单名称</text>
					</view>
					<view class="time-right">
						<text>{{orderDetails.remarks}}</text>
					</view>
				</view>
				<view class="time">
					<view class="time-left">
						<text>订单类型</text>
					</view>
					<view class="time-right">
						<text v-if="orderDetails.tradeType ==='COURSE'">课程订单</text>
						<text v-if="orderDetails.tradeType ==='LESSON'">课时订单</text>
						<text v-if="orderDetails.tradeType ==='ARTICLE'">文章订单</text>
						<text v-if="orderDetails.tradeType ==='ASSESS'">测评订单</text>
						<!-- <text v-if="courseOrder.tradeType ==='FACE'">图文咨询</text> -->
					</view>
				</view>
				<view class="time">
					<view class="time-left">
						<text>创建时间</text>
					</view>
					<view class="time-right">
						<text>{{orderDetails.expireDate}}</text>
					</view>
				</view>
			</view>
		</block>

		<!-- 订单备注 -->
		<view class="ddbz">
			<text>订单备注</text>
			<textarea placeholder="在此填写您对本次交易的说明" @input='changeRemarks' />
		</view>


		<!-- 支付方式 -->
		<view class="zffs">
			<view class="zhifu-mode">
				<text>请选择支付方式</text>
			</view>
			<radio-group @change="radioChange">
				<view class="zhifubao" v-for="(item, index) in items" :key="item.value">
					<view class="weixin-center" v-if="action!='credit' ">
						<image :src="item.icon" mode="aspectFit"></image>
						<text v-if="item.value!='balance' ">{{item.name}}</text>
						<text v-if="item.value=='balance' ">{{item.name}} (￥{{balance}})</text>
					</view>
					<view class="weixin-center" v-if="action=='credit' ">
						<image :src="item.icon" mode="aspectFit"></image>
						<text>{{item.name}} (当前积分:{{userinfo.credit}})</text>
					</view>
					<label class="radio">
						<radio :value="item.value" :checked="index === current" />
					</label>
				</view>
			</radio-group>
		</view>


		<!-- 支付 -->
		<view class="pay" v-if="action=='' ">
			<text>合计：</text>
			<text>￥{{total}}</text>
			<!-- #ifdef MP-WEIXIN -->
			<button @click="pay" open-type="getUserInfo">支付</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<button @click="pay">支付</button>
			<!-- #endif -->
		</view>


	</view>
</template>

<script>
	import {
		postPay
	} from '@/api/order.js'
	import {
		checkUserinfo
	} from '@/utils/checkUserinfo';
	export default {
		data() {
			return {
				addressinfo: '',
				courseinfo: [],
				goodsinfo: [],
				pxcourse: [],
				shopcarlist: false,
				carlistdata: [],
				goodstype: '',
				menuid: '',
				sonid: '',
				yhm: '',
				remarks: '',
				shr_name: '',
				shr_phone: '',
				carlistdataid: '',
				postage: 0,
				shoppingInfo: '',
				viptimeinfo: [],
				czmoney: 0,
				balance: '0.00',
				action: '', //判断传参行为
				creditinfo: {},
				userinfo: {},
				seckillinfo: {},
				pintuaninfo: {},
				orderDetails: [],
				courseOrder: [],
				username: '',
				imageUrl: '',
				qualifyName: '',
				items: [{
					value: 'wxpay',
					name: '微信支付',
					icon: '../../static/weixinzhifu.png',
				}],
				total: 0,
				current: 0,
				paytype: 'wxpay'
			};
		},

		onLoad(e) {
			console.log(e)
			this.goodstype = e.goodstype

			var courseOrder = getApp().globalData.courseOrder
			console.log(courseOrder)
			this.orderDetails = courseOrder
			this.total = courseOrder.amount
		},
		// onShow(e) {
		// 	console.log(e)
		// },

		onUnload() {
			uni.removeStorageSync('courseOrder')
			uni.removeStorageSync('course')
		},
		methods: {
			pay() {
				let userinfo = uni.getStorageSync('userinfo')
				var openid = getApp().globalData.openid
				if (openid.length > 0) {
					var type = this.goodstype
					if (this.paytype == '') {
						uni.showToast({
							title: '请选择支付方式',
							icon: 'none'
						})
						return false
					}

					if (this.total == 0) {
						let argu = {
							openId: openid,
							payChannel: 'WECHAT',
							payWay: 'WECHAT',
							tradeId: this.orderDetails.id
						}
						postPay(argu).then((res) => {

							console.log(type)
							if (res.code == 0) {
								uni.showToast({
									title: '支付成功！'
								})

								if (type == 'CONSULT') {
									setTimeout(function() {
										uni.navigateTo({
											url: `/pages/course-order/course-order?tradeType=` +
												type
										})
									}, 1000)
								} else {
									setTimeout(function() {
										var courseOrder = getApp().globalData.courseOrder
										var id = courseOrder.consultantId
										let pages = getCurrentPages();
										let prevPage = pages[pages.length - 2]; //上一页页面实例
										prevPage.$vm.id = id; //修改上一页data里面的tagIndex 参数值
										uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
											delta: 1
										});
									}, 1000)
								}


							} else {
								uni.showToast({
									title: res.msg
								})
							}
						})

					} else {
						if (this.paytype == 'wxpay') {
							// #ifdef  MP-WEIXIN
							let argu = {
								openId: openid,
								payChannel: 'WECHAT',
								payWay: 'WECHAT',
								tradeId: this.orderDetails.id
							}
							postPay(argu).then((res) => {
								var payData = res.data.payParams
								console.log(payData)
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.sign,
									success: function(res) {
										console.log('success:' + JSON.stringify(res));
										uni.showToast({
											title: '支付成功！'
										})
										if (type == 'CONSULT') {
											setTimeout(function() {
												uni.navigateTo({
													url: `/pages/course-order/course-order?tradeType=` +
														type
												})
											}, 1000)
										} else {
											setTimeout(function() {
												var courseOrder = getApp().globalData
													.courseOrder
												var id = courseOrder.consultantId
												let pages = getCurrentPages();
												let prevPage = pages[pages.length -
												2]; //上一页页面实例
												prevPage.$vm.id =
												id; //修改上一页data里面的tagIndex 参数值
												uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
													delta: 1
												});
											}, 1000)
										}


									},
									fail: function(err) {
										console.log('fail:' + JSON.stringify(err));
									}
								});
							});



							// #endif
							// #ifdef  APP-PLUS
							data.apptype = 'APP-PLUS'
							uni.request({
								url: BASE_URL + 'usercenter/pay',
								data: data,
								method: 'POST',
								success: (res) => {
									console.log(res.data);
									let paydata = res.data.data
									uni.requestPayment({
										provider: 'wxpay',
										orderInfo: paydata,
										success: function(res) {
											console.log('success:' + JSON.stringify(res));
											uni.showToast({
												title: '支付成功！'
											})
											setTimeout(function() {
												uni.switchTab({
													url: '../user/user'
												})
											}, 800)
										},
										fail: function(err) {
											console.log('fail:' + JSON.stringify(err));
										}
									});

								},
								fail: (res) => {
									console.log(res.data);
								}
							});
							// #endif
							// #ifdef H5
							var that = this
							if (this.$jwx && this.$jwx.isWechat()) {
								data.openid = openid
								data.apptype = 'H5'
								uni.request({
									url: BASE_URL + 'usercenter/pay',
									data: data,
									method: 'POST',
									success: (res) => {
										console.log(res.data);
										let paydata = res.data.data
										this.$jwx.wxpay({
											'timestamp': String(paydata.timeStamp),
											'nonceStr': paydata.nonceStr,
											'package': paydata.package,
											'signType': paydata.signType,
											'paysign': paydata.sign
										}, function(r) {
											if (r.errMsg == 'chooseWXPay:ok') {
												uni.showToast({
													title: '支付成功！'
												})
												setTimeout(function() {
													uni.switchTab({
														url: '../user/user'
													})
												}, 800)
											} else {
												uni.showToast({
													title: '支付失败!',
													icon: 'none'
												})
											}
										});

									},
									fail: (res) => {
										console.log(res.data);
									}
								});
							}
							// #endif
						}

						// balance pay end
						// alipay start
						else if (this.paytype == 'alipay') {
							// #ifdef  H5
							data.apptype = 'H5'
							uni.request({
								url: BASE_URL + 'usercenter/pay',
								data: data,
								method: 'POST',
								success: (res) => {
									let divForm = document.getElementsByTagName('divform')
									if (divForm.length) {
										document.body.removeChild(divForm[0])
									}
									const div = document.createElement('divform')
									div.innerHTML = res.data.body
									document.body.appendChild(div)
									document.getElementById('alipaysubmit').submit()
								},
								fail: (res) => {
									console.log(res.data);
								}
							});
							// #endif
							// #ifdef  APP-PLUS
							data.apptype = 'APP-PLUS'
							uni.request({
								url: BASE_URL + 'usercenter/pay',
								data: data,
								method: 'POST',
								success: (res) => {
									let paydata = res.data.body
									uni.requestPayment({
										provider: 'alipay',
										orderInfo: paydata,
										success: function(res) {

											uni.showToast({
												title: '支付成功！'
											})
											setTimeout(function() {
												uni.switchTab({
													url: '../user/user'
												})
											}, 800)
										},
										fail: function(err) {
											console.log('fail:' + JSON.stringify(err));
										}
									});
								},
								fail: (res) => {
									console.log(res.data);
								}
							});
							// #endif

						}

					}

				} else {
					uni.navigateTo({
					  url: '/pages/login/login',
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #F3F4F8;
		width: 100vw;
		box-sizing: border-box;
		padding: 20upx 28upx;
	}

	// 标题
	.zx {
		margin-top: 10upx;
		margin-bottom: 10upx;
		padding: 20upx 30upx;
		background-color: #fff;

		&-top {
			height: 80rpx;
			line-height: 80rpx;
			background: #ffffff;

			text {
				font-size: 26upx;
				font-weight: 700;
				color: #020202;
				margin-left: 15upx;
				margin-top: 4upx;
			}
		}

		// 咨询师信息
		&-con {
			display: flex;
			align-items: center;

			&-img {
				width: 158upx;
				height: 128upx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 10upx;
				}
			}

			&-in {
				text-align: left;
				margin-left: 20upx;
				flex: 7;

				&-line1 {
					font-size: 32upx;
					color: #222222;
				}

				&-line2 {
					font-size: 28upx;
					color: #666666;
				}
			}

			&-icon {
				flex: 1;
				text-align: right;
			}

		}
	}


	// 订单内容
	.time {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: 100%;
		padding: 26upx 32upx;
		font-size: 28upx;
		line-height: 54upx;
		color: #606266;
		background-color: #fff;
		text-align: left;
		justify-content: space-between;

		&-left {
			color: #333333;
		}

		&-right {
			color: #666666;
		}
	}

	// 订单备注
	.ddbz {
		font-size: 31upx;
		margin-top: 20upx;
		height: 150upx;
		background-color: #fff;
		padding: 0 35upx;
		padding-top: 20upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		text {
			color: #333;
		}

		textarea {
			width: 100%;
			height: 120upx;
			// background-color: orange;
			margin-top: 20upx;
		}
	}


	// 支付方式
	.zffs {
		padding: 0 30upx;
		margin-top: 20upx;
		font-size: 31upx;
		background-color: #fff;
		margin-bottom: 150upx;

		.zhifu-mode {
			font-size: 31upx;
			height: 70upx;
			border-bottom: 2upx solid #e5e5e5;
			line-height: 70upx;

			text {
				color: #333;
			}
		}

		.zhifubao {
			padding: 30upx 25upx;
			border-bottom: 2upx solid #e5e5e5;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.weixin-center {
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 54upx;
					height: 54upx;
				}

				text {
					margin-left: 15upx;
					font-size: 28upx;
					color: #666;
				}
			}

			.radio {}
		}
	}



	// 支付
	.pay {
		width: 100%;
		padding: 25upx 30upx;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: fixed;
		left: 0;
		bottom: 0;
		font-size: 30upx;

		text:nth-child(1) {
			color: #a7a7a7;
		}

		text:nth-child(2) {
			color: #000;
		}

		button {
			height: 68upx;
			margin: 0 0 0 30upx;
			outline: none;
			padding: 0 80upx;
			border: none;
			background-color: #1763ff;
			color: #fff;
			text-align: center;
			line-height: 68upx;
		}
	}
</style>
