<template>

	<view class="brief">
		<view class="brief-top">
			<image src="../../static/kechengjianjie.png" mode=""></image>
			<text>服务类型</text>
		</view>

		<view class="selectType">
			<view class="defa" :class="activeIndex==index?'active':''" v-for="(item,index) in priceDtoList" :key="index"
				@tap="tapInfo(index)">
				<view class="type-flex">
					<text>{{item.orderType=='WORD' ?'图文咨询':''}}</text>
					<text>{{item.orderType=='VOICE' ?'语音咨询':''}}</text>
					<text>{{item.orderType=='TEL' ?'视频咨询':''}}</text>
					<text>{{item.orderType=='FACE' ?'面谈咨询':''}}</text>
				</view>
				<view class="money">
					<text>{{item.amount}}元</text>
				</view>

			</view>

		</view>
		<view class="">
			<times :tutorId="tutorId" @change="getTime"></times>
		</view>

	</view>

</template>

<script>
	import {getTutorDetail,getConsultTimes} from "@/api/tutor.js"
	import times from '@/components/pretty-times/pretty-times.vue';
	export default {
		components: {
			times
		},

		data() {
			return {
				priceDtoList: [],
				activeIndex: 0,
				money: 0,
				tutorId: null,
				radio: [],
				radio1: [{
					name: '图文咨询',
					value: '0',
					checked: true
				}, {
					name: '电话咨询',
					value: '1',
					checked: false
				}, {
					name: '视频咨询',
					value: '2',
					checked: false
				}, {
					name: '面谈咨询',
					value: '3',
					checked: false
				}],
				orderType:''
			};
		},
		onLoad(option) {
			console.log(option.id)
			this.getType(option);
			// this.getConsultDate(option)
			this.tutorId = option.id
		},
		methods: {
			// 获取咨询类型
			getType(e) {
				getTutorDetail({
					id: e.id
				}).then(res => {
					console.log(res.data.priceDtoList)
					this.priceDtoList = res.data.priceDtoList
					var orderType = this.priceDtoList[0].orderType
					this.orderType = orderType
				})
			},
			
			
			getConsultTimes() {
				getConsultTimes({
					consultantId: e.id,
					consultDate:e.id
				}).then(res => {
					console.log(res.data.priceDtoList)
					this.priceDtoList = res.data.priceDtoList
				})
			},
			//check区域
			radioChange(e) {
				for (let i = 0, len = this.radio.length; i < this.radio.length; i++) {
					this.radio[i].price == e.detail.value ? this.radio[i].checked = true : this.radio[i].checked = false;
				}
				this.$forceUpdate();
				console.log('radio-group:', e.detail.value);
			},
			// 选择咨询方式
			tapInfo(e) {
				console.log(e) //打印下标
				this.activeIndex = e;
				console.log(this.activeIndex)
				var money = this.priceDtoList[e].amount;
				var orderType = this.priceDtoList[e].orderType
				this.money = money
				this.orderType = orderType
			},

			checkboxChange(e) {
				for (let i = 0, len = this.checkbox.length; i < len; i++) {
					e.detail.value.includes(this.checkbox[i].value) ? this.checkbox[i].checked = true : this.checkbox[i]
						.checked =
						false;
				}
				// 循环并没有更新到视图层上,使用VUE方法强制渲染
				this.$forceUpdate();
				console.log('checkbox-group:', e.detail.value)
			},
			// 预约时间选择
			getTime(e) {
				if(e) {
				uni.navigateTo({
					url: '/pages/appointment/appointment?consultantTimeIds=' + [e] + '&consultantId=' + this.tutorId + '&orderType=' + this.orderType
					+ '&money=' + this.money
				});
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.selectType {
		display: flex;
		align-items: center;
		margin: 10upx 0 40upx 0;

		.type-flex {
			text-align: center;
		}

		.money {
			text-align: center;
		}
	}

	.defa {
		width: 25%;
		margin-right: 10upx;
		border: 1upx solid #e6e6e6;
		padding: 4upx 10upx;

	}

	.active {
		width: 25%;
		margin-right: 10upx;
		border: 1upx solid #e6e6e6;
		padding: 4upx 10upx;
		background-color: #649bff;
	}

	.brief {
		margin-top: 20upx;
		background-color: #fff;
		padding: 20upx 24upx;

		&-top {
			height: 75upx;
			display: flex;

			image {
				width: 53upx;
				height: 49upx;
			}

			text {
				font-size: 26upx;
				font-weight: 700;
				color: #020202;
				margin-left: 15upx;
				margin-top: 4upx;
			}
		}
	}

	.selectType {
		width: 100%;
		background-color: #fff;
	}

	.sunui-radio-label,
	.sunui-chekcbox-label {
		flex: 1;
		font-size: 28upx;
		padding: 10upx 20upx;
		margin: 10upx;
		margin-left: 0;
		text-align: center;
		background-color: #fff;
		border-radius: 5upx;
		border: 1upx solid #2196F3;
	}

	.sunui-radio-checkd,
	.sunui-checkbox-checkd {
		color: #fff;
		background-color: #2196F3;
	}

	.sunui-radio-group,
	.sunui-checkbox-group {
		display: flex;
		flex-wrap: wrap;
	}

	.sunui-radio-group radio,
	.sunui-checkbox-group checkbox {
		display: none;
	}
	
	.u-icon {
	    position: fixed;
	    right: 0rpx;
	    width: 40rpx;
	    height: 120rpx;
	    background: #fff;
	}
</style>
