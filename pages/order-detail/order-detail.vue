<template>
	<view>
		<view class="order">
			<view class="cart-location-wrap">
				<text class="iconfont icon-dingwei"></text>
				<image :src="orderDetails.consultant.imageUrl" mode="aspectFill"></image>
				<view class="cart-location-content">
					<block>
						<view class="cart-user-info">
							<view>
								<text class="name">{{orderDetails.consultant.username}}</text>
								<text class="biaoqian">{{orderDetails.consultant.qualifyName}}</text>
							</view>
						</view>
						<view class="cart-location-info">
							<text>{{orderDetails.consultant.style}}</text>
						</view>
					</block>
				</view>
			</view>
			<u-gap height="40" bg-color="#F3F4F8"></u-gap>
			<!-- 预约信息 -->
			<block>
				<view class="header">
					<view class="head">
						<text class="title">预约信息</text>
					</view>
				</view>
				<u-cell-group>
					<u-cell-item title="咨询方式" value="图文咨询" :arrow="false" v-if="orderDetails.busiInfo=='WORD'">
					</u-cell-item>
					<u-cell-item title="咨询方式" value="电话咨询" :arrow="false" v-if="orderDetails.busiInfo=='TEL'">
					</u-cell-item>
					<u-cell-item title="咨询方式" value="面谈咨询" :arrow="false" v-if="orderDetails.busiInfo=='FACE'">
					</u-cell-item>
					<u-cell-item title="咨询人" :value="orderDetails.detail.userName" :arrow="false"></u-cell-item>
				</u-cell-group>
			</block>
			<u-gap height="40" bg-color="#F3F4F8"></u-gap>
			<!-- 订单状态 -->
			<block>
				<view class="header">
					<view class="head">
						<text class="title">订单状态</text>
					</view>
					<view v-for="(i) in tradeStateList" v-if="orderDetails.tradeState==i.dictValue">
						<u-tag :text="i.dictLabel" />
					</view>
				</view>
				<u-cell-group>
					<u-cell-item title="订单编号" :value="orderDetails.id" :arrow="false"></u-cell-item>
					<u-cell-item title="应付金额" :value="orderDetails.amount" :arrow="false"></u-cell-item>
					<u-cell-item title="下单时间" :value="orderDetails.createDate" :arrow="false"></u-cell-item>
					<u-cell-item title="付款时间" :value="orderDetails.paymentDate" :arrow="false"></u-cell-item>
					<u-cell-item title="确认时间" :value="orderDetails.confirmDate" :arrow="false"></u-cell-item>
				</u-cell-group>
			</block>
			<u-gap height="40" bg-color="#F3F4F8"></u-gap>
			<block>
				<view class="lay">
					<u-row gutter="16" justify="center">
						<u-col span="4">
							<view class="layout bg-purple">预约日期</view>
						</u-col>
						<u-col span="4">
							<view class="layout bg-purple">开始时间</view>
						</u-col>
						<u-col span="4">
							<view class="layout bg-purple">结束时间</view>
						</u-col>
					</u-row>
					<u-row gutter="16" justify="center" v-for="(item,index) in timeList" :key="tradeStateList.id">
						<u-col span="4">
							<view class="layout">{{item.consultDate}}</view>
						</u-col>
						<u-col span="4">
							<view class="layout">{{item.startTime}}</view>
						</u-col> 
						<u-col span="4">
							<view class="layout">{{item.endTime}}</view>
						</u-col>
					</u-row>
				</view>
			</block>
		</view>

		<view class="bottom" v-for="(item,index) in orderLists" :key="item.id">
			<view class="revoke" bindtap="cancelOrder">删除订单</view>
			<view class="modify" bindtap="goOrderConfirm" :data-store-id="item.storeId">再次购买</view>
		</view>
	</view>
</template>

<script>
	import {
		getOrderDetail
	} from '@/api/order.js';
	export default {
		data() {
			return {
				orderDetails: [],
				tradeStateList: [],
				timeList:[]
			}
		},
		onLoad(e) {
			this.orderDetail(e)
			this.getDictData()
		},
		methods: {
			orderDetail(e) {
				let argu = {
					id: e.id
				}
				getOrderDetail(argu).then((res) => {
					this.orderDetails = res.data
					this.timeList =res.data.timeList
				})
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
				console.log(tradeStateList)
			}
		}
	}
</script>

<style scoped lang="less">
	.order {
		display: block;
	}

	.cart-location-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #fff;
		padding: 20upx 24upx;
		border-radius: 20upx;

		image {
			width: 88upx;
			height: 88upx;
			color: #8894a8;
		}

		.cart-location-content {
			margin-left: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			text-align: left;
			overflow: hidden;


			.add-location-warn {
				font-size: 28upx;
				color: #999999;
			}

			.location-text-btn {
				font-size: 28upx;
				margin-top: 16upx;
				color: #E54148;
			}

			.cart-user-info {
				font-size: 24upx;
				color: #333333;
				text-overflow: ellipsis;
				white-space: nowrap;

				.name {
					margin-right: 40upx;
					font-size: 32upx;
				}
			}

			.cart-location-info {
				flex: 1;
				font-size: 28upx;
				margin-top: 16upx;
				color: #666666;
				text-overflow: ellipsis;
				white-space: nowrap;

				text {
					margin-right: 10upx;
				}
			}


			.cart-location-info {
				flex: 1;
				font-size: 28upx;
				margin-top: 16upx;
				color: #666666;
				text-overflow: ellipsis;
				white-space: nowrap;

				text {
					margin-right: 10upx;
				}
			}
		}
	}

	.biaoqian {
		background-color: #f1f1f1;
		color: #333;
		padding: 4upx 8upx;
		border-radius: 20upx;
		font-size: 20upx;
	}

	.header {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 10rpx 32rpx;

		.head {
			color: #222222;
			font-size: 32upx;

		}
	}

	.lay {
		width: 100%;
		padding: 10rpx 32rpx;
		background-color: #ffffff;
	}

	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}

	.van-count-down {
		color: #e54148;
	}

	.card .card-footer .accual-pay text {
		color: #E54148;
	}

	.name {
		font-size: 30upx;
		color: #444;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.pintag {
		background: linear-gradient(to right, #ff5041, #ff695c);
		color: #fff;
		font-size: 20upx;
		padding: 1upx 8upx;
		border-radius: 6upx;
		font-weight: bold;
		margin-right: 10upx;
	}

	.mount {
		font-size: 24upx;
		color: #aaa;
		margin-top: 10upx;
	}

	.bottom-info {
		display: flex;
		justify-content: space-between;
		font-size: 28upx;
		margin-top: 18upx;
	}

	.total {
		display: flex;
		font-size: 28upx;
		margin-top: 18upx;
		justify-content: flex-end;
	}

	.bottom .left {
		margin-right: 10upx;
	}

	.bottom .right {
		color: #e54148;
	}


	.bottom-info text {
		color: #444;
	}


	.button-group {
		display: flex;
	}

	.cancel-order {
		position: relative;
		color: #666;
		width: 136upx;
		height: 52upx;
		line-height: 52upx;
		font-size: 24upx;
		text-align: center;
	}

	.cancel-order::after {
		box-sizing: border-box;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		transform: scale(0.5);
		transform-origin: 0 0;
		border: 2upx solid #b6b6b6;
		border-radius: 52upx;
		pointer-events: none;
	}

	.go-pay {
		border: 2upx solid #e54148;
		border-radius: 52upx;
		color: #e54148;
		width: 136upx;
		height: 52upx;
		line-height: 52upx;
		font-size: 24upx;
		text-align: center;
	}



	.paid {
		display: flex;
		justify-content: flex-end;
	}

	.paid .deepen {
		color: #333;
	}

	.paid .goln {
		color: #e54148;
	}

	.creation-time {
		display: flex;
		justify-content: space-between;
		line-height: 56upx;
	}

	.creation-time text {
		font-size: 30upx;
		color: #333;
	}

	.channel {
		display: flex;
		justify-content: space-between;
		line-height: 56upx;
	}

	.channel text {
		font-size: 30upx;
		color: #333;
	}

	.button {
		display: flex;
		justify-items: flex-end;
		justify-content: flex-end;
		align-items: center;
	}

	.del {
		border-radius: 40upx;
		background-color: #fff;
		width: 180upx;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
		margin-right: 20upx;
	}

	.del text {
		font-size: 28upx;
	}

	.again {
		border-radius: 40upx;
		background-color: #fff;
		width: 180upx;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
	}

	.again text {
		font-size: 28upx;
	}

	.bottom {
		display: flex;
		justify-content: flex-end;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 98upx;
		background-color: #fff;
		align-items: center;
	}

	.revoke {
		font-size: 26upx;
		border: 1upx solid #cccccc;
		height: 52upx;
		width: 180upx;
		text-align: center;
		border-radius: 36upx;
		line-height: 52upx;
		margin-right: 20upx;
	}

	.modify {
		font-size: 26upx;
		border: 1upx solid #e54148;
		height: 52upx;
		width: 180upx;
		text-align: center;
		border-radius: 36upx;
		line-height: 52upx;
		margin-right: 20upx;
		color: #e54148;
	}

	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 40rpx 0;
	}

	.layout {
		height: 80rpx;
		border-radius: 8rpx;
	}
	.u-row {
		border-bottom: 1rpx solid #f1f1f1;
		line-height: 80upx;
	}

	.bg-purple {
		font-weight: 500;
		font-size: 30upx;
		color: #333333;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>
