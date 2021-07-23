<template>
	<view class="container">
		<view class="search">
			<u-search placeholder="请输入搜索关键字" v-model="keyword" :clearabled="true" :show-action="true" action-text="搜索"
				:animation="false" @custom="custom" @search="search"></u-search>
			<dropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" @confirm="screenConfirm"></dropdown>
		</view>


		<view class="empty" v-if="is_data==true">
		  <image  src="/static/no_data.png" mode="aspectFill"></image>
		</view>
		<view class="tutor-list" v-else>
			<view class="searchList" v-for="item in tutorList" :key="item.id"
				@click="goTutorIntroduced(item.id)">
				<view class="pic-left">
					<view class="avatar">
						<image :src="item.imageUrl" mode="aspectFill">
						</image>
					</view>

				</view>
				<view class="info">
					<view class="h2">
						<view class="row1">
							<text>{{item.username}}</text>
						</view>
					</view>
					<view class="personal">{{item.qualifyName}}</view>
					<view class="sign-siliao">
						<view class="sign">
							<text v-for="i in item.specialList" :key="special">{{i}}</text>
						</view>
						<view class="i icon-liaotian">
						</view>
					</view>
					<view class="famousRemark" v-if="item.style">
						<text>{{item.style}}</text>
					</view>
				</view>
			</view>

		</view>
		<uni-loading v-if="showPageLoading"></uni-loading>
	</view>
</template>

<script>
	import {
		getTutorList,
		getRegion
	} from '@/api/tutor.js';
	import dropdown from '@/components/dropdown/dropdown.vue';
	export default {
		components: {
			dropdown
		},
		data() {
			return {
				filterData: [],
				tutorList: [],
				count: 5,
				value: 2,
				paixu_value: 1,
				leixing_value: 2,
				paixu_options: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					},
					{
						label: '价格优先',
						value: 3,
					}
				],
				leixing_options: [
					{
						label: '不限',
						value: null,
					},
					{
						label: '图文咨询',
						value: 'WORD',
					},
					{
						label: '电话咨询',
						value: 'TEL',
					},
					{
						label: '面谈咨询',
						value: 'FACE',
					},
				],
				is_data: false,
				indexArr:'',
				valueArr:'',
				showPageLoading:true
			};
		},


		onShow:function(){
			this.getDictData()
			this.tutorLists()
			let switchTabId = getApp().globalData.switchTabId
			console.log(getApp().globalData.switchTabId)
			console.log(getApp().globalData.switchTabIndex)
			if (switchTabId) {
				this.indexConfirm()
			}
		},
		methods: {
			goTutorIntroduced(id) {
				uni.navigateTo({
					url: '/pages/tutor-introduced/tutor-introduced?id='+id
				});
			},
			tutorLists() {
				let argu = {
					page: "1",
					limit: "10"
				}
				getTutorList(argu).then(res => {
					if( res.code ===0 ) {
						this.tutorList = res.data.list
						this.showPageLoading = false
					}
				})
			},
			
			indexConfirm(){
				let themeId = getApp().globalData.switchTabId
				console.log(themeId)
				let argu = {
					page: "1",
					limit: "10",
					productType:themeId,
				}
				console.log(argu)
				getTutorList(argu).then(res => {
					this.tutorList = res.data.list
					getApp().globalData.switchTabId = null
					getApp().globalData.switchTabIndex = null
				})
			},
			
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			open(index) {
				// 展开某个下来菜单时，先关闭原来的其他菜单的高亮
				// 同时内部会自动给当前展开项进行高亮
				this.$refs.uDropdown.highlight();
			},
			close(index) {
				// 关闭的时候，给当前项加上高亮
				this.$refs.uDropdown.highlight(index);
			},
			sort(e) {
				console.log(e)
				let argu = {
					page: "1",
					limit: "10",
				}
				getTutorList(argu).then(res => {
					this.tutorList = res.data.list
				})
			},
			type(e) {
				let argu = {
					page: "1",
					limit: "10"
				}
				getTutorList(argu).then(res => {
					this.tutorList = res.data.list
				})
			},
			custom(e) {
				console.log(e)
				let argu = {
					username: e
				}
				getTutorList(argu).then(res => {
					if (res.data.list.length==0) {
						this.is_data = true
					} else {
						this.tutorList = res.data.list
					}
				})
			},
			getDictData() {
				var that =this
				var regionData = that.regionData
				console.log(that.regionData)
				var dictData = uni.getStorageSync('dictData')
				var eTthemeData
				var eSortData
				var screenData
				var ageData
				var qualifyData
				for ( let i = 0; i<dictData.length;i++) {
					if (dictData[i].dictType == 'productType') {
						var themeData = dictData[i].dataList
						eTthemeData = themeData.map(item => {
									return {
										name: item.dictLabel,
										id: item.dictValue
									}
								})
					}
					if (dictData[i].dictType == 'consultOrderField') {
						var sortData = dictData[i].dataList
						eSortData = sortData.map(item => {
							return {
								name: item.dictLabel,
								id: item.dictValue
							}
						})
					}
					if (dictData[i].dictType == 'orderType') {
						var ConsultationMode = dictData[i].dataList
						screenData = ConsultationMode.map(item => {
							return {
								name: item.dictLabel,
								id: item.dictValue
							}
						})
					}
					
					if (dictData[i].dictType == 'ageType') {
						var ageTypeData = dictData[i].dataList
						ageData = ageTypeData.map(item => {
							return {
								name: item.dictLabel,
								id: item.dictValue
							}
						})
					}
					
					if (dictData[i].dictType == 'qualifyType') {
						var qualifyTypeData = dictData[i].dataList
						qualifyData = qualifyTypeData.map(item => {
							return {
								name: item.dictLabel,
								id: item.dictValue
							}
						})
					}
				}
				getRegion().then((res) => {
					let all = {
						name:"全部",
						id:"0"
					}
					let allRegion = {
						name:"中国",
						id:"0"
					}
					let regionData = res.data
					eTthemeData.unshift(all)
					eSortData.unshift(all)
					regionData.unshift(allRegion)

				console.log(eTthemeData)
				console.log(eSortData)
				var filter = [{
					"name":'主题',
					"type": "hierarchy",
					"children":eTthemeData
				},
				{
					"name":'地区',
					"type": "hierarchy",
					"children":res.data
				},
				{
					"name":"排序",
					"type": "hierarchy",
					"children":eSortData
				},
				{
					"name":"筛选",
					"type": "radio",
					"children":[
						{
							"name":"咨询方式",
							"id":"1",
							"children":screenData
						},
						{
							"name":"年龄",
							"id":"2",
							"children":ageData
						},
						{
							"name":"性别",
							"id":"3",
							"children":[
								{
									"name":"男",
									"id":"F",
								},
								{
									"name":"女",
									"id":"G"
								}
							]
						},
						{
							"name":"资质选择",
							"id":"4",
							"children":qualifyData
						}
						
					]
				}
				];
				this.filterData = filter
				console.log(this.filterData)
				})
			},
			screenConfirm(e){
				console.log(e)
				var indexArr = e.index;
				var valueArr = e.id;
				let themeId = valueArr[0][0]
				let cityId = valueArr[1][0]
				let sortId = valueArr[2][0]
				let orderType = valueArr[3][0][0]
				let ageType = valueArr[3][1][0]
				let gender = valueArr[3][2][0]
				let qualifyType = valueArr[3][3][0]
				console.log(themeId)
				let argu = {
					page: "1",
					limit: "10",
					productType:themeId,
					cityId:cityId,
					orderField:sortId,
					orderType: orderType,
					ageType:ageType,
					gender:gender,
					qualifyType:qualifyType
				}
				console.log(argu)
				getTutorList(argu).then(res => {
					this.tutorList = res.data.list
				})
			}
		}
	}
</script>

<style lang="less" scoped>
@import '/style/no_data.css';
	.search {
		background-color: #ffffff;
		padding: 20upx;
		z-index: 11;
		position: fixed;
		top: 0;
		height: 100upx;
		width: 100%;
	}


	.tutor-list {
		position: relative;
		padding: 0upx 24upx;
		background-color: #ffffff;
		margin-top: 160upx;

		.searchList {
			line-height: 38upx;
			padding: 20upx 0;
			display: flex;
			.pic-left {
				width: 180upx;
				height: 220upx;
				position: relative;

				.avatar image {
					display: inline-block;
					width: 180upx;
					height: 220upx;
					border-radius: 4upx;
					background-repeat: no-repeat;
					background-size: cover;
					background-position: 50%;
					box-sizing: border-box;
					border: .5upx solid rgba(0, 0, 0, .06);
				}

				.pic image {
					position: absolute;
					bottom: 0;
					left: 1upx;
					width: 180upx;
					height: 40upx;
				}
			}

			.info {
				margin-left: 20upx;
				width: 100%;

				.h2 {
					height: 40upx;
					display: -ms-flexbox;
					display: flex;
					-ms-flex-pack: justify;
					justify-content: space-between;
					font-weight: 600;
					line-height: 40upx;
					color: #333333;

					.row2 {
						color: #ff5757;

						.info-1 {
							font-size: 28upx;
						}

						.bold {
							font-weight: 600;
						}
					}
				}

				.personal {
					color: #242424;
					font-size: 28upx;
					line-height: 36upx;
				}

				.comment {
					display: flex;
					justify-content: space-between;

					&-view {
						display: flex;
						flex-shrink: 0;

						.m-dc-star {
							color: #666;
							font-size: 26upx;

							.image {
								width: 8upx;
								height: 8upx;
								margin-right: 8upx;
							}
						}
					}
				}

				.help {
					text {
						font-size: 28upx;
						color: #666;
					}

					.number {
						color: #333;
					}
				}

				.sign-siliao {
					display: flex;
					justify-content: space-between;

					.sign {
						display: flex;
						align-items: center;

						text {
							padding: 2upx 6upx;
							height: 38upx;
							font-size: 24upx;
							color: #666;
							font-weight: 300;
							line-height: 30upx;
							margin-right: 10upx;
							border: 1upx solid #e0e0e0;
							border-radius: 4upx;
						}
					}

					.i {
						color: #fff;
						font-size: 40upx;
						width: 60upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 60upx;
						background: -webkit-linear-gradient(left, #4b89ff, #3660f9);
						background: linear-gradient(90deg, #4b89ff, #3660f9);
						font-size: 40upx;
						line-height: 60upx;
					}
				}

				.famousRemark {
					box-sizing: border-box;
					padding: 10upx 16upx;
					background-size: 0.512rem;
					margin-top: 0.512rem;
					border-radius: 0.08533rem;
					overflow: hidden;
					background: #f1f1f1;

					text {
						font-size: 24upx;
						color: #666;
						display: -webkit-box;
						overflow: hidden;
						white-space: normal;
						text-overflow: ellipsis;
						word-wrap: break-word;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
	}
</style>
