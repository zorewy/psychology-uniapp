<template>
	<view class="">
		<view class="search">
			<u-search placeholder="请输入搜索关键字" v-model="keyword" :clearabled="true" :show-action="true" action-text="搜索"
				:animation="false" @custom="custom" @search="search"></u-search>
		</view>
		
		<view class="header">
			<u-tabs ref="tabs" :list="tabs.items" :current="tabs.current" @change="tabsChange" height="80" active-color="#4b89ff"></u-tabs>
		</view>
		<!-- </view> -->
		<view class="empty" v-if="is_data==true">
			<image  src="/static/no_data.png" mode="aspectFill"></image>
		</view>
		<view v-else>
			<lessons :lessons="courseList"></lessons>
		</view>
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
</template>

<script>
	import {getLessonCate,getCourseList} from '@/api/course.js';
	export default {
		data() {
			return {
				courseList: [],
				value1: 1,
				value2: 2,
				value3: 3,
				options1: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					}
				],
				tabBarsCourse: [],
				keyword: '',
				keywords:null,
				is_data:false,
				showPageLoading:true,
				tabs: {
					items: [],
					current: 0
				},
			}
		},
		onReachBottom() {
			this.loading_status = 'loading'
			setTimeout(() => {
				this.loading_status = 'more'
			}, 1000)
			this.page++
		},
		onLoad(option) {
			console.log(option)
			this.getLessonCate();
			this.getCourseList(option);
		},
		onShow(e) {
			console.log(e)
		},
		methods: {
			navigate(id, media) {
				if (media == 'live') {
					uni.navigateTo({
						url: `/pages/broadcasting/broadcasting?id=${id}`
					});
				} else if (media == 'video' || media == 'audio') {
					uni.navigateTo({
						url: `/pages/course-details/course-details?menuid=${id}`
					});
				} else if (media == 'tuwen') {
					uni.navigateTo({
						url: `/pages/tuwen/tuwen?twid=${id}`
					});
				}
			},
			goCourseDetails:function(e) {
				let id = e.currentTarget.dataset.id;
				console.log(id)
				uni.navigateTo({
					url:`/pages/course-details/course-details?id=${id}`
				})
			},
			getCourseList(option) {
				if (option) {
					this.keywords = option.keyword
				}
				let argu = {
					title:this.keywords
				}
				getCourseList(argu).then(res => {
					this.courseList = res.data.list
					console.log(res)
				})
			},
			getLessonCate() {
				getLessonCate({
					cate: "LESSON"
				}).then(r => {
					if (r.code===0) {
						console.log(r.data)
						var tabsList = {
							id:"0",
							name:"全部"
						}
						r.data.unshift(tabsList)
						this.tabs.items = r.data
						this.showPageLoading = false
					}
				})
			},
			
			// 标签栏
			tabsChange(i) {
				this.is_data = false
				this.tabs.current = i;
				var id = this.tabs.items[i].id
				console.log(id)
				let argu = {
					categoryId:id
				}
				getCourseList(argu).then(res => {
					if (res.data.list.length == 0) {
						this.is_data = true
					} else {
						this.courseList = res.data.list
					}
				});
			},
			

			custom(e) {
				let argu = {
					title: e
				}
				getCourseList(argu).then(res => {
					if (res.data.list.length == 0) {
						this.is_data = true
					} else {
						this.courseList = res.data.list
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
@import '/style/no_data.css';
	.search {
		margin-bottom: 1upx;
		padding: 20upx;
		background: #ffffff;
	}
	.header {
		border-bottom: 2upx solid #eeeeee;
	}
	.slot-content .item-box {
		margin-bottom: 20px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	.slot-content .item-box .active {
		color: #fff;
		background-color: #2979ff;
	}

	.slot-content .item-box .item {
		border: 1px solid #2979ff;
		color: #2979ff;
		padding: 3px 16px;
		border-radius: 41px;
		margin-top: 12px;
		margin: 0 10upx;
	}

	.dropdown {
		height: 80upx;
		line-height: 80upx;
		margin-bottom: 1upx;
		background-color: #ffffff;
	}



	.course {
		background-color: #fff;
		padding: 24upx;

		&-list {
			width: 100%;

			&-item {
				display: flex;
				margin-bottom: 40upx;

				.list-pic {
					margin-right: 20upx;
					width: 160upx;
					height: 220upx;
					position: relative;

					image {
						background-size: cover;
						background-repeat: no-repeat;
						background-position: 50%;
						width: 180upx;
						height: 220upx;
						border-radius: 8upx;
					}

					u-icon {
						color: rgba(105, 105, 105, 0.28);
						width: 40upx;
						height: 40upx;
						position: absolute;
						bottom: 12upx;
						right: 12upx;
					}

				}

				.item-right {
					display: block;
					margin-left: 20upx;

					.line1 {
						font-size: 32upx;
						color: #242424;
					}

					.line2 {
						color: #242424;
						font-size: 28upx;
					}

					.line3 {
						color: #242424;
						font-size: 28upx;
					}

					.line4 {
						display: flex;

						.price {
							font-size: 28upx;
							color: #ff5757;
						}

						.popularity {
							font-size: 28upx;
							color: #666666;
						}
					}
				}
			}
		}
	}
</style>
