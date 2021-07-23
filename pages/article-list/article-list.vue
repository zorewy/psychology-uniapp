<template>
	<view class="page">
		<!-- #ifdef MP -->
		<view class="top">
			<!-- 页面标题 -->
			<!-- <view class="page-title" :style="'height: ' + navBarHeight"><image src="../../static/images/logo.png"></image></view> -->
			<!-- 搜索 -->
			<view class="search" :style="showNavFloat ? 'display:none' : ''">
				<u-search placeholder="请输入搜索关键字" v-model="keyword" :clearabled="true" :show-action="true" action-text="搜索"
					:animation="false" @custom="searchData"></u-search>
			</view>
			</view>
			<!-- #endif -->

			<!-- 搜索 -->
			<!-- #ifdef H5 -->
			<view class="search">
				<image class="logo" mode="aspectFit" src="../../static/images/logo.png"></image>
				<navigator class="input" url="search" hover-class="none">
					<iconfont type="search"></iconfont>
					<text>输入关键字搜索文章</text>
				</navigator>
				<navigator class="user" url="/pages/user/index" hover-class="none">
					<iconfont type="user-01"></iconfont>
					<!-- <image v-if="current.user" :src="user.avatar_url"></image> -->
					<!-- <image src="/static/images/default_user_photo.jpg" @tap="login()"></image> -->
				</navigator>
			</view>
			<!-- #endif -->


		<view class="content" v-if="isData==false">
			<articleList :list="artList" :name="'article-detail'" />
		</view>
		<view class="content" v-else>
			<view class="empty">
			  <image  src="/static/no_data.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>

import articleList from '@/components/article/list.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import {postArticleList} from '@/api/article.js';
export default {
	components: {
		articleList,
		iconfont
	},
	data() {
		return {
			scroller: {},
			optUp: { auto: true, onScroll: true, page: { size: 20 }, empty: { tip: '暂无文章~' } },
			category_id: 1,
			category_index: 0,
			currentSliderIndex: 0,
			category: [],
			showMenu: false,
			artList: [],
			showNoData: false,
			showPageLoading: true,
			showNavFloat: false,
			navBarHeight: '',
			keyword:'',
			isData:false,
			showPageLoading:true
		};
	},
	onLoad(e) {
		this.getData()
	},

	
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中'
		});
		this.loadData();
	},
	methods: {
		/*初始化滚动*/
		initScroller(scroller) {
			this.scroller = scroller;
		},

		/*刷新数据*/
		refreshData() {
			uni.showLoading({
				title: '刷新中'
			});
			this.scroller.resetUpScroll();
		},

		/*加载数据*/
		loadData() {
			this.slider = [];
			this.list = [];
			this.currentSliderIndex = 0;
			this.scroller.resetUpScroll();
		},

		/*获取子类别数据*/
		getCategory() {
			postArticleList().then((res) => {
				console.log(res)
					if (res.code == 0) {
						this.category = res.data;
						if (this.category_index > -1) {
							let nextIndex = this.category_index - 1;
							nextIndex = nextIndex <= 0 ? 0 : nextIndex;
							this.scroll_category_id = `category_id-${nextIndex}`; //动画滚动,滚动至中心位置
						}
					} else {
						// this.$alert(res.msg);
					}
				
			});
		},

		/*获取数据*/
		getData() {
			postArticleList().then((res) => {
					if (res.code == 0) {
						var artList = [];
						this.artList = artList.concat(res.data.list);
					}
			});
		},
			searchData(e) {
				console.log(e)
				let argu = {
					title: e
				}
				postArticleList(argu).then(res => {
					console.log(res)
					if (res.data.list.length==0) {
						this.isData = true
					} else {
						this.artList = res.data.list
					}
					
				})
			}
			}
};
</script>

<style scoped lang="scss">
@import '/style/no_data.css';
page {
	height: 100%;
	background-color: #ffffff;
}
.page {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}
.content {
	flex: 1;
	width: 100%;
	height: 100rpx;
}

/*头部*/
.top {
	/*页面标题*/
	.page-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		text-align: center;
		border-bottom: 1rpx solid #efefef;
		z-index: 9999;
		line-height: 1;
		image {
			height: 50rpx;
			width: 280rpx;
			margin-left: -35rpx;
		}
	}

	/*搜索*/
	.search {
		padding: 24rpx 24rpx 0 24rpx;
		.input {
			margin-left: 0 !important;
			display: flex;
			align-items: center;
			height: 70rpx;
			width: 100%;
			background: #f5f5f5;
			border-radius: 34rpx 34rpx 0 34rpx;
			/deep/ .icon {
				margin-left: 28rpx;
				color: #aaaaaa;
				font-size: 32rpx;
				line-height: 1;
			}
			text {
				margin-left: 14rpx;
				font-size: 30rpx;
				color: #aaaaaa;
				line-height: 1;
			}
		}
		.user{
			display: flex;
			align-items: center;
			/deep/ .icon {
				margin-left: 24rpx;
				color: #aaaaaa;
				font-size: 38rpx;
				margin-top: 4rpx;
			}
			image{
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-left: 25rpx;
			}
		}
	}
}
.menu-block {
	position: absolute;
	top: 0;
	left: 0;
	background: #fff;
	border-bottom: 1rpx solid #f5f5f5;
	padding: 20rpx 0 50rpx;
	z-index: 100;
	width: 100%;
	//box-shadow: 0 15rpx 10rpx -15rpx #e9ebee;
	.list {
		padding-left: 10rpx;
		text {
			background: #f5f7fa;
			border-radius: 8rpx;
			font-size: 32rpx;
			margin: 12rpx 20rpx;
			display: inline-block;
			height: 72rpx;
			width: 144rpx;
			line-height: 72rpx;
			text-align: center;
		}
		.current {
			color: #fff;
			background: #8cc7b5;
			//font-size: 32rpx;
		}
	}
}

.scroll {
	height: 100%;
}

/*幻灯片广告 */
.swiper {
	height: 350rpx;
	margin: 14rpx 24rpx 0;
	image {
		height: 350rpx;
		width: 100%;
		border-radius: 15rpx;
		//box-shadow: 0 0 12px #dddee1;
	}
	.current {
		width: 97%;
		height: 350rpx;
		margin: 1.5% 1.5%;
		transition: all 0.2s ease-in 0s;
	}
	.item {
		position: relative;
		.title {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			width: 100%;
			text {
				margin: 7% 6%;
				display: flex;
				align-items: center;
				color: #fff;
				display: -webkit-box;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: 34rpx;
				padding: 14rpx 20rpx;
				max-width: 610rpx;
				line-height: 1.3;
				border-radius: 5rpx;
			}
		}
	}
}

/*浮动navbar*/
.floatbar {
	//border-bottom: 1rpx solid #e8e8e8;
	box-shadow: 0px 2px 2px -2px #e8e8e8;
	padding-bottom: 12rpx;
}

/deep/ .no-data {
	margin-top: 200rpx;
}
</style>
