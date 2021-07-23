<template>
	<view class="container">
		<view class="header">
			<image :src="tInfo.imageUrl" mode="aspectFill"></image>
			<view class="header_introduce1">
				<view class="int_row1">
					<text>{{tInfo.username}}</text>
				</view>
				<view class="int_row2">
					<text class="label">{{tInfo.style}}</text>
				</view>
				<view class="int_row3">{{tInfo.qualifyName}}</view>
				<view class="int_row4">
					<view class="df">
						<text v-for="item in specialList" :key="specialList">{{item}}</text>
					</view>
					<!-- 					<view class="tabsLists">
						<text>名片</text>
					</view> -->
				</view>
			</view>
			<view class="header_introduce2">
				<view class="int_row1">
					<view class="left">

						<text>{{score}}</text>
						
					</view>
					<view class="right">
						<view class="inline">
							<view class="zmhfont DINCond-Bold">{{praiseRate}}</view>
							<view class="label">好评率</view>
						</view>
						<view class="inline">
							<view class="zmhfont DINCond-Bold">{{consultTimes}}</view>
							<view class="label">帮助人数</view>
						</view>
						<view class="inline">
							<view class="zmhfont DINCond-Bold">{{fansNum}}</view>
							<view class="label">粉丝数量</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tbady">
			<view class="tabs">
				<liuyuno-tabs :tabData="tabs" :activeIndex="activeIndex" :config="defaultConfig"
					@tabClick="tabClick($event)" />
			</view>

			<view class="show" v-show="current==0">

				<view class="kcjs-brief">
					<view class="kcjs-brief-top">
						<text>教育背景</text>
					</view>
					<view class="edu-step">
						<view class="line1" v-for="item in educationDtoList" :key="education">
							<text>{{item.school}}</text>
						</view>
					</view>
				</view>


				<view class="kcjs-brief">
					<view class="kcjs-brief-top">
						<text>擅长领域</text>
					</view>
					<view class="edu-step">
						<view class="line1" v-for="item in specialList" :key="specialList">
							<text>{{item}}</text>
						</view>
					</view>
				</view>

				<view class="kcjs-brief" @click="goAlbum">
					<view class="kcjs-brief-top">
						<text>个人相册</text>
					</view>
					<!-- 个人相册 -->
					<view class="tutor-list">
						<view class="tutor-list-item" v-for="item in albums" :key="item.id">
							<image :src="item.attachUrl" mode="aspectFit"></image>
						</view>
					</view>
				</view>

			</view>

			<view class="rate" v-show="current==1">
				<view class="no_review" v-if="commentList.length<1">
					<image src="../../static/images/no_revre.png"></image>
					<text>暂无评价信息~</text>
				</view>
				<view class="kcjs-brief" v-else>
					<view class="kcjs-brief-top">
						<text>评价列表</text>
					</view>


					<view class="rete-box" v-for="(item,index) in commentList" :key="comment">
						<view class="rate-tit">
							<view class="img">
								<image :src="item.imageUrl" mode="aspectFill"></image>
							</view>
							<view class="name">
								<text>{{item.nickName}}</text>
							</view>
						</view>
						<view class="rate-list">
							<text>{{item.remarks}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="buy">
			<view class="buy-left" @click="addCollec">
				<text class="i icon-xingxing" style="color:#666666" v-if="!is_favorite"></text>
				<text class="i icon-xingxing" style="color:#ff5757" v-else></text>
				<text class="is_text" v-if="!is_favorite">关注</text>
				<text class="is_text" style="color:#ff5757" v-else>已关注</text>
			</view>
			<button class="buy-left sharebtn" @click.native="goChat(tInfo.id)">
				<text class="i icon-IMliaotian-shixin"></text>
				<text class="is_text">私聊</text>
			</button>
			<view class="buy-right" v-if="is_appointment">已经预约</view>
			<view class="buy-right" @click="appointment" v-else>立即预约</view>
		</view>
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
</template>

<script>
	import {
		getTutorDetail,
		postComment
	} from "@/api/tutor.js";
	import {
		addFollow,
		cancelFollow
	} from "@/api/userinfo.js";
	import {
		getChat
	} from '@/api/login_reg.js';
	import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
	export default {
		components: {
			liuyunoTabs
		},
		data() {
			return {
				tabsArray: ['介绍', '评价'],
				tabs: [{
						state: 1,
						name: '介绍'
					},
					{
						state: 2,
						name: '评价'
					}
				],
				current: 0,
				value: 2,
				tInfo: [],
				albums: [],
				practicDtoList: [],
				productDtoList: [],
				specialList: [],
				trains: [],
				educationDtoList: [],
				rateNum: 0,
				notes: [],
				tutorId: "",
				commentList: [],
				is_appointment: false,
				is_favorite: false,
				cColor: "color:#666666",
				shoucang: "收藏",
				showPageLoading: true,
				praiseRate:'',
				consultTimes:'',
				fansNum:null,
				score:''
			};
		},

		onLoad(option) {
			console.log(option)
			getTutorDetail({
				id: option.id
			}).then(res => {
				if (res.code === 0) {
					this.tInfo = res.data,
						this.albums = res.data.albums,
						this.practicDtoList = res.data.practicDtoList,
						this.productDtoList = res.data.productDtoList,
						this.specialList = res.data.specialList,
						this.trains = res.data.trains,
						this.educationDtoList = res.data.educationDtoList,
						this.notes = res.data.notes,
						this.is_favorite = res.data.favorite;
						this.praiseRate = res.data.praiseRate
						this.consultTimes = res.data.consultTimes
						this.fansNum = res.data.fansNum
						this.score = res.data.score
					let is_favorite = res.data.favorite
					if (is_favorite) {
						this.cColor = "color:#e54148"
						this.shoucang = "已收藏"
					}
					this.showPageLoading = false
				}
			})
			this.tutorId = option.id;
		},

		methods: {
			// tabs栏
			tabClick(index, name) {
				// 点击的index
				console.log(index, name);
				// 获取点击的数据
				console.log(this.tabs[index]);
				this.current = index;
				//获取咨询师评价
				let argu = {
					consultantId: this.tutorId
				}
				postComment(argu).then((res) => {
					this.commentList = res.data.list
				})
			},
			tabArrayClick(index, name) {
				// 点击的index
				console.log(index, name);
				// 获取点击的数据
				console.log(this.tabsArray[index]);
			},
			// 私聊
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

			goAlbum() {
				uni.navigateTo({
					url: `/pages/album/album?id=` + this.tutorId
				})
			},
			// 去课程详情页面
			goCourseDetails(id) {
				uni.navigateTo({
					url: `/pages/course-details/course-details?menuid=${id}`
				})
			},
			// 去预约
			appointment() {
				uni.navigateTo({
					url: '/pages/beforehand/beforehand?id=' + this.tutorId
				})
			},
			//添加个人关注
			addCollec: function(e) {
				// if (getApp().globalData.token.length < 1) {
				//   loginNow();
				//   return false
				// }
				var is_favorite = this.is_favorite;
				if (!is_favorite) {

					// 关注接口
					var refId = this.tInfo.id;
					var argu = {
						id: refId
					}
					addFollow(argu).then((res) => {
						if (res.code == 0) {
							this.is_favorite = true
							uni.showToast({
								title: '关注成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: '关注失败！',
								icon: 'error'
							})
						}
					});
				}
				//取消关注
				else if (is_favorite) {
					if (getApp().globalData.token.length < 1) {
						loginNow();
						return false
					}
					var refId = this.tInfo.id;

					// 取消关注
					var argu = {
						id: refId
					}
					cancelFollow(argu).then((data) => {
						if (data.code === 0) {
							this.is_favorite = false
							uni.showToast({
								title: '取消成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: '取消失败',
								icon: 'error'
							})
						}
					});
				}
			},
			goTutorIntroduced(id) {
				console.log(id)
				uni.navigateTo({
					url: '../album/album?id=' + id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		background-color: #F3F4F8;
		width: 100vw;
		box-sizing: border-box;
	}

	.header {
		position: relative;
		height: 600upx;
		margin-bottom: .256rem;
		position: relative;

		image {
			width: 100%;
			height: 600upx;
		}

		.header_introduce1 {
			position: absolute;
			bottom: 100upx;
			left: 0;
			right: 0;
			padding: 2.304rem .64rem 1.23733rem;
			color: #fff;
			background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .6));

			.int_row1 {
				font-weight: 700;
				font-size: 40upx;

				.left {}

				.right {}
			}

			.int_row2 {
				.label_common {
					padding: 20upx 40upx;
					border-radius: 20upx;
					color: #fff;
					font-size: 32upx;
					margin-right: 20upx;
					background-image: linear-gradient(90deg, #ff9500, #f07c00);
				}
			}

			.int_row3 {
				font-size: 30upx;
				line-height: 40upx;
				margin-bottom: 20upx;
				display: -webkit-box;
				overflow: hidden;
				white-space: normal;
				text-overflow: ellipsis;
				word-wrap: break-word;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.int_row4 {
				display: flex;
				justify-content: space-between;

				.df {

					text {
						font-weight: 300;
						line-height: 40upx;
						padding: 4upx 20upx;
						font-size: 24upx;
						border-radius: 20upx;
						background: hsla(0, 0%, 88%, .2);
						margin-right: 20upx;
					}
				}

				// .tabsLists {
				// 	text {
				// 		font-size: 30upx;
				// 		margin-right: 20upx;
				// 		padding-right: 20upx;
				// 		border-right: 1upx solid hsla(0, 0%, 100%, .3);
				// 	}
				// }
			}
		}

		.header_introduce2 {
			position: absolute;
			top: 480upx;
			left: 0;
			right: 0;
			padding: 30upx 40upx;
			background: #fff;
			border-radius: 20upx 28upx 0 0;

			.int_row1 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-size: 40upx;
					height: 60upx;
					line-height: 60upx;
					color: #ff5757;
					font-weight: 600;
				}

				.right {
					font-size: 30upx;
					display: inline-flex;

					.inline {
						display: inline-block;
						text-align: center;
						margin-left: 20upx;

						.zmhfont {
							line-height: 60upx;
							font-size: 40upx;
							color: #242424;
						}

						.label {
							font-weight: 300;
							font-size: 24upx;
							line-height: 40upx;
							color: #333333;
						}
					}
				}
			}
		}
	}

	.tbady {
		padding: 0 24upx;
		background-color: #fff;
		margin-bottom: 100upx;
		margin-top: 50upx;
	}

	.guarantee {
		display: flex;
		align-items: center;
		margin-top: 60upx;
		padding-top: 20upx;

		.pic {
			width: 60upx;
			height: 60upx;
			flex: 1;

			image {
				width: 40rpx;
				height: 52rpx;
				padding: 2upx;
			}
		}

		.con {
			display: inline-block;
			flex: 10;

			.title {
				font-weight: 400;
				font-size: 30upx;
				line-height: 42upx;
				color: #242424;
			}

			.ensure_con {
				font-size: 28upx;
				display: flex;

				.lab {
					font-size: 24upx;
					line-height: 36upx;
					margin-right: 20upx;
					color: #666;
					font-weight: 300;
				}
			}

		}

		.ico {
			flex: .6;
		}
	}



	.kcjs {
		&-brief {
			margin-top: 10upx;
			margin-bottom: 10upx;

			&-top {
				height: 68upx;
				line-height: 68upx;

				text {
					font-size: 32upx;
					color: #020202;
					font-weight: 500;
				}
			}
		}
	}

	// 个人相册
	.tutor-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		&-item {
			width: 218upx;
			height: 180upx;
			background-color: #fff;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: column;

			image {
				width: 218upx;
				height: 180upx;
			}

		}
	}

	.edu-step {
		display: flex;

		.line1 {
			font-size: 28rpx;
			color: #545454;
			background: #f1f1f1;
			margin: 10rpx 20rpx;
			border-radius: 20rpx;
		}

		text {
			padding: 12rpx 26rpx;
		}
	}

	.rate {
		background-color: #fff;
		padding-bottom: 100rpx;

		.rete-box {
			display: block;
			margin-bottom: 20upx;

			.rate-tit {
				display: flex;

				.img {
					width: 68upx;
					height: 68rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.name {
					margin-left: 20upx;
					font-size: 32upx;
				}
			}

			.rate-list {
				width: 100%;
				padding: 20upx 0;
			}
		}
	}

	.buy {
		width: 100%;
		height: 122upx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		// border-radius: 40upx 40upx 0 0;
		border-top: 1rpx solid #eee;

		&-left {
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;

			.is_text {
				margin-top: 15upx;
				font-size: 24upx;
				color: #888888;
			}

			.i {
				font-size: 40rpx;
				color: #777777;
			}
		}

		.sharebtn {
			margin: 0;
			padding: 0;
			outline: none;
			border-radius: 0;
			background-color: transparent;
			line-height: inherit;
			width: max-content;
		}

		.sharebtn:after {
			border: none;
		}

		&-right {
			width: 450upx;
			height: 80upx;
			background-image: linear-gradient(to right, #4498ff, #1763ff);
			border-radius: 80upx;
			font-size: 34upx;
			font-weight: 700;
			color: #fff;
			// border: 3upx solid #fff;
			text-align: center;
			line-height: 80upx;
			box-shadow: 0rpx 2rpx 2rpx 1rpx #8dbeff;
			letter-spacing: 7rpx;
		}
	}

	.no_review {
		box-sizing: border-box;
		margin-top: 80upx;
		image {
			display: block;
			width: 128rpx;
			height: 66rpx;
			margin: 20rpx auto;
		}

		text {
			display: block;
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			color: #666;

		}
	}
</style>
