<template>
	<view>
		<!-- 页面头部 -->
		<view class="header">
			<u-tabs ref="tabs" :list="tabs.items" :current="tabs.current" @change="tabsChange" height="80" active-color="#4b89ff"></u-tabs>
		</view>

		<!-- 页面主体 -->
		<swiper :style="{ height: height }" :current="tabs.current" @change="swiperChange">
			<swiper-item v-for="(tab, i) in tabs.items" :key="i">
				<articleList :list="artList" :name="'assess-detail'"></articleList>
			</swiper-item>
		</swiper>
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
	
</template>

<script>
import articleList from '@/components/article/list.vue';
import { getLessonCate } from '@/api/course.js';
import {postAssessList} from '@/api/article.js';
	export default {
		components: {
			articleList
		},
	data() {
		return {
			height: '400px', // 需要固定swiper的高度
			tabs: {
				items: [],
				current: 0
			},
			artList: [],
			is_data:false,
			showPageLoading:true
		};
	},
	
	onLoad() {
		// 需要固定swiper的高度
		this.height = uni.getSystemInfoSync().windowHeight + 'px';
		this.assessCate()
		this.getData()
		this.showPageLoading = false
	},
	methods: {
		// 打开页面
		openPage(path) {
			this.$u.route({
				url: '/pages/' + path
			});
		},
		// 提示
		tip() {
			return this.$u.toast('请先购买');
		},
		// 标签栏
		tabsChange(i) {
			this.is_data = true
			console.log(i)
			this.tabs.current = i;
			var id = this.tabs.items[i].id
			let argu = {
				categoryId:id
			}
			postAssessList(argu).then((res) => {
				console.log(res)
					if (res.code == 0) {
						if (res.data.list.length==0 ) {
							this.is_data = true
						} else {
						this.artList = res.data.list;
						}
						this.showPageLoading = false
					}
			});
		},
		
		swiperChange(e) {
			this.tabs.current = e.detail.current;
		},

		assessCate() {
			getLessonCate({
				cate: "ASSESS"
			}).then(r => {
				console.log(r.data)
				var tabsList = {
					id:"0",
					name:"全部"
				}
				r.data.unshift(tabsList)
				this.tabs.items = r.data
				console.log(this.tabs.items)
			})

		},
		getData() {
			postAssessList().then((res) => {
				console.log(res)
					if (res.code == 0) {
						var artList = [];
						this.artList = artList.concat(res.data.list);
					}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	swiper-item {
		background-color: #ffffff;
	}
	.header {
		border-bottom: 2upx solid #eeeeee;
	}
</style>

