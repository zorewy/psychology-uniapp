<template>
	<view class="list" v-if="list.length > 0">
		<view class="item" v-for="(item, index) in list" :key="index" @click="goDetails(item.id)" hover-class="none">
			<view class="info">
				<view class="photo"><image :src="item.imageUrl" mode="aspectFill"></image></view>
				<view class="text">
					<view class="title">{{ item.title }}</view>
					<view class="other">
						<view class="left">
							<view class="source" v-if="item.amount">￥{{ item.amount }}</view>
							<view class="source" v-else>免费</view>
							<view class="time">{{ item.create_time }}</view>
						</view>
						<view class="right" v-if="item.comment_count > 0">
							<image src="/static/images/icon_comment.png"></image>
							<text>{{ item.comment_count }}</text>
						</view>
						<view class="right view" v-else>
							<image src="/static/images/icon_view.png"></image>
							<text>{{ item.hits }}</text>
						</view>
					</view>
				</view>
				<!-- <view class="photo"><image :src="item.imageUrl" mode="aspectFill"></image></view> -->
			</view>
			<view class="line"></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'articleList',
	props: {
		list: {
			type: Array,
			default: function(e) {
				return [];
			}
		},
		name:String
	},
	data:{
		name:""
	},
	methods: {
		goDetails(id) {
			let name = this.name
			uni.navigateTo({
				url:`/pages/${name}/${name}?id=` + id
			})
		}
	}
};
</script>

<style lang="scss">
/*文章列表*/
.list {
	margin-top: 2rpx;
	.item {
		padding: 40rpx 24rpx 0 24rpx;
		.info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 4rpx;
			.text {
				flex-grow: 1;
				flex-shrink: 1;
				display: flex;
				flex-direction: column;
				margin-left: 40rpx;
				.title {
					flex-grow: 1;
					flex-shrink: 1;
					font-size: 34rpx;
					line-height: 1.5;
					display: -webkit-box;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					height: 72rpx;
					margin-bottom: 8rpx;
				}
				.other {
					flex-grow: 1;
					flex-shrink: 1;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #999;
					line-height: normal;
					.left {
						display: flex;
						flex-grow: 1;
						flex-shrink: 1;
						.source {
							display: -webkit-box;
							text-overflow: ellipsis;
							word-break: break-all;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
							overflow: hidden;
							width: 140rpx;
							margin-right: 16rpx;
						}
					}
					.right {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						flex-grow: 0;
						flex-shrink: 0;
						margin-right: 5rpx;
						image {
							flex-grow: 1;
							flex-shrink: 1;
							width: 28rpx;
							height: 28rpx;
							margin-right: 12rpx;
						}
						text {
							flex-grow: 1;
							flex-shrink: 1;
							margin-top: -6rpx;
						}
					}
					.view {
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 5rpx;
						}
					}
				}
			}
			.photo {
				image {
					height: 170rpx;
					width: 222rpx;
					border-radius: 10rpx;
				}
			}
		}
		.line {
			display: bock;
			width: 100%;
			height: 1rpx;
			margin-top: 22rpx;
			background: #e8e8e8;
		}
		&:last-child {
			.line {
				//display: none;
			}
			//padding-bottom: 30rpx;
		}
	}
}
</style>
