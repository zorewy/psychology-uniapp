<script>
	import { HTTP_REQUEST_URL,BASE_URL,CACHE_USERINFO,CACHE_TOKEN,CACHE_EXPIRES_TIME } from './config.js';
	import Server from '@/utils/Server.js';
	var { GlobalDataPublisher } = require('utils/publisher');
	export default {
		globalData: {
			token: '',
			url: HTTP_REQUEST_URL,
			openid: '',
			courseOrder: [],
			userInfo:null,
			chatUrl:'',
			switchTabId:null,
			switchTabIndex:null
		},

		onLaunch: function(option) {
			this.globalDataPublisher = new GlobalDataPublisher(this.globalData);
			if (HTTP_REQUEST_URL == '') {
				console.error("请查看appId是否正确");
				return false;
			}
			let that = this;
			let token = wx.getStorageSync(CACHE_TOKEN);
			let expiresTime = wx.getStorageSync(CACHE_EXPIRES_TIME);
			let userInfo = wx.getStorageSync(CACHE_USERINFO);
			this.globalData.isLog = !!userInfo && util.checkLogin(token, expiresTime, true);
			// if (this.globalData.isLog) {
			this.globalData.token = token;
			// this.globalData.expiresTime = expiresTime;
			this.globalData.userInfo = userInfo ? JSON.parse(userInfo) : {};
			// }
			if (option.query.hasOwnProperty('scene')) {
				switch (option.scene) {
					//扫描小程序码
					case 1047:
						that.globalData.code = option.query.scene;
						break;
						//长按图片识别小程序码

					case 1048:
						that.globalData.code = option.query.scene;
						break;
						//手机相册选取小程序码
					case 1049:
						that.globalData.code = option.query.scene;
						break;
						//直接进入小程序
					case 1001:
						that.globalData.spid = option.query.scene;
						break;
				}
			}
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res)
			})
			updateManager.onUpdateReady(function() {
				wx.showModal({
					title: '更新提示',
					content: '版本更新了，快重启尝鲜',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			});
			updateManager.onUpdateFailed(function() {
				return that.Tips({
					title: '新版本下载失败'
				});
			})

			const BASE_URL = uni.BASE_URL
			//实例化聊天服务
			// #ifdef H5
			var set = uni.getStorageSync('base_set')
			var userinfo = uni.getStorageSync('userinfo')
			const HOST_URL = uni.HOST_URL

			if (userinfo && userinfo.uid) {
				var link = uni.H5_URL + '?pid=' + userinfo.uid
			} else {
				var link = uni.H5_URL
			}
			if (this.$jwx && this.$jwx.isWechat()) {
				this.$jwx.share({
					'title': set.share_title,
					'desc': set.share_desc,
					'link': link,
					'img_url': HOST_URL + set.share_icon,
				})
				this.$jwx.sharepyq({
					'title': set.share_title,
					'link': link,
					'img_url': HOST_URL + set.share_icon,
				})
			}
			// #endif
		},
		$chat:null,
		
		  /*
		  * 信息提示 + 跳转
		  * @param object opt {title:'提示语',icon:''} | url
		  * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
		  */
		 Tips: function (opt, to_url) {
		  return util.Tips(opt, to_url);
		},
		// onShow: function() {
		// 	console.log('App Show');
		// },
		// onHide: function() {
		// 	console.log('App Hide');
		// }
	};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "./icon/iconfont.css";

	/* 去掉弹出层默认白色背景, 页面样式中设置无效 */
	.uni-transition .uni-popup__wrapper-box {
		background: none !important;
	}

	/* 防止小程序右上角按钮遮住导航右侧按钮 */
	.uni-navbar {
		margin-top: 52rpx !important;
	}

	/deep/.uni-scroll-view ::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/deep/::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/* #ifdef H5 */
	uni-page-head {
		display: none;
	}

	/* #endif */
</style>
