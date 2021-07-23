<template>
	<view class="page">
		<template v-if="!type">
			<view class="video-wrap">
				<video id="myVideo" class="video-wrap" :src="media_url" :poster="imageUrl" controls="true"
					autoplay="true" muted="false" enable-danmu @fullscreenchange="fullchange"
					playbackRate @loadedmetadata="loadvideo">
					<!-- 倍速播放 h5支持较差 -->
					<cover-view class="video-control">
						<cover-view class="multi rate" @tap="showSwitchRate">x {{ currentRate }}</cover-view>
					</cover-view>
					<cover-view class="multi-list rate" :class="{ active: rateShow }">
						<cover-view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index"
							class="multi-item rate" :data-rate="item" @tap="switchRate"
							:class="{ active: item == currentRate }">
							{{ item }}
						</cover-view>
					</cover-view>
				</video>
			</view>
			<view class="container">
				<view class="top">
					<view class="mulu">
						<text>课程目录</text>
					</view>
					<view class="xj">
						<text>{{secctionData.length}}小节</text>
					</view>
				</view>
				<view class="con">
					<view class="secction" v-for="(item,index) in secctionData" :key="item.id" @click="play(item.videoUrl)">
						<view class="secction-list">
							<text class="i icon-bofang"></text>
							<text class="name">{{item.title}}</text>
						</view>
					</view>
				</view>
			</view>
		</template>
<!-- 		<template v-else-if="type == 3">
			<view class="video-wrap3">
				<image :src="imageUrl" class="video-wrap">
				</image>
				<imt-audio autoplay class="imtaudio" :src="media_url"></imt-audio>
			</view>
		</template> -->
		<template v-else>
			<view class="cdetail-all-wrap">
				<view class="content-title">{{title}}</view>
<!-- 				<view class="content-des">{{des}}</view>
				<view class="content-time">{{adddtime}}</view> -->
				<view class="content-wrap">
					<rich-text class="content" :nodes="content"></rich-text>
				</view>
			</view>
			<!-- 目录 -->
			<u-popup v-model="sidebar" width="550rpx" :safe-area-inset-bottom="false" z-index="999">

				<u-cell-group title="课程小节">
					<u-cell-item :title="item.title" title-width="500" v-for="(item,index) in secctionData" :key="item.id" @click="goToChapter(item.id,index)"></u-cell-item>
				</u-cell-group>
			</u-popup>
			<!-- 底部菜单 -->
			<view mode="bottom" :mask="false" z-index="998">
				<view class="bottom_set">
<!-- 					<u-grid class="u-padding-top-35 u-padding-bottom-10" :col="3" :border="false">
						<u-grid-item style="background:rgba(0,0, 0, 0);" @click="tabside">
							<u-icon name="arrow-left-double" :size="46"></u-icon>
							<view class="grid-text">上一节</view>
						</u-grid-item>
						<u-grid-item style="background:rgba(0,0, 0, 0);" @click="tabside">
							<u-icon name="list-dot" :size="46"></u-icon>
							<view class="grid-text">目录</view>
						</u-grid-item>
						<u-grid-item style="background:rgba(0,0, 0, 0);" @click="tabside">
							<u-icon name="arrow-right-double" :size="46"></u-icon>
							<view class="grid-text">下一节</view>
						</u-grid-item>
					</u-grid> -->
					<button type="default" @click="tabside">目录</button>
				</view>
			</view>
		</template>
		
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
</template>

<script>
	const app = getApp();
	import {
		getCourseDetails,
		classHourList,
		classHourdetail
	} from '@/api/course.js';
	import imtAudio from '@/components/imt-audio/imt-audio.vue';
	export default {
		components: {
			imtAudio
		},
		data() {
			return {
				live_info: {},
				title: '',
				adddtime: '',
				content: '',
				des: '',
				media_url: '',
				type: false,
				imageUrl: '',
				duration: '',
				currentTime: 0,
				videoContext: '',
				buttonimage: '',
				status: 1,
				start: '',
				end: '',
				playCurrent: 0,
				videoDuration: 0, //视频时长
				rateShow: false, // 倍速浮层
				currentRate: 1.0, // 默认倍速	
				fullScreen: false, //是否全屏
				switch_btn: {
					bj_color: '#FFFFFF',
					checked_bj_color: '#38E1AB'
				},
				showPageLoading: true,
				detailData: [],
				secctionData:[],
				sidebar: false,
				class_index:0,
				class_index_id:''
			}
		},

		onLoad(e) {
			console.log(e)
			this.getCourseDetail(e)
			this.getClassHourList(e)
		},
		methods: {
			getCourseDetail(e) {
				// 获取课程详情
				let articleId = e.id
				this.menuid = e.menuid
				this.id = articleId
				getCourseDetails({
					articleId
				}).then(res => {
					if (res.code === 0) {
						this.detailData = res.data;
						this.showPageLoading = false
						// #ifdef H5
						var courseDetails = res.data
						if (userinfo && userinfo.uid) {
							var link = window.location.href + '&pid=' + userinfo.uid
						} else {
							var link = window.location.href
						}
						if (this.$jwx && this.$jwx.isWechat()) {
							this.$jwx.share({
								'title': courseDetails.menuname,
								'desc': courseDetails.jianjie,
								'link': link,
								'img_url': courseDetails.imageUrl,
							})
							this.$jwx.sharepyq({
								'title': courseDetails.menuname,
								'link': link,
								'img_url': courseDetails.imageUrl,
							})
						}
						// #endif
					}
				})
			},

			// 获取课时目录
			getClassHourList(e) {
				let articleId = e.id
				classHourList({
					articleId
				}).then(res => {
					if (res.code === 0) {
						console.log(res.data)
						this.secctionData = res.data;
						var index = this.class_index
						var inde_id = res.data[index].id
						this.class_index_id = inde_id
						this.getClassHourdetail(inde_id)
						this.showPageLoading = false
					}
				})
			},
			
			//获取课时详情
			getClassHourdetail(e) {
				let argu = {
					id:e
				}
				classHourdetail(argu).then(res => {
					if (res.code === 0) {
						console.log(res.data)
						if (res.data.videoUrl=='') {
							this.type = true
							this.content = res.data.content
							this.title = res.data.title
						} else {
							this.type = false
							this.media_url = res.data.videoUrl;
							console.log(this.media_url)
						}
						this.showPageLoading = false
					}
				})
			},
			
			

			// 显示倍速浮层
			showSwitchRate(rate) {
				let that = this;
				that.rateShow = true;
			},
			// 切换倍速
			switchRate(e) {
				let that = this;
				let rate = Number(e.currentTarget.dataset.rate);
				that.currentRate = rate;
				that.rateShow = false;
				this.videoContext.playbackRate(rate);
			},
			//视频加载完成事件 仅小程序h5支持
			loadvideo(e) {
				this.videoDuration = e.detail.duration; //视频时长
				// this.getHorseLamp();
			},


			pause() {
				if (this.status == 0) {
					this.status = 1;
					this.videoContext.play();
					this.buttonimage = '../../static/voice2.png';
				} else {
					this.status = 0;
					this.videoContext.pause();
					this.buttonimage = '../../static/voice.png';
				}
			},
			// 拖动进度条
			sliderChange(data) {
				this.videoContext.seek(data.detail.value);
			},

			//拖动中
			sliderChanging(data) {
				this.currentTime = data.detail.value;
				this.start = this.calcTimer(data.detail.value);
			},
			calcTimer(timer) {
				if (timer === 0 || typeof timer !== 'number') {
					return '00:00'
				}
				let mm = Math.floor(timer / 60)
				let ss = Math.floor(timer % 60)
				if (mm < 10) {
					mm = '0' + mm
				}
				if (ss < 10) {
					ss = '0' + ss
				}
				return mm + ':' + ss
			},
			// 播放视频
			play (e) {
				this.media_url = e
			},
			// 展开目录
			tabside(){
				this.sidebar = !this.sidebar;
			},

			/**
			 * 跳转到指定章节
			 **/
			async goToChapter(id,index) {
				console.log(id)
				console.log(index)
				console.log(this.secctionData)
				this.showPageLoading = true
				this.class_index = index
				this.progressTouched = false;
				this.tabside();
				await this.getClassHourdetail(id);
				setTimeout(() => {
					this.showPageLoading = false
				}, 500);
			},
			/**
			 * 跳转下一章
			 **/
			goNextChapter() {
				if (this.curChapter.chapterIndex === this.directoryList.length - 1) {
					uni.showToast({
						title: '已经是最后一章了',
						icon: 'none'
					});
					return;
				}
				if (this.waitForNext || this.waitForPre) {
					return;
				}
				if (this.nextChapter.ready) {
					this.chapterRotate('next');
					this.goToPage(0);
				} else {
					uni.showLoading({
						title: '正在准备下一章'
					});
					this.waitForNextChapter = true;
				}
			},
			
			/**
			 * 跳转上一章
			 **/
			goPreChapter(page) {
				if (this.curChapter.chapterIndex === 0) {
					uni.showToast({
						title: '这是第一章',
						icon: 'none'
					});
					return;
				}
				if (this.waitForNext || this.waitForPre) {
					return;
				}
				if (this.preChapter.ready) {
					this.chapterRotate('pre');
					this.goToPage(0);
				} else {
					uni.showLoading({
						title: '正在准备上一章'
					});
					this.waitForPreChapter = true;
				}
			},
		}
	}
</script>

<style lang="scss">
	@import url("../../common/beisu.css");

	.page {
		width: 100%;
	}

	.button {
		margin-top: 20upx;
		width: 80upx;
		height: 80upx;

	}

	.mm {
		padding-left: 20upx;
	}

	.ss {
		padding-right: 20upx;
	}

	.hidden {
		position: fixed;
		z-index: -1;
		width: 1upx;
		height: 1upx;
	}

	.slider-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 26upx;
		color: #999;
	}

	.slider {
		padding-left: 20upx;
		padding-right: 20upx;
		width: 100%;
	}


	.live-all-wrap {
		background-color: #F4F5F6;
	}

	.video-wrap {
		text-align: center;
		width: 100%;
		height: 400upx;
		background-color: #000000;
		position: relative;
	}

	.controls-title {
		color: #F7F7F7;
		position: absolute;
		bottom: 40upx;
	}

	.video-wrap3 {
		text-align: center;
		width: 100%;
		height: 550upx;
	}

	.audio {
		width: 92%;
		height: 40upx;
		padding-left: 10upx;
		padding-right: 10upx;
	}

	.cdetail-all-wrap {
		width: 94%;
		margin: 0 auto;
	}

	.line {
		background-color: #F5F5F5;
		height: 1upx;
		position: absolute;
		left: 20upx;
		right: 20upx;
		margin-top: -20upx;
	}

	.content-title {
		height: 40upx;
		font-weight: bold;
		margin-left: 20upx;
	}

	.content-des {
		margin-top: 20upx;
		margin-left: 20upx;
		color: #969696;
		font-size: 20upx;
	}

	.content-time {
		margin-left: 20upx;
		font-size: 20upx;
		color: #969696;
		margin-top: 10upx;
		margin-bottom: 40upx;
	}

	.content-wrap {
		margin: 0 auto;
		overflow: hidden;
		width: 92%;
	}


	.switch-wrap {
		position: absolute;
		top: 90upx;
	}
	
	.container {
		background-color: #ffffff;
		padding-bottom: 100upx;
		.top {
			padding: 48upx 24upx 34upx 24upx;
			
			.mulu {
				color: #222222;
				font-weight: 600;
				font-size: 34upx;
			}
			.xj {
				color: #555555;
				font-size: 28upx;
				font-weight: 400;
			}
		}
		.con {
			padding: 14upx 22upx 14upx 20upx;
			box-shadow: 0upx 0upx 10upx 0upx rgba(0, 0, 0, 0.08);
			border-radius: 4upx;
			margin: 0 30upx;
			.secction {
				margin: 20upx 0;
				&-list {
					display: flex;
					align-items: center;
					.i {
						font-size: 30upx;
						color: #333333;
					}
					.name {
						margin-left: 20upx;
						color: #444444;
						font-size: 30upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				} 
			}
		}
	}
	.bottom_set {
		position: fixed;
		width: 100%;
		bottom: 0;
		button {
			width: 100%;
			background-color: #2979FF;
			font-size: 32upx;
			color: #ffffff;
		}
	}
	.u-cell_title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
