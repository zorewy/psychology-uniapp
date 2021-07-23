<template>
	<view class="container">
		<view class="content">
			<view class="detail">
				<view class="title">{{ info.title }}</view>
				<view class="info">
					<view class="source-date">
						<text class="source" v-if="info.source_url" @tap="copyText(info.source_url)">{{ info.source }}</text>
						<text class="source" v-else>{{ info.source }}</text>
						<text class="date hidden">{{ info.create_time }}</text>
					</view>
					<view class="read">测试： {{ info.hits }}</view>
				</view>
				<view class="desc"><parser :html="info.content"></parser></view>
			</view>
			
			<view class="bottom" >
				<view class="bottom-left" @click="addCollection">
					<text v-if="is_free">免费</text>
					<text v-else>￥{{info.amount}}</text>
				</view>

				<view class="bottom-right" v-if="is_free||is_paid" @click="goDetails">开始测评</view>
				<view class="bottom-right" @click="pay" v-else>立即购买</view>
			</view>
		</view>
		<uni-loading v-if="showPageLoading"></uni-loading>
		
	</view>
	
</template>

<script>
import parser from '@/components/parser/parser.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import util from '@/utils/util.js';
import wechatMP from '@/common/wechatMP.js';
import { getAssessDetail } from '@/api/article.js';
import { postCreateOrder } from '@/api/order.js'

export default {
	components: {
		parser,
		iconfont
	},
	data() {
		return {
			id: 0,
			info: { comment: { count: 0, list: [] } },
			showAddComment: false,
			showCommenBar: true,
			addCommentFocus: false,
			commentContent: '',
			replyCommentId: 0,
			replyNickname: '',
			page_index: 1,
			page_size: 10,
			hasMoreData: false,
			showPageLoading: true,
			currentUrl: '',
			shareUrl: '',
			showShareTip: false,
			showH5Share: false,
			showBrowserShareTip: false,
			is_free:false,
			is_paid:false
		};
	},
	onShow(e) {
			this.getData();
	},
	onLoad(e) {
		if (e.id > 0) {
			this.id = e.id;
		}
		// #ifdef H5
		this.currentUrl = encodeURIComponent(window.location.href);
		// #endif
	},
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中'
		});
		this.page_index = 1;
		this.getData();
	},
	onReachBottom(e) {
		if (this.hasMoreData) {
			this.getComment();
		}
	},
	/*小程序分享*/
	onShareAppMessage() {
		return {
			path: '/pages/article/detail?id=' + this.info.id,
			success: function(e) {},
			title: this.info.title,
			imageUrl: this.info.photo_url
		};
	},
	methods: {
		/*加载数据*/
		loadData() {
			this.getData();
		},

		/*获取文章详情*/
		getData() {
			getAssessDetail({id: this.id}).then((res) => {
					console.log(res);
					if (res.code == 0) {
						this.info = res.data;
						if (res.data.amount==0) {
							this.is_free = true
						}
						if (res.data.paid == true) {
							this.is_paid = true
						}
						uni.setNavigationBarTitle({
							title: this.info.title
						});
						// this.$initPageTitle();
						this.showPageLoading = false;

						this.page_index += 1;
						this.initMPShare(); //公众号分享
					} else {
						console.log(res.msg);
					}
				
					uni.stopPullDownRefresh();
					uni.hideLoading();
				
			});
		},
		
		goDetails() {
			let url = this.info.thirdUrl
			getApp().globalData.chatUrl = url
			uni.navigateTo({
				url:"/pages/web-view/web-view"
			})
		},

		/*点赞*/
		like() {
			this.$app.request({
				url: this.$api.article.like,
				data: {
					article_id: this.id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					console.log('res');
					if (res.code == 0) {
						this.info.is_like = !this.info.is_like;
						let msg = this.info.is_like ? '点赞成功' : '已取消点赞';
						this.$alert(msg, 'success');
					} else {
						this.$alert(res.msg, 'warning');
					}
				}
			});
		},

		/*评论点赞*/
		commentLike(comment_id, index) {
			this.$app.request({
				url: this.$api.article.commentLike,
				data: {
					comment_id: comment_id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					if (res.code == 0) {
						if (this.info.comment.list[index].is_like) {
							this.info.comment.list[index].is_like = false;
							this.info.comment.list[index].like_count -= 1;
						} else {
							this.info.comment.list[index].is_like = true;
							this.info.comment.list[index].like_count += 1;
						}
						let msg = this.info.comment.list[index].is_like ? '点赞成功' : '已取消点赞';
						this.$alert(msg);
					} else {
						this.$alert(res.msg);
					}
				}
			});
		},

		/*收藏*/
		favorite() {
			this.$app.request({
				url: this.$api.article.favorite,
				data: {
					article_id: this.id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					console.log('res');
					if (res.code == 0) {
						this.info.is_favorite = !this.info.is_favorite;
						let msg = this.info.is_favorite ? '收藏成功' : '已取消收藏';
						this.$alert(msg, 'success');
					} else {
						this.$alert(res.msg, 'warning');
					}
				}
			});
		},
		
		pay() {
			let assessDetails = this.info
			let argu = {
				"busiInfo": assessDetails.id,
				"remarks": "",
				"tradeType":"ASSESS",
			}
			postCreateOrder(argu).then((res) => {
				console.log(res)
				var courseOrder = res.data
	
				getApp().globalData.courseOrder = courseOrder
				if (getApp().globalData.courseOrder) {
					uni.navigateTo({
						url: '/pages/confirm-order-form/confirm-order-form?goodstype=assess'
					})
				}
			})
		},



		/*打开外部链接*/
		openLink(url) {
			console.log(url);
			window.location.href = url;
		},

		/*关闭H5分享*/
		closeH5Share() {
			this.showH5Share = false;
		},

		/*关闭微信分享提示*/
		closeShareTip() {
			this.showShareTip = false;
		},
		/*显示浏览器分享提示*/
		showBrowserShareTips() {
			this.showH5Share = false;
			this.showBrowserShareTip = true;
		},
		/*关闭浏览器分享提示*/
		closeBrowserShareTip() {
			this.showBrowserShareTip = false;
		},

		/*分享*/
		share() {
			// #ifdef H5
			if (util.isWechatOrQQ()) {
				this.showShareTip = true;
			} else {
				this.showH5Share = true;
			}
			// #endif

			console.log('share');

			// #ifdef MP
			uni.showShareMenu();
			// #endif
		},

		/*初始化公众号分享*/
		initMPShare() {
			// #ifdef H5
			let domain = location.href.split('/pages/')[0];
			/*分享链接*/
			let link = domain + '/pages/article/detail?id=' + this.info.id;
			if (this.$app.isWechat()) {
				/*初始化分享*/
				wechatMP.initShare(this, {
					title: this.info.title,
					desc: '',
					link: link,
					imgUrl: this.info.photo_url
				});
			} else {
				this.shareUrl = link;
			}
			// #endif
		},



		/*复制*/
		copyText(text) {
			uni.setClipboardData({
				data: text,
				success: res => {
					this.$alert('原文链接已复制', 'success');
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.detail {
	padding: 40rpx 32rpx;
	background: #fff;
	.title {
		font-size: 44rpx;
		color: #262626;
		line-height: 70rpx;
		font-weight: bold;
	}
	.info {
		margin-top: 32rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.source-date {
			.source {
				color: #666;
			}
			.date {
				color: #999;
				margin-left: 24rpx;
			}
		}
		.read {
			color: #999;
		}
	}
	.desc {
		margin-top: 56rpx;
		overflow: hidden;
		color: #262626;
		.wxParse {
			color: #262626;
		}
	}
}

	.bottom {
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		display: flex;
		border-top: 1rpx solid #eee;

		&-left {
			flex: 1;
			font-weight: 600;
			color: #ff5757;
			line-height: 88rpx;
			padding-left: 40rpx;
			font-size: 32rpx;
		}

		&-right {
			flex: 1;
			height: 88upx;
			background-color: #2498ff;
			font-size: 34upx;
			font-weight: 600;
			color: #fff;
			text-align: center;
			line-height: 88upx;
		}
	}
.declaration {
	margin: 50rpx 0;
	font-size: 34rpx;
	color: #999;
}
</style>
