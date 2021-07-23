<template>
	<view class="container">
			<!-- 没有任何关注 -->
 			<view class="empty" v-if="noData == true">
			  <image src="/static/no_data.png" mode="aspectFill"></image>
			</view>
			<view v-else>
				<view class="kc" :class="{dis:btnnum == 0}" :model="zhiboInfo">
					<!-- 我的关注 -->
					<view class="buy-list">
						<view class="buy-list-item" v-for="(item, index) in followList" :key="index" @click="goTutorDetails(item.id)">
							<view class="item-top">
								<image class="item-top-left" :src="item.imageUrl" mode="aspectFit"></image>
								<view class="item-top-right">
									<text>{{item.username}}</text>
									<text>{{item.style}}</text>
									<text decode>资质：{{item.qualifyName}}</text>
								</view>
							</view>
							<view class="item-bottom">
								<text class="hui">咨询数量：</text>
								<text class="red">{{item.noteNum}}</text>
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
	import { myFollow } from '@/api/userinfo.js';
	export default {
		data() {
			return {
				followList: [],
				btnnum: 0,
				noData: false,
				showPageLoading:true
			};
		},

		onShow() {
			this.getMyFollow()
		},
		methods: {
			// 获取关注数据
			getMyFollow () {
				let userinfo=uni.getStorageSync('userinfo')
				myFollow().then(res => {
					if (res) {
						if(res.data.length==0) {
							this.noData = true
						} else {
							this.followList = res.data
						}
					this.showPageLoading = false
					}
				})
			},
			goTutorDetails(id) {
				uni.navigateTo({
					url: `/pages/tutor-introduced/tutor-introduced?id=${id}`
				});
			},
			goEstimate (menuid, media) {
				uni.navigateTo({
					url: `/pages/estimate/estimate?menuid=${menuid}&media=${media}`
				});
			}
		}
	}
</script>

<style lang="less" scoped>
@import '/style/no_data.css';

.container {
		.kc {
			display: none;
			.buy-list {
				border-radius: 20upx;
				margin: 0 20upx;
				&-item {
					padding-bottom: 20upx;
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
						justify-content: flex-end;
						.red {
							font-size: 30upx;
							color: #ff5757;
							margin: 20upx 20upx 0 0;
						}
						.hui {
							font-size: 30upx;
							color: #333333;
							margin: 20upx 20upx 0 0;
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