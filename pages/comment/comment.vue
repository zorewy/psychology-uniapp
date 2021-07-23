
<template>
	<view class="container">
<!-- 		<view class="top">
			<view class="avatar">
				<image :src="avatar" mode="aspectFill"></u-image>
			</view>
			<view class="desc">	
					<text>评分：</text>
			</view>
			<view class="rate">
				<u-rate :count="count" active-color="#ff5757" v-model="value" @change="change"></u-rate>
			</view>
		</view> -->
		<view class="con">
			<textarea v-model="content" placeholder="请输入您的评价内容..." />
		</view>
		<view class="floor">
			<text @click="postCourseComment">提交评价</text>
		</view>
	</view>
</template>

<script>
	import { postCms } from '@/api/basic.js';
	
	export default {
		data() {
			return {
				content: '',
				id: '',
				contentId: '',
				count: 5,
				value: 0,
				// avatar:'',
				num:5
			};
		},
		onLoad(option) {
			// var user = uni.getStorageSync('userinfo')
			// this.avatar = user.imageUrl
			// console.log(this.avatar)
			this.id = option.id
			this.contentId = option.consultantId
		},
		methods: {
			postCourseComment() {

				let argu = {
					content:this.content,
					contentId:this.contentId,
					tradeId:this.id,
					module: "ASSESS",
				}
				postCms(argu).then(res => {
					if (res.code === 0) {
						uni.navigateBack({
							delta:1
						})
					} else {
						uni.showToast({
							title: '评价失败',
							duration: 2000
						})
					}
				})
			},
			change(e) {
				console.log(e)
				this.num = e
			}
		}
	}
</script>

<style lang="less" scoped>

.container {
	padding: 30upx 30upx 0;
	background-color: #ffffff;
	// .top {
	// 	display: flex;
	// 	align-items: center;
	// 	border-bottom: 1upx solid #eeeeee;
	// 	padding-bottom: 20upx;
	// 	.avatar {
	// 		width: 80upx;
	// 		height: 80upx;
	// 		image {
	// 			width: 100%;
	// 			height: 100%;
	// 			border-radius: 10upx;
	// 		}
	// 	}
	// 	.desc {
	// 		margin-left: 20upx;
	// 		text {
	// 			font-size: 32upx;
	// 			color: #333;
	// 			font-weight: 600;
	// 		}
	// 	}
	// }
	.con {
		margin-top: 40upx;
		margin-bottom: 100upx;
		padding-bottom: 100upx;
		textarea {
			width: 100%;
			height: 400upx;
			border-radius: 20upx;
			background-color: #f9f9f9;
			font-size: 30upx;
			color: #333;
			padding: 30upx;
			box-sizing: border-box;
			border: 2upx solid #eeeeee;
		}
	}
}



.floor {
	width: 100%;
	height: 121upx;
	background-color: #fff;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	text {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 90upx;
		background-color: #4b89ff;
		border-radius: 50upx;
		font-size: 34upx;
		color: #fff;
	}
}


</style>
