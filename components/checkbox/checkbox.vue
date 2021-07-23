<template>
	<view>
		<view>
			<view>
				<!-- 示例radio -->
				<radio-group @change="radioChange" class="sunui-radio-group">
					<label v-for="(item,index) in radio" :key="index" class="sunui-radio-label" :class="item.checked ? 'sunui-radio-checkd' : ''">
						<radio :value="item.price" :checked="item.checked" />
						<text>{{item.integral}}</text>
					</label>
				</radio-group>
				<!-- 示例radio1 -->
				<radio-group @change="radioChange1" class="sunui-radio-group">
					<label v-for="(item,index) in radio1" :key="index" class="sunui-radio-label" :class="item.checked ? 'sunui-radio-checkd' : ''">
						{{item.checked}}
						<radio :value="item.value" :checked="item.checked" />
						<text>{{item.name}}</text>
					</label>
				</radio-group>
				<!-- 示例checkbox -->
				<view class="sunui-checkbox-group">
					<checkbox-group @change="checkboxChange" class="sunui-checkbox-group">
						<label v-for="(item,index) in checkbox" :key="index" :class="item.checked ? 'sunui-checkbox-checkd' : ''" class="sunui-chekcbox-label">
							<checkbox :value="item.value" :checked="item.checked" />
							<text>{{item.name}}</text>
						</label>
					</checkbox-group>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radio: [],
				radio1: [{
					name: '张三1',
					value: '0',
					checked: true
				}, {
					name: '李四2',
					value: '1',
					checked: false
				}, {
					name: '黄武3',
					value: '2',
					checked: false
				}, {
					name: '刘凯4',
					value: '3',
					checked: false
				}],
				checkbox: [{
					name: '张三疯',
					value: '0',
					checked: true
				}, {
					name: '李四',
					value: '1',
					checked: true
				}, {
					name: '黄武',
					value: '2',
					checked: false
				}, {
					name: '刘凯',
					value: '3',
					checked: false
				}]
			}
		},
		onLoad() {
			// 这里可以循环radio或者checkbox数组,然后this.radioChange({detail:{value:'xxxx'}})传值过去就可以拿到选中值
			uni.request({
				url: 'https://b9.admin168.net/app/index.php?i=4&c=entry&a=wxapp&do=rechargeList&m=wjyk_xxpt',
				method: 'GET',
				success: res => {
					this.radio = res.data.data.list;
					console.log(this.radio);
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			radioChange(e) {
				for (let i = 0, len = this.radio.length; i < this.radio.length; i++) {
					this.radio[i].price == e.detail.value ? this.radio[i].checked = true : this.radio[i].checked = false;
				}
				// 循环并没有更新到视图层上,使用VUE方法强制渲染
				this.$forceUpdate();
				console.log('radio-group:', e.detail.value);
			},
			radioChange1(e) {
				for (let i = 0, len = this.radio1.length; i < this.radio1.length; i++) {
					this.radio1[i].value == e.detail.value ? this.radio1[i].checked = true : this.radio1[i].checked = false;
				}
				// 循环并没有更新到视图层上,使用VUE方法强制渲染
				this.$forceUpdate();
				console.log('radio-group1:', e.detail.value);
			},
			checkboxChange(e) {
				for (let i = 0, len = this.checkbox.length; i < len; i++) {
					e.detail.value.includes(this.checkbox[i].value) ? this.checkbox[i].checked = true : this.checkbox[i].checked =
						false;
				}
				// 循环并没有更新到视图层上,使用VUE方法强制渲染
				this.$forceUpdate();
				console.log('checkbox-group:', e.detail.value)
			}
		}
	}
</script>

<style>
	/* 
		这里修改成你需要的样式,譬如边框,背景颜色(Step.1)
	*/
	.sunui-radio-label,
	.sunui-chekcbox-label {
		font-size: .7em;
		padding: 10upx 20upx;
		margin: 12upx;
		margin-left: 0;
		text-align: center;
		background-color: #eee;
		border-radius: 5upx;
		border: 1upx solid #FFBF40;
	}

	/* 
		这里修改成你需要的样式,譬如激活边框以及背景颜色(Step.2)
	 */
	.sunui-radio-checkd,
	.sunui-checkbox-checkd {
		color: #fff;
		background-color: #FFBF40;
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
</style>
