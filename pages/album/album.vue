<template>
	<view class="index">
		<block v-for="(item, index) in lists" :key="index">
			<view class="row">
				<view class="card card-list2" v-for="(i,key) in item" @click="goDetail(i.attachUrl,key)" :key="key">
					<image class="card-img card-list2-img" :src="i.attachUrl"></image>

					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{i.title}}</text>
						</view>
						<view @click.stop="share(i)" class="card-share-view"></view>
					</view>
				</view>
			</view>
		</block>
		<uni-loading v-if="showPageLoading"></uni-loading>

	</view>
</template>

<script>
	import {
		getTutorAlbum
	} from '../../api/tutor.js';
	export default {

		data() {
			return {
				showPageLoading: true,
				lists: [],
				fetchPageNum: 1,
			}
		},
		onLoad(e) {
			this.getData(e);
			uni.getProvider({
				service: "share",
				success: (e) => {
					let data = [];
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								})
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log("获取登录通道失败", e);
				}
			});
		},
		onPullDownRefresh() {
			console.log("下拉刷新");
			this.getData();
		},
		onReachBottom() {
			this.getData();
		},
		methods: {
			getData(e) {
				console.log(e)
				let argu = {
					consultantId: e.id
				}
				getTutorAlbum(argu).then(res => {
					if (res.code === 0) {
						this.showPageLoading = false
						uni.stopPullDownRefresh()
						// return;
						let list = [],
							lists = [],
							data = res.data.list;
						for (let i = 0, length = data.length; i < length; i++) {
							let index = Math.floor(i / 2);
							list.push(data[i]);
							if (i % 2 == 1) {
								lists.push(list);
								list = [];
							}
						}
						console.log("list:", list)
						console.log("lists:", lists)
						// console.log("得到lists", lists);
						if (this.showPageLoading) {
							this.showPageLoading = false;
							uni.stopPullDownRefresh()
							this.lists = lists;
							this.fetchPageNum = 2;
						} else {
							this.lists = this.lists.concat(lists);
							this.fetchPageNum += 1;
						}
					}
				})

			},
			goDetail(e,i) {
				console.log(e)
				console.log(i)
				uni.previewImage({
					urls: e,
					current: i
				})

			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: "当前环境无分享渠道!",
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res
									.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' :
								"WXSceneSession",
							type: 0,
							title: "uni-app模版",
							summary: e.title,
							imageUrl: e.img_src,
							href: "https://uniapp.dcloud.io",
							success: (res) => {
								console.log("success:" + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			}
		}
	}
</script>

<style>
	.row {
		display: flex;
	}

	/*双列表*/

	.card-list2 {
		width: 345upx;
		margin: 20upx 0 20upx 20upx;
	}

	.card-list2-img {
		width: 345upx;
		height: 517upx;
	}

	.card-list2-num-view {
		transform: scale(0.8);
		transform-origin: right;
	}

	.card-list2-num {
		font-size: 22upx;
	}

	.card-list2-title {
		font-size: 26upx;
	}


	.loadMore {
		font-size: 30upx;
		color: #555;
		margin-bottom: 20upx;
	}
</style>
