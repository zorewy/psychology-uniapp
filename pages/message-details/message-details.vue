
<template>
	<view class="container">
		<view class="message-details">
			<view class="message-details-list" v-for="(item, index) in msgList" :key="index">
				<view class="top">
					<text>{{item.chatUser}}</text>
				</view>
				<view class="container">
					<view class="item-left">
						<text>{{item.lastMsgTime}}</text>
						<text>{{item.day}}</text>
						<text>{{item.time}}</text>
					</view>
					<view class="item-right">
						<text>{{item.lastMsgText}}</text>
					</view>
				</view>
				
			</view>
		</view>
		
		
		<view class="wuxiaoxi" v-if="msgList.length === 0">
			<image src="../../static/wuxiaoxi.jpg" mode="aspectFit"></image>
		</view>
		
	</view>
</template>

<script>
	import { getNotice } from '@/api/basic.js';
	export default {
		data() {
			return {
				msgList: []
			};
		},
		onLoad(e) {
			console.log(e)
			getNotice().then(res => {
				console.log(res)
				this.msgList = res.data
			})
		}
	}
</script>

<style lang="less" scoped>

.message-details {
	&-list {
		margin: 20upx 0;
		padding: 0 24upx;
		.top {
			font-size: 34upx;
			font-weight: 600;
			color: #222222;
			padding: 20upx 0;
		}
		.container {
			background-color: #ffffff;
			display: flex;
			padding: 20upx;
			justify-content: space-between;
			.item-left {
				display: flex;
				flex-direction: column;
				align-items: center;
				text:nth-child(1) {
					font-size: 30upx;
					font-weight: 400;
					color: #666666;
				}
				text:nth-child(2), text:nth-child(3) {
					font-size: 26upx;
					color: #999;
				}
			}
			.item-right {
				display: flex;
				text:nth-child(1) {
					font-size: 30upx;
					color: #666666;
				}
				text:nth-child(2) {
					font-size: 30upx;
					color: #999999;
				}
			}
		}
	}
}

.wuxiaoxi {
	width: 100%;
	height: 100%;
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	image {
		width: 100%;
		height: 100%;
	}
}

</style>
