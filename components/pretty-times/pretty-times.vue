<template>
	
	<view class="content">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="container">
			<!-- 日期列表 -->
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item,index) in dateArr" :key="index">
					<view class="flex-box" @click="selectDateEvent(index,item)" :style="{'border-bottom':index==dateActive ? '2px solid  #FB4B5C' : ''}">
						<view class="date-box" :style="{color:index==dateActive?selectedTabColor:'#333'}">
							<text  style="font-weight: bold;">{{item.week}}</text>
							<text class="small-date">{{item.date}}</text>
						</view>
					</view>
				</block>
				<view class="i icon-arrow" v-if="dateArr.length>=5"></view>
			</scroll-view>
			<!-- 时间选项 -->
			<view class="time-box">
				<block v-for="(item,_index) in timeArr" :key="_index">
					<view class="item">
						<view class="item-box" :class="{'disable':item.disable,'active':_index==timeActive}" 
						:style="{color:_index==timeActive?selectedItemColor:'#333'}" @click="selectTimeEvent(_index,item)">
							<text>{{item.startTime}}</text>
							<text>-</text>
							<text>{{item.endTime}}</text>
							<!-- <text class="all">{{item.disable?disableText:undisableText}}</text> -->
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="bottom">
			<view class="show_time">
				预约时间:{{ordertime}}
			</view>
			<button form-type="submit" type="default" size="mini" class="buybtn" @click="getTime">
				立即预约
			</button>

		</view>
	</view>
</template>

<script>
	import { getConsultDate,getConsultTimes } from '@/api/tutor.js'
	import {
		dateData,
		timeData,
		timeStamp,
		currentTime
	} from '../utils/date.js'
	export default {
		name: 'times',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			tutorId:{
				type: String
			},
			disableText: { //禁用显示的文本
				type: String,
				default: "已约满"
			},
			undisableText: { //未禁用显示的文本
				type: String,
				default: "可预约"
			},
			timeInterval: { // 时间间隔，小时为单位
				type: Number,
				default: 1
			},
			selectedTabColor: { // 日期栏选中的颜色
				type: String,
				default: "#FB4B5C"
			},
			selectedItemColor: { // 时间选中的颜色
				type: String,
				default: "#FB4B5C"
			},
			
			appoTime: { // 预约的时间
				type: Array,
				default () {
					return ['2020-12-05 17:00:00', '2020-12-06 09:00:00']
				}
			}
		},
		data() {
			return {
				ordertime: '暂无选择', // 选中时间
				dateArr: [], //日期数据
				timeArr: [], //时间数据
				nowdata: '', // 当前日期
				timeQuery: '', // 用于日期对比,选中的日期
				dateActive: 0, //选中的日期索引
				timeActive: 0, //选中的时间索引
				selectDate: '', //选择的日期
				selectTime: '', //选择的时间
				selectTimeId: '',
				currentTime: '', //当前时分秒
				
			}
		},
		created(props) {
			this.nowdata = currentTime()
			this.timeQuery = currentTime()
		},
		mounted() {
			this.setOnload(this.tutorId)
			console.log(this.tutorId);
		},
		methods: {
			setOnload(e) {
				console.log(e)
				
				getConsultDate({
					id: e
				}).then(res => {
					console.log(res.data.priceDtoList)
					this.dateArr = res.data
					var dateNow = res.data[0]
					console.log(this.dateArr)
					this.getConsultTimes(dateNow)
			
				// this.dateArr = dateData() // 日期栏初始化
				// this.timeArr = timeData('09:00:00', '19:00:00', 2) //时间选项初始化
				this.selectDate = this.dateArr[0].date //默认选中的日期
				// let dateNow = this.dateArr[0].date
				this.currentTime = timeStamp(Date.now()).hour //当前时分秒
				let ifFullTime = true
				this.timeArr.forEach((item, index) => {
					if (this.timeQuery == this.nowdata) { //判断是当前这一天
						if (this.currentTime > item.time) { //选中时间小于当前时间则禁用
							item.disable = 1
						}
					}
					// 将预约的时间禁用
					this.appoTime.forEach(items => {
						console.log(items.split(' ')[0], this.selectDate)
						if (items.split(' ')[0] == this.selectDate) {
							if (item.time == items.split(' ')[1]) {
								item.disable = 1
							}
						}

					})
					if (item.disable == 0) { // 判断是否当前日期时间都被预约
						ifFullTime = false
					}
				})
				if (ifFullTime) {
					this.ordertime = this.timeQuery
					this.timeActive = -1
				}
				
				// 选出默认值
				this.timeArr.some((item, index) => {
					this.selectTime = this.timeArr[index].startTime + '-' + this.timeArr[index].endTime; //默认选中的时间
					this.selectTimeId = this.timeArr[index].id
					this.ordertime = this.timeQuery + ' ' + this.selectTime
					this.timeActive = index //选中的时间索引
					return !item.disable
				})
				})
			},
			selectDateEvent(index, item) {
				this.dateActive = index
				this.timeArr = []
				this.timeQuery = item.date
				this.selectDate = `${this.dateArr[index]['date']}`
				// this.setOnload()
				this.getConsultTimes(item)
			},

			selectTimeEvent(index, item) {
				if (item.disable) return
				this.timeActive = index
				this.selectTime = this.timeArr[index].startTime + '-' + this.timeArr[index].endTime;
				this.selectTimeId = this.timeArr[index].id
				this.ordertime = this.timeQuery + ' ' + item.startTime + '-' + item.endTime;
			},
			// 时间段
			getConsultTimes(item) {
				// var date = new Date(item.replace(/-/,"/")) 
				getConsultTimes({
					id: this.tutorId,
					consultDate:item.date
				}).then(res => {
					this.timeArr = res.data
				})
			},
			getTime() {
				// let time = `${this.dateArr[this.dateActive]['date']}` + ' ' + this.selectTime //默认选中的日期
				// console.log(time)
				if (!this.selectTime) {
					this.$refs.uTips.show({
						title: '请选择预约时间',
						type: 'error',
						duration: '2000'
					})
					return false
				} else {
				let timeId = this.selectTimeId
				this.$emit('change', timeId)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import './pretty-times.scss';

	page {
		height: 100%;
	}
	.content {
		text-align: center;
		height: 100%;
	}
	/* 两个按钮 */
	.bottom {
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		top: auto;
		left: 0px;
		width: 100%;
		background-color: #fff;
	}

	.show_time {
		width: 70%;
		height: 94upx;
		color: #505050;
		background-color: rgba(255, 255, 255, 1);
		font-size: 30upx;
		line-height: 94upx;
		text-align: left;
		padding-left: 20upx;
	}

	.buybtn {
		width: 25%;
		height: 80upx;
		color: white;
		background-color: #4480ef;
		font-size: 30upx;
		line-height: 80upx;
		text-align: center;
		margin: auto;
		padding: 0;
	}

</style>
