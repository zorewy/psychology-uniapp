<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<text class="example-info">预约信息（必填）
			请如实填写所有信息，以便咨询师了解和评估情况，如有法律纠纷，您有举报的权益</text>

		<uni-forms :rules="rules" :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext">
			<uni-group title="基础信息" top="0">
				<uni-forms-item name="name" required label="真实姓名">
					<uni-easyinput type="text" :inputBorder="true" v-model="formData.name" placeholder="请输入您的姓名">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="phone" required label="手机号码">
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号码"></uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="idcard" required label="身份证号">
					<uni-easyinput type="text" v-model="formData.idcard" placeholder="请输入身份证号" @blur="checkCard(formData.idcard)">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item required name="sex" label="性别">
					<uni-data-checkbox v-model="formData.sex" :localdata="sex"></uni-data-checkbox>
				</uni-forms-item>
				<!-- #ifndef APP-NVUE -->
				<uni-forms-item required name="birth" label="生日">
					<uni-datetime-picker type="date" v-model="formData.birth" start="2000-06-01 06:30:30" end="2030-6-1"
						return-type="string"></uni-datetime-picker>
				</uni-forms-item>

				<!-- #endif -->
			</uni-group>

			<uni-group title="紧急关系" top="0">
				<uni-forms-item name="qyName" required label="姓名">
					<uni-easyinput type="text" :inputBorder="true" v-model="formData.qyName" placeholder="请输入您的亲友姓名">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="qyPhone" required label="手机号码">
					<uni-easyinput type="text" v-model="formData.qyPhone" placeholder="请输入手机号码"></uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="guanxi" required label="紧急关系">
					<view class="guanxi" @click="guanxiShow = true">
						<view class="center">
							{{selectGuanxi}}
						</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</uni-forms-item>
				<u-select v-model="guanxiShow" :list="guanxiList" mode="single-column" @confirm="selectGx"></u-select>


			</uni-group>
			<!-- #ifndef APP-NVUE -->
			<!-- <template> -->
			<uni-group title="详细信息">

				<view class="details">
					<view class="question">
						<text>是否接受过精神科相关的诊断或治疗？</text>
					</view>
					<u-radio-group v-model="value" @change="spiritChange">
						<u-radio @change="spiritRadio" v-for="(item, index) in spiritList" :key="index"
							:name="item.name" :disabled="item.disabled">
							{{item.name}}
						</u-radio>
					</u-radio-group>
					<!-- <uni-forms-item name="spiritRemarks"> -->
					<uni-easyinput type="textarea" v-model="formData.spiritRemarks" :maxlength="50"
						placeholder="选填咨询，请输入咨询机构名称并简要描述咨询经历。">
					</uni-easyinput>
					<!-- </uni-forms-item> -->
					<view class="question">
						<text>是否过接受心理咨询？</text>
					</view>
					<u-radio-group v-model="value" @change="psychologyChange">
						<u-radio @change="psychologyRadio" v-for="(item, index) in psychologyList" :key="index"
							:name="item.name" :disabled="item.disabled">
							{{item.name}}
						</u-radio>
					</u-radio-group>
					<!-- <uni-forms-item name="psychologyRemarks"> -->
					<uni-easyinput type="textarea" v-model="formData.psychologyRemarks" :maxlength="50"
						placeholder="选填咨询，请输入咨询机构名称并简要描述咨询经历。">
					</uni-easyinput>
					<!-- </uni-forms-item> -->
					<view class="question">
						<text>请简述目前关于您的问题</text>
					</view>
					<!-- <uni-forms-item name="problemRemarks"> -->
					<uni-easyinput type="textarea" v-model="formData.problemRemarks" :maxlength="50" placeholder="选填">
					</uni-easyinput>
					<view class="question">
						<text>有什么想对咨询师说的</text>
					</view>

					<uni-easyinput type="textarea" v-model="formData.sayRemarks" :maxlength="50" placeholder="选填">
					</uni-easyinput>

				</view>
			</uni-group>
			<!-- </template> -->
			<!-- #endif -->



			<view class="example">
				<button class="button" @click="resetForm()">重置</button>
				<button class="button" @click="submitForm('form')">保存</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		postAppointment
	} from '@/api/tutor.js';
	export default {
		data() {
			return {
				psychologyList: [{
						name: '是',
						disabled: false
					},
					{
						name: '否',
						disabled: false
					}
				],
				spiritList: [{
						name: '是',
						disabled: false
					},
					{
						name: '否',
						disabled: false
					}
				],
				guanxiShow: false,
				guanxiList: [{
						value: '1',
						label: '父亲'
					},
					{
						value: '2',
						label: '母亲'
					},
					{
						value: '3',
						label: '妻子'
					},
					{
						value: '4',
						label: '丈夫'
					},
					{
						value: '5',
						label: '儿女'
					},
					{
						value: '6',
						label: '朋友'
					},
					{
						value: '7',
						label: '兄弟'
					},
					{
						value: '8',
						label: '亲友'
					}
				],
				selectGuanxi: '请选择你们的关系',
				selectValue: '',
				formData: {
					name: '',
					qyName: '',
					phone: '',
					qyPhone: '',
					guanxi: '',
					sex: '',
					idcard: '',
					checked: false,
					birth: '',
					spiritRemarks: '',
					psychologyRemarks: '',
					problemRemarks: '',
					sayRemarks: ''
				},
				sex: [{
						text: '男',
						value: 'F'
					},
					{
						text: '女',
						value: 'G'
					}
				],

				show: false,
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入用户名'
							},
							{
								minLength: 2,
								maxLength: 14,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符'
							}
						]
					},
					qyName: {
						rules: [{
								required: true,
								errorMessage: '请输入紧急联系人姓名'
							},
							{
								minLength: 2,
								maxLength: 14,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符'
							}
						]
					},
					birth: {
						rules: [{
							required: true,
							errorMessage: '请选择时间'
						}]
					},
					phone: {
						rules: [{
							format: 'phone',
							errorMessage: '请输入正确的手机号码'
						}]
					},
					qyPhone: {
						rules: [{
							format: 'phone',
							errorMessage: '请输入正确的手机号码'
						}]
					},
					checked: {
						rules: [{
							format: 'bool'
						}]
					},
					sex: {
						rules: [{
							format: 'string'
						}]
					},
				},
				consultantId: '',
				consultantTimeIds: [],
				orderType: "",
				detail: {
					acceptCounsult: "",
					acceptCure: "",
					birthday: "",
					counsultComment: "",
					cureComment: "",
					gender: "",
					idCard: "",
					linkMobile: "",
					linkName: "",
					linkRelation: "",
					mobile: "",
					problem: "",
					remarks: "",
					summary: "",
					userLabel: "",
					userName: ""
				},
				is_select_guanxi:false
			}

		},
		onLoad(e) {
			console.log(e);
			this.consultantId = e.consultantId;
			this.consultantTimeIds = [e.consultantTimeIds];
			this.orderType = e.orderType;
			// this.money = e.money
			console.log(e)
			uni.showLoading()
			// this.formData 应该包含所有需要校验的表单
			// 模拟异步请求数据
			setTimeout(() => {
				this.formData = {
					id: '',
					name: '',
					// sex: '0',
					checked: false,
					birth: '',
					turefalse: true
				}
				uni.hideLoading()
			}, 500)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			birthChange(e) {
				console.log(e)
			},
			change(name, value) {
				this.formData.checked = value
				this.$refs.form.setValue(name, value)
			},
			// 关系选择
			selectGx(e) {
				// console.log(e);
				this.selectValue = e[0].value;
				this.selectGuanxi = e[0].label
				console.log(this.selectGuanxi)
				this.is_select_guanxi = true
			},

			/**
			 * 手动提交
			 * @param {Object} form
			 */
			submitForm(form) {
				if (!this.formData.name) {
					this.$refs.uTips.show({
						title: '请填写您的姓名',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				if (!this.formData.phone) {
					this.$refs.uTips.show({
						title: '请填写您的手机号码',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				if (!this.formData.idCard) {
					this.$refs.uTips.show({
						title: '请填写您的身份证号码',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				if (!this.formData.sex) {
					this.$refs.uTips.show({
						title: '请选择您的性别',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				if (!this.formData.birth) {
					this.$refs.uTips.show({
						title: '请选择您的生日',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				
				if (!this.formData.qyName) {
					this.$refs.uTips.show({
						title: '请填写紧急联系人姓名',
						type: 'error',
						duration: '2000'
					})
				}
				if (!this.formData.qyPhone) {
					this.$refs.uTips.show({
						title: '请填写紧急联系人手机号码',
						type: 'error',
						duration: '2000'
					})
					return false
				}
				if (!this.is_select_guanxi) {
					this.$refs.uTips.show({
						title: '请选择您与紧急联系人的关系',
						type: 'error',
						duration: '2000'
					})
					return false
				} else {
						let appoint = {
							consultantId: this.consultantId,
							consultantTimeIds: this.consultantTimeIds,
							detail: {
								acceptCounsult: this.acceptCounsult,
								acceptCure: this.acceptCure,
								birthday: this.formData.birth,
								counsultComment: this.formData.spiritRemarks,
								cureComment: this.formData.psychologyRemarks,
								gender: this.formData.sex,
								idCard: this.formData.idcard,
								linkMobile: this.formData.qyPhone,
								linkName: this.formData.qyName,
								linkRelation: this.selectGuanxi,
								mobile: this.formData.phone,
								problem: this.formData.problemRemarks,
								remarks: this.formData.sayRemarks,
								userName: this.formData.name
							},
							orderType: this.orderType,
							// money: this.money
						}
						postAppointment(appoint).then((res) => {
							if (res.code === 0 ) {
								var orderDetails = res.data
								// uni.setStorageSync('orderDetails', orderDetails)
								getApp().globalData.courseOrder = orderDetails
								uni.navigateTo({
									url: "/pages/confirm-order-form/confirm-order-form?goodstype=CONSULT"
								})
						} else {
							this.$refs.uTips.show({
								title: '您输入的信息有误，提交失败！',
								type: 'error',
								duration: '2000'
							})
						}
					})
				}
			},

			/**
			 * 手动重置表单
			 */
			resetForm() {
				this.$refs.form.resetFields()
			},
			/**
			 * 部分表单校验
			 * @param {Object} form
			 */
			validateField(form) {
				this.$refs[form]
					.validateField(['name', 'phone'])
					.then(res => {
						uni.showToast({
							title: '验证成功'
						})
						console.log('表单的值：', res)
					})
					.catch(errors => {
						console.error('验证失败：', errors)
					})
			},



			/**
			 * 清除表单校验
			 * @param {Object} form
			 * @param {Object} name
			 */
			clearValidate(form, name) {
				if (!name) name = []
				this.$refs[form].clearValidate(name)
			},

			// 是否心理咨询过
			psychologyRadio(e) {
				let cceptCounsult = e ? 'Y' : 'N';
				console.log(cceptCounsult)
				this.acceptCounsult = e ? 'Y' : 'N';
			},

			// 是否精神咨询过
			spiritRadio(e) {
				let cceptCure = e ? 'Y' : 'N';
				console.log(cceptCure)
				this.acceptCure = e ? 'Y' : 'N';
			},


			// 是否心理咨询过
			psychologyChange(e) {
				console.log(e)
			},

			// 是否精神咨询过
			spiritChange(e) {
				console.log(e)
			},


			checkCard(idCard) {
			        let sex = null;
			        let birth = null;
			        let myDate = new Date();
			        let month = myDate.getMonth() + 1;
			        let day = myDate.getDate();
			        let age = 0;
			
			        if(idCard.length===18){
			          age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
			          sex = idCard.substring(16,17);
			          birth = idCard.substring(6,10)+"-"+idCard.substring(10,12)+"-"+idCard.substring(12,14);
			          if (idCard.substring(10, 12) < month || idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day) age++;
			        }
			        else if(idCard.length===15){
			          age = myDate.getFullYear() - idCard.substring(6, 8) - 1901;
			          sex = idCard.substring(13,14);
			          birth = "19"+idCard.substring(6,8)+"-"+idCard.substring(8,10)+"-"+idCard.substring(10,12);
			          if (idCard.substring(8, 10) < month || idCard.substring(8, 10) === month && idCard.substring(10, 12) <= day) age++;
			        } else {
						this.$refs.uTips.show({
							title: '您输入的身份证号码有误',
							type: 'error',
							duration: '2000'
						})
					}
			
			        if(sex%2 === 0)
			          sex = 'G';
			        else
			          sex = 'F'
					  console.log(age)
					  console.log(sex)
					  console.log(birth)
					  if ( age && sex && birth ) {
						  this.formData.birth = birth
						  this.formData.sex = sex
						  this.formData.idCard = idCard
					  }
			        return  {age , sex, birth}
			      },

		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-nvue.scss';

	.question {
		line-height: 60upx;
		margin: 10upx 0;

		text {
			font-size: 32upx;
			color: #222222;
		}
	}

	.u-radio-group {
		padding-bottom: 20upx;
	}

	.example {
		padding: 20upx;
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		border-top: 1upx solid #f9f9f9;
		z-index: 10;

		button {
			flex: 1;
			border-radius: 80upx;
			background-color: #4480ef;
			color: #ffffff;
			font-size: 30upx;
			line-height: 78upx;
			height: 78upx;
		}
	}

	.uni-input-border,
	.uni-textarea-border {
		// width: 100%;
		flex: 1;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;
	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.label-box {
		margin-right: 10px;
	}

	.transform-scale {
		transform: scale(0.7);
	}

	.button {
		margin: 5px 10px;
	}

	.guanxi {
		right: 0;
		text-align: right;
		padding-top: 10upx;
		display: flex;
		position: relative;
		display: flex;
		justify-content: flex-end;

		.center {
			font-size: 30upx;
			color: #333333;
			text-align: center;
		}
	}

	.details {
		margin-bottom: 100upx;
	}
</style>
