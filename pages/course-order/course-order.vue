<template>
	<view class="container">
		<view class="nav-bar">
			<view class="nav-bar-inner">
				<view v-for="(item,index) in tabs" :key="item.id" :class="status==item.id?'current':'nav-bar-item'"
					:data-type="item.id" @click="getOrder(item.id)">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 没有任何订单图片 -->
		<view id="nodata" v-if="noData == true">
			<image src="../../static/no_data.png" mode="aspectFit"></image>
		</view>

		<!-- 课程订单 -->
		<view class="qiehuan-part-content" v-else>
			<view class="kc" :class="{dis:btnnum == 0}" :model="zhiboInfo">
				<!-- 课程订单购买列表 -->
				<view class="buy-list">
					<view class="buy-list-item" v-for="(item, index) in buyCourseList" :key="index">
						<view class="item-top" @click="goDetails(item.consultantId)">
							<image class="item-top-left" :src="item.imageUrl" mode="aspectFit"></image>
							<view class="item-top-right">
								<text>{{item.remarks}}</text>
								<text>订单号：{{item.id}}</text>
								<text decode>价格：{{item.amount}}</text>
								<!-- &emsp;付款方式：{{item.payType}}</text> -->
							</view>
						</view>

						<view class="item-bottom">
							<text class="price" v-for="(i) in tradeStateList"
								v-if="item.tradeState==i.dictValue">{{i.dictLabel}}</text>
							<text class="pingjia" v-if="item.tradeState === 8"
								@click="goEvaluate(item.id, item.consultantId)">评价</text>
							<text class="pingjia" v-if="item.tradeState === 1" @click="goConfirmOrder(item)">付款</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		checkUserinfo
	} from '@/utils/checkUserinfo';
	import {
		postOrderList
	} from '@/api/order.js';
	export default {
		data() {
			return {
				buyCourseList: [],
				btnnum: 0,
				noData: false,
				tradeType: "",
				tabs: [{
						id: 'null',
						name: '全部'
					},
					{
						id: '1',
						name: '待付款'
					},
					{
						id: '2',
						name: '已完成'
					},
					{
						id: '8',
						name: '待评价'
					}
				],
				tradeStateList: [],
				status: null,
			};
		},
		onLoad(e) {
			console.log(e)
			this.tradeType = e.tradeType
			this.getDictData()
		},

		onShow() {
			this.postMyCourse()
		},
		onReady() {
			let tradeType = this.tradeType
			if (tradeType == 'CONSULT') {
				uni.setNavigationBarTitle({
					title: '咨询订单'
				})
			}
			if (tradeType == 'COURSE') {
				uni.setNavigationBarTitle({
					title: '课程订单'
				})
			}
			if (tradeType == 'ASSESS') {
				uni.setNavigationBarTitle({
					title: '测评订单'
				})
			}
		},
		methods: {
			// 获取订单数据
			postMyCourse(e) {
				let argu = {
					tradeType: this.tradeType,
					tradeState: this.status
				}
				postOrderList(argu).then((res) => {
					console.log(res)
					if (res.code === 0) {
						console.log(res)
						this.buyCourseList = res.data.list
						if (res.data.list.length < 1) {
							this.noData = true
						} else {
							this.noData = false
						}
						this.showPageLoading = false
					}
				})
				if (e) {
					this.status = e.toString();
				} else {
					this.status = 'null'
				}
			},
			// goCourseDetails(id) {
			// 	console.log(id)
			// 	uni.navigateTo({
			// 		url: `/pages/course-details/course-details?id=${id}`
			// 	});
			// },
			goEstimate(menuid, media) {
				uni.navigateTo({
					url: `/pages/estimate/estimate?menuid=${menuid}&media=${media}`
				});
			},
			getOrder: function(e) {
				this.showPageLoading = true

				this.postMyCourse(e);
			},
			getDictData() {
				var dictData = uni.getStorageSync('dictData')
				var tradeStateList
				for (let i = 0; i < dictData.length; i++) {
					if (dictData[i].dictType == 'tradeState') {
						var tradeStateList = dictData[i].dataList
					}
				}
				this.tradeStateList = tradeStateList
			},
			goEvaluate(id, consultantId) {
				console.log(id)
				console.log(consultantId)
				let tradeType = this.tradeType
				if (tradeType == 'CONSULT') {
					uni.navigateTo({
						url: `/pages/evaluate/evaluate?id=${id}&consultantId=${consultantId}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/comment/comment?id=${id}&consultantId=${consultantId}`
					});
				}

			},
			goDetails(e) {
				let id = e
				let tradeType = this.tradeType
				if (tradeType == 'CONSULT') {
					uni.navigateTo({
						url: `/pages/tutor-introduced/tutor-introduced?id=${id}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/course-details/course-details?id=${id}`
					});
				}
			},
			goConfirmOrder(e) {
				let tradeType = this.tradeType
				getApp().globalData.courseOrder = e
				uni.navigateTo({
					url: "/pages/confirm-order-form/confirm-order-form?goodstype=" + tradeType
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	#nodata {
		width: 100%;
		height: 100vh;

		image {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -70%);
		}
	}

	.nav-bar {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;

		.nav-bar-inner {
			display: flex;
			justify-content: space-between;
			padding: 30upx;
			background-color: #fff;
		}

		.nav-bar-item {
			position: relative;
			word-break: keep-all;
			font-size: 28upx;
			color: #333;
			padding: 6upx 0;
			background: #F3F4F8;
			border-radius: 24upx;
			width: 128upx;
			text-align: center;
			transition: color 0.3s ease;
		}

		.current {
			color: #ff5757;
			background: #FDF0F2;
			position: relative;
			word-break: keep-all;
			font-size: 28upx;
			font-weight: 500;
			padding: 6upx 0;
			border-radius: 24upx;
			width: 128upx;
			text-align: center;
			transition: color 0.3s ease;
		}
	}

	.nav-bar-content {
		margin-top: 80upx;
		padding-bottom: 30upx;
		width: 100vw;
		padding: 20upx;
		box-sizing: border-box;
	}

	.kc {
		margin-top: 130upx;

		.buy-list {
			border-radius: 20upx;
			margin: 0 20upx;

			&-item {
				padding-bottom: 20upx;
				margin-top: 30upx;
				background-color: #fff;
				border-radius: 20upx;

				.item-top {
					display: flex;
					align-items: center;
					padding: 20upx 0;
					border-bottom: 2upx solid #ddd;

					&-left {
						width: 200upx;
						height: 148upx;
						border-radius: 10upx;
						margin-left: 20upx;
					}

					&-right {
						display: flex;
						margin-left: 42upx;
						flex-direction: column;

						text:nth-child(1) {
							font-size: 30upx;
							color: #333333;
						}

						text:nth-child(2) {
							font-size: 26upx;
							color: #666666;
							margin: 18upx 0;
						}

						text:nth-child(3) {
							font-size: 26upx;
							color: #666666;
						}
					}
				}

				.item-bottom {
					display: flex;
					justify-content: space-between;
					padding: 0upx 20upx;

					.price {
						font-size: 30upx;
						color: #333;
						margin: 20upx 20upx 0 0;
					}

					.pingjia {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 30upx;
						color: #ff5757;
						border-radius: 40upx;
						border: 2upx solid #ff5757;
						margin: 20upx 20upx 0 0;
						padding: 4rpx 20rpx;
					}
				}

			}
		}
	}

	.dis {
		display: block;
	}
</style>
