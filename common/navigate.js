import Vue from 'vue';
export default {
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url: url
			})
		},
		navToCourse(id,url) {
			if(url.trim() != '') {
				// #ifdef H5
				location.href = url;
				// #endif
				// #ifdef MP || APP-PLUS
				this.navigateTo('/pages/webview/webview?title=&url=' + url);
				// #endif
				
			} else {
				this.navigateTo('/pages/course/detail/detail?id='+id);
			}
		},
		navToWebView(title,url) {
			if(title.trim() != '' && url.trim() != '') {
				if(title == '客服中心') {
					// #ifdef H5 || APP-PLUS
					this.navigateTo('/pages/webview/webview?title='+title + '&url=' + url);
					// #endif
				} else {
					this.navigateTo('/pages/webview/webview?title='+title + '&url=' + url);
				}
			}
		},
		navigateBack() {
			uni.navigateBack();
		}
	}
}
