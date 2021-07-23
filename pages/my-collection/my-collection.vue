<template>
	<view class="container">
			<!-- 没有任何订单图片 -->
			<view class="empty" v-if="noData == true">
				<image src="/static/no_data.png" mode="aspectFit"></image>
			</view>
			
			<!-- 课程订单 -->
			<view v-else>
				<view class="kc" :class="{dis:btnnum == 0}" :model="zhiboInfo">
					<!-- 课程订单购买列表 -->
					<view class="buy-list">
						<view class="buy-list-item" v-for="(item, index) in collectionList" :key="index" @click="goCourseDetails(item.id)">
							<view class="item-top">
								<image class="item-top-left" :src="item.imageUrl" mode="aspectFit"></image>
								<view class="item-top-right">
									<text>{{item.title}}</text>
									<text>{{item.keywords}}</text>
									<text>{{item.author}}</text>
								</view>
							</view>
							<view class="item-bottom">
								<view class="bottm-left">
									<text class="hui" v-if="item.paid&&item.amount!=0">已购买</text>
									<text class="hui" v-else-if="!item.paid&&item.amount!=0">未购买</text>
									<text class="hui" v-else>免费</text>
								</view>
								<view class="bottm-right">
									<text class="red">{{item.amount}}</text>
									<text>元</text>
								</view>
								
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-loading v-if="showPageLoading"></uni-loading>
		</view>
</template>

<script>
	import {checkUserinfo} from '@/utils/checkUserinfo';
	import { myCollection } from '@/api/userinfo.js';
	export default {
		data() {
			return {
				collectionList: [],
				btnnum: 0,
				noData: false,
				showPageLoading: true
			};
		},

		onShow() {
			this.getMyCollection()
		},
		methods: {
			// 获取订单数据
			getMyCollection () {
				let userinfo=uni.getStorageSync('userinfo')
				myCollection().then(res => {
					if (res) {
						if(res.data.length<1) {
							this.noData = true
						} else {
							this.collectionList = res.data
						}
						this.showPageLoading = false
					}
				})
			},
			goCourseDetails(id) {
				uni.navigateTo({
					url: `/pages/course-details/course-details?id=${id}`
				});
			}
		}
	}
</script>

<style lang="less" scoped>
@import '/style/no_data.css';


// 全部订单
.container {
		.kc {
			display: none;
			.buy-list {
				border-radius: 20upx;
				margin: 0 20upx;
				&-item {
					margin-top: 10upx;
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
							margin-left: 22upx;
						}
						&-right {
							display: flex;
							margin-left: 42upx;
							flex-direction: column;
							text:nth-child(1) {
								font-size: 28upx;
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
						.bottm-left {
							margin: 20upx 0 20upx 24upx;
							.hui {
								font-size: 30upx;
								color: #333333;
							}
						}
						.bottm-right {
							margin: 20upx 24upx 20upx 0;
							.red {
								font-size: 30upx;
								color: #ff5757;
							}
						}
					}
				}
			}
		}
		
		.dis{
			display: block;
			margin-top: 20upx;
		}
	}
	



</style>
