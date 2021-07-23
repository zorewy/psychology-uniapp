<template>
	<view class="container">
		<!-- 计算手机状态栏的高度 -->
		<!-- #ifndef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-ALIPAY -->
		<view class="status_bar">

		</view>
		<!-- #endif -->

		<!-- 头部 -->
		<view class="header" :class="[{newheader:navBarFixed},{changebf:huifu}]"
			:style="{'background-color':swiper_bgcolor}">
			<!-- 分类 -->
			<view class="header-list">
				<scroll-view class="list" scroll-x="true">
					<view class="list-box">
						<view class="list-item" v-for="(item,index) in products" :key="item.id"
							@click="indexTutorList(item.id,index)">
							<!--      -->
							<view class="list-item-top" :class="[{fangda: (index) == current}, {newview: navBarFixed}]">
								{{item.name}}
							</view>
							<!--  -->
							<view class="list-item-bottom"
								:class="[{hengxian: (index) == current}, {newhengxian: navBarFixed}]"
								style="transition: .3s"></view>
						</view>
					</view>
				</scroll-view>
				<view class="icon" :products="products" @click="goListPage">
					<image v-if="!navBarFixed" src="../../static/fenleixuanzhong.png" mode="aspectFit"></image>
					<image v-else src="../../static/fenleixuanzhong1.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="header-input">
				<!-- <image @click="postSearchCourse" class="search" src="../../static/search.png" mode="aspectFit"></image> -->
				<!-- <image @click="postSearchCourse" class="search" src="../../static/search.png" mode="aspectFit"></image> -->
				<navigator class="search_box" url="/pages/course-list/course-list">
					<text class="seach_text">点击搜索课程</text>
					<text class="i icon-sousuo"></text>
				</navigator>
				<!-- <input v-model.trim="keyword" class="seader-input" :class="{newinput: navBarFixed}" type="text" placeholder="请输入搜索内容" /> -->
				<!-- <view class="i icon-sousuo" @click="postSearchCourse"></view> -->
				<!-- 				<input v-model.trim="keyword" class="seader-input" :class="{newinput: navBarFixed}" type="text"
					placeholder="请输入搜索内容" /> -->

				<image @click="navigate('message')" v-if="!navBarFixed" src="../../static/msg.png" mode="aspectFit">
				</image>
				<image @click="navigate('message')" v-else src="../../static/msg1.png" mode="aspectFit"></image>

			</view>
		</view>

		<!-- 轮播图 -->
		<view class="swiper" :class="[{newheader:navBarFixed},{changebf:huifu}]"
			:style="{'background-color':swiper_bgcolor}">
			<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" circular="true"
				@change="swiper_change">
				<swiper-item v-for="item in images" :key="item.id">
					<view class="swiper-item">
						<image :src="item.imageUrl" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 图标 -->
		<view class="icons">
			<view class="icons-list" @click="navigate('tutor-list')" v-for="(item,index) in gonggeList" :key="index1">
				<image :src="item.imageUrl" mode="aspectFit"></image>
				<text>{{item.name}}</text>
			</view>
			<view class="icons-list" @click="navigate('tutor-list')">
				<image src="../../static/images/all_cate.png" mode="aspectFit"></image>
				<text>全部</text>
			</view>
		</view>
		<view class="mod" v-once>
			<view class="item" v-for="(item,index) in gongGe" :key="index" @click="navigate(item.url)">

				<image :src="item.img"></image>
				<view class="info">
					<text class="main">{{item.name}}</text>
				</view>
			</view>

<!-- 			<navigator class="item" url="/pages/course-list/course-list">
				<view class="info">
					<text class="main">心理课堂</text>
				</view>
				<image src="//static.ydlcdn.com/m/images/home/column-3.png"></image>
				</image>
			</navigator>
			<navigator class="item" url="/pages/assess-list/assess-list">
				<view class="info">
					<text class="main">心理测试</text>
				</view>
				<image src="//static.ydlcdn.com/m/images/home/column-4.png"></image>
			</navigator>
			<navigator class="item" url="/pages/article-list/article-list">
				<view class="info">
					<text class="main">心理阅读</text>
				</view>
				<image src="//static.ydlcdn.com/m/images/home/column-2.png"></image>
			</navigator> -->
		</view>

		<view class="zixunshi">
			<view class="top">
				<view class="left">
					<view class="store">
						倾诉*排解
					</view>
					<view class="u-icon u-icon--right">
						<text class="u-icon__icon uicon-arrow-right u-iconfont"
							style="font-size: 10px; font-weight: normal; top: 0px; color: rgb(203, 203, 203);">
						</text>
					</view>
				</view>
				<view class="upx" @click="goTutorList">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="li">
				<scroll-view class="line" scroll-x="true" scroll-y="false">
					<view class="line-box">
						<view class="line-item" v-for="(item,index) in products" :key="item.id"
							@click="indexGoods(item.id,index)">
							<view class="line-item-top" :class="[{fangda: (index) == current}, {newview: navBarFixed}]">
								{{item.name}}
							</view>
							<view class="line-item-bottom"
								:class="[{hengxian: (index) == current}, {newhengxian: navBarFixed}]"
								style="transition: .3s"></view>
						</view>
					</view>
				</scroll-view>
			</view>
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
				style="height: 540upx;">
				<swiper-item class="swiper-item">
					<view scroll-y="false" scroll-x="false" @scrolltolower="onreachBottom"
						v-for="(item,index) in consultants" :key="item.id">
						<view class="shi" :id="item.id">
							<view class="shileft" @click.native="goTutorDetails(item.id)">
								<image :src="item.imageUrl"></image>
							</view>
							<view class="shicenter" @click.native="goTutorDetails(item.id)">
								<view class="title">{{item.username}}</view>
								<view class="sign">
									<text v-for="(i,la) in (item.specialList)" :key="i.id">{{i}}</text>
								</view>
								<view class="info">
									<text>{{item.fansNum}}人向TA倾诉</text>
									<!-- <text>100%接通率</text> -->
								</view>
								<!--<view class="price">
									<text class="small">¥</text>
									<text class="color">50</text>起
								</view> -->
							</view>

							<view class="shiright" @click="goChat(item.id)">
								<view class="groung">
									<u-icon size="40" color="#ffffff" name="chat-fill"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 课程专区 -->
		<view class="course_list">
			<view class="top">
				<view class="left">
					<view class="store">
						学习*成长
					</view>
					<view class="u-icon u-icon--right">
					</view>
				</view>
				<view class="upx" @click="goCourseList">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="recommend" v-for="(item,index) in lessons" :key="item.hits" @click="goCourseDetails(item.id)">
				<view class="list-pic" mode="aspectFill">
					<image :src="item.imageUrl"></image>
				</view>
				<view class="item-right">
					<view class="line1">
						<text>{{item.title}}</text>
					</view>
					<view class="line2">
						<view class="price" v-if="item.amount==0">免费</view>
						<view class="price" v-else>￥{{item.amount}}</view>
						<view class="popularity">{{item.hits}}人气</view>
					</view>
				</view>
			</view>
		</view>


		<view class="course_list">
			<view class="top">
				<view class="left">
					<view class="store">
						测试*分析
					</view>
					<view class="u-icon u-icon--right">
					</view>
				</view>
				<view class="upx" @click="goAssessList">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="recommend" v-for="(item,index) in assess" :key="item.hits" @click="goAssessDetail(item.id)">
				<view class="list-pic" mode="aspectFill">
					<image :src="item.imageUrl"></image>
				</view>
				<view class="item-right">
					<view class="line1">
						<text>{{item.title}}</text>
					</view>
					<view class="line2">
						<view class="price" v-if="item.amount==0">免费</view>
						<view class="price" v-else>￥{{item.amount}}</view>
						<view class="popularity">{{item.hits}}人已测</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 文章专区 -->
		<view class="art">
			<view class="top">
				<view class="left">
					<view class="store">
						主题*阅读
					</view>
					<view class="u-icon u-icon--right">
					</view>
				</view>
				<view class="upx" @click="goArticleList">
					<text>更多</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="articles">
				<view class="hmt" v-for="(item,index) in articles" :key="item.id" @click="goArticleDetail(item.id)">
					<view class="introduc">
						<view class="title">{{item.title}}</view>
						<view class="summary">{{item.keywords}}</view>
					</view>
					<view class="img-box">
						<image :src="item.imageUrl" class="lazy" style="display: inline;" />
					</view>
				</view>
			</view>
		</view>
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
</template>


<script>
	import {
		getIndexInfo
	} from '@/api/basic.js';
	import {
		wx_login,
		checkUserinfo
	} from '@/utils/checkUserinfo';
	import {
		postIndexGoods
	} from '@/api/tutor.js';
	import {
		getChat
	} from '@/api/login_reg.js';
	export default {
		data() {
			return {
				keyword: '',
				navBarFixed: false,
				huifu: false,
				images: [],
				HOST_URL: uni.HOST_URL,
				index: 0,
				swiper_bgcolor: '#4b89ff',
				robBuyList: {},
				killhour: 0,
				killminute: 0,
				killsecond: 0,
				ptInfo: {},
				ptNum: '',
				products: [], //九宫格菜单栏
				tuijianjigou: [],
				lessons: [], //主页课程推荐
				dujiaList: [], // 独家精选列表
				flid: '', // 这个变量用于传值
				isPlaying: false,
				isPaused: false,
				isPlaying1: false,
				isPaused1: false,
				page: 0,
				page1: 0,
				base_set: [],
				ad_close: false,
				list: [],
				son_fls: [],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				consultants: [],
				articles: [],
				tuijian: {
					description: "",
					id: "0",
					module: "CONSULT",
					name: "推荐",
					sort: 0,
					tenantCode: "1001"
				},
				gonggeList: [],
				assess: [],
				showPageLoading: true,
				maincolor: [{
						'color': '#fed2b7'
					},
					{
						'color': '#1fbdbf'
					}
				],
				gongGe:[]
			}
		},

		onLoad() {
			let userinfo = uni.getStorageSync('userinfo')
			checkUserinfo(userinfo)

		},
		onPageScroll(object) {
			let scrollTop = object.scrollTop;
			if (scrollTop > 30) {
				this.navBarFixed = true
				this.huifu = false
			} else {
				this.navBarFixed = false
				this.huifu = true
			}
		},
		onShow() {
			this.getIndexInfo()
			// 计时关闭弹窗
		},
		methods: {
			closebtn() {
				var date = new Date()
				var nowtime = date.getTime()
				this.ad_close = false
				uni.setStorageSync('adclosetime', nowtime)
			},
			// tabs栏目
			// tabs通知swiper切换
			tabsIndexGoods(index) {
				console.log(index)
				this.current = index;
				this.swiperCurrent = index
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			swiper_change(e) {
				this.swiper_bgcolor = this.maincolor[e.detail.current].color
			},

			// 获取轮播图和列表信息
			getIndexInfo() {
				getIndexInfo().then(res => {
					if (res.code === 0) {
						let cate = [];
						let cateList = res.data.products
						this.products = cate.concat(this.tuijian, cateList);
						this.gonggeList = res.data.products
						this.consultants = res.data.consultants;
						this.lessons = res.data.lessons;
						this.articles = res.data.articles;
						this.assess = res.data.assess;
						this.images = res.data.banners;
						this.gongGe = [
					{
						name:"心理咨询",
						url:"tutor-list",
						img:"//static.ydlcdn.com/m/images/home/column-1.png"
					},
					{
						name:"心理课程",
						url:"course-list",
						img:"//static.ydlcdn.com/m/images/home/column-2.png"
					},
					{
						name:"心理测评",
						url:"assess-list",
						img:"//static.ydlcdn.com/m/images/home/column-3.png"
					},
					{
						name:"心理阅读",
						url:"article-list",
						img:"//static.ydlcdn.com/m/images/home/column-4.png"
					}
					
				]
						this.showPageLoading = false
					} else {
						console.log("数据加载失败")
					}
				})

			},


			indexGoods(id, key) {
				this.current = key
				this.flid = id
				let argu = {
					page: "0",
					limit: "4",
					productType: id
				}
				postIndexGoods(argu).then(res => {
					if (res.code == 0) {
						console.log(res.data)
						this.consultants = res.data.list
					} else {
						this.consultants = []
					}
				})
			},
			
			indexTutorList(id,index) {
				

			},
			
			sonflCourseList(sonid) {
				uni.navigateTo({
					url: `/pages/course-list/course-list?flid=${this.flid}&sonflid=${sonid}&goodstype=course`
				})
			},



			// 页面跳转
			navigate(e, id) {
				console.log(e)
				if (e == 'tutor-list') {
					uni.switchTab({
						url: '/pages/' + e + '/' + e
					})
				} else {
					uni.navigateTo({
						url: '/pages/' + e + '/' + e
					})
				}
			},

			// 去课程列表页面
			goCourseList() {
				uni.navigateTo({
					url: `/pages/course-list/course-list?goodstype=course`
				});
			},
			goTutorDetails: function(e) {
				console.log(e)
				uni.navigateTo({
					url: `/pages/tutor-introduced/tutor-introduced?id=${e}`
				})
			},
			goTutorList() {
				uni.switchTab({
					url: `/pages/tutor-list/tutor-list`
				})
			},
			goArticleList() {
				uni.navigateTo({
					url: `/pages/article-list/article-list`
				})
			},
			goAssessList() {
				uni.navigateTo({
					url: '/pages/assess-list/assess-list'
				})
			},
			goArticleDetail(id) {
				uni.navigateTo({
					url: '/pages/article-detail/article-detail?id=' + id
				})
			},
			// 去列表页面
			goListPage() {
				uni.switchTab({
					url: `/pages/tutor-list/tutor-list?goodstype=course`
				});
			},
			// 去课程详情页面
			goCourseDetails(id) {
				uni.navigateTo({
					url: `/pages/course-details/course-details?id=${id}`
				})
			},

			goAssessDetail(id) {
				uni.navigateTo({
					url: `/pages/assess-detail/assess-detail?id=${id}`
				})
			},
			goChat(e) {
				console.log(e)
				let argu = {
					id: e
				}
				getChat(argu).then((res) => {
					console.log(res)
					if (res.code === 0) {
						getApp().globalData.chatUrl = res.data
						uni.navigateTo({
							url: '/pages/web-view/web-view'
						})
					}
				})
			},

		}
	}
</script>


<style lang="less">
	@import './index.less';
	@import './goods-course.less';

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(720deg);
		}
	}

	.an {
		animation: rotation 2s infinite linear;
	}

	.icons {
		background-color: #fff;
	}

	.pause {
		animation-play-state: paused;
	}
	.mod {
		padding: 0;
		font-size: 30upx;
		outline: 0;
		line-height: 68upx;
		width: 100%;
		margin: 20upx 0;
		display: flex;
		justify-content: center;
		.item {
			// padding: 0 10upx;
			font-size: 30upx;
			display: inline-flex;
			width: 140upx;
			height: 140upx;
			margin: 0 20upx;
			position: relative;
			border-radius: 20upx;
			box-shadow: 0 20upx 20upx rgba(0, 0, 0, 0.04);
			.info {
				padding: 30upx 16upx 10upx 16upx;
				position: relative;
				.main {
					font-size: 26upx;
					color: #666666;
					font-weight: 600;
				}
				.fu {
					font-size: 24upx;
					color: #999999;
				}
				
			}
			image {
				border: 0;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				display: block;
			}
		}
	}

	.zixunshi {
		display: block;
		background-color: #ffffff;
		padding: 20upx;
	}

	.top {
		display: flex;
		justify-content: space-between;
		padding: 20upx 0;
	}

	.search_box {
		background-color: #F3F4F8;
		border-radius: 60upx;
		color: #666;
		display: flex;
		width: 600upx;
		height: 68upx;
		justify-content: space-between;
		align-items: center;
		padding: 0 40upx;

		.seach_text {
			font-size: 30upx;
		}

	}

	.store {
		font-size: 34upx;
		color: #111111;
		font-weight: 800;
	}

	.li {
		height: 110upx;
		margin-left: 25upx;
		display: flex;

		.line {
			width: 100%;
			height: 110upx;
			white-space: nowrap;

			.line-box {
				height: 110upx;
				display: flex;
				align-items: center;

				.line-item {
					margin-right: 40upx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.line-item-top {
						font-size: 30upx;
						color: #333;
					}

					.fangda {
						font-size: 32upx;
						font-weight: 600;
						margin-top: 5upx;
						color: #4b89ff;
					}

					.hengxian {
						width: 30upx;
						height: 6upx;
						border-radius: 2upx;
						margin-top: 10upx;
						background-color: #4b89ff;
					}
				}
			}
		}
	}


	.shi {
		display: flex;
		align-items: center;
		margin: 20upx 0;
		border-bottom: 1upx solid #f0f0f0;
		padding-bottom: 20upx;

		.shileft {
			flex: 2;

			image {
				width: 140upx;
				height: 140upx;
				border-radius: 140upx;
			}
		}

		.shicenter {
			flex: 6;
			margin-left: 20upx;

			.title {
				display: block;
				font-size: 34upx;
				color: #222;
			}

			.sign {
				margin-top: 10upx;
				height: 40upx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				word-break: keep-all;

				text {
					background: #f7f7f7;
					border-radius: 80upx;
					color: #666;
					font-size: 24upx;
					line-height: 40upx;
					padding: 8upx 16upx;
					margin-right: 10upx;

				}
			}

			.info {
				margin-top: 10upx;
				font-size: 26upx;
				color: #666666;
			}

			.price {
				color: #666;
				font-size: 26upx;
				margin-top: 10upx;

				.small {
					font-size: 20upx;
				}

				.color {
					color: #ff5757;
					font-size: 30upx;
				}
			}
		}

		.shiright {
			flex: 1.4;

			.groung {
				display: flex;
				background-color: #4b89ff;
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
				justify-content: center;
			}
		}

	}

	.course_list {
		background-color: #ffffff;
		padding: 0 24upx;
		margin-bottom: 30upx;
	}

	.recommend {
		display: flex;
		background-color: #fff;
		margin: 20upx 0;
		border-bottom: 1upx solid #f0f0f0;
	}

	.list-pic {
		margin-right: 20upx;

		image {
			width: 180upx;
			height: 136upx;
			border-radius: 8upx;
		}
	}

	.item-right {
		display: block;
		max-width: 500upx;
		width: 100%;
	}

	.item-right .line1 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		text {

			font-size: 30upx;
			color: #333333;
		}
	}

	.item-right .line2 {
		display: flex;
		margin-top: 40upx;
		justify-content: space-between;
	}

	.line2 .price {
		font-size: 30upx;
		color: #ff5757;
	}

	.line2 .popularity {

		font-size: 30upx;
		color: #666666;
	}

	.art {
		background-color: #fff;
		padding: 0 24upx;
	}

	.articles {
		background-color: #fff;
	}

	.articles .hmt {
		margin-top: 20upx;
		padding-bottom: 30upx;
		border-bottom: 1upx solid #f0f0f0;
		display: flex;
	}

	.hmt .img-box {
		width: 200upx;
		height: 160upx;
		border-radius: 8upx;
		border: 1upx solid #f0f0f0;
	}

	.hmt .introduc {
		flex: 7;
	}

	.introduc .title {
		font-size: 30upx;
		color: #333;
		max-width: 500upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.introduc .summary {
		font-size: 28upx;
		color: #999;
		margin-top: 40upx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		padding-right: 30upx;
	}

	.hmt .info {
		margin-top: 30upx;
		height: 40upx;
		line-height: 40upx;
	}

	.info u-icon {
		float: left;
		padding-top: 2upx;
	}

	.info .name {
		float: left;
		font-size: 26upx;
		color: #444;
		font-weight: 500;
	}

	.info .read {
		float: upx;
		color: #666;
		margin-left: 10upx;
		font-size: 26upx;
	}

	.info .collection {
		float: upx;
		color: #666;
		font-size: 26upx;
	}

	.li-item {
		display: flex;
		align-items: center;
		margin: 24upx;

		image {
			width: 180upx;
			height: 120upx;
			border-radius: 8upx;
		}

		.center {
			flex: 5;

			margin-left: 20upx;

			.title {
				color: #333333;
				font-size: 30upx;
			}

			.desc {
				margin-top: 40upx;
			}
		}

		.upx {
			background-color: #2979FF;
			height: 44upx;
			width: 119upx;
			border-radius: 20upx;
			margin-right: 10upx;

			.cs {
				font-size: 26upx;
				color: #ffffff;
				padding: 10upx 20upx;
				text-align: center;
			}
		}
	}
</style>
