<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="messageUrl"></web-view>
    </view>
</template>

<script>
	import {getMessage} from '../../api/dict.js';
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
				messageUrl:""
            }
        },
		onShow() {
			getMessage().then((res) => {
				let url = res.data
				url += '?randstr=' + new Date().getTime() + '' + Math.round(Math.random() * 10000);
				console.log(url)
				this.messageUrl = url
			})
		},
		onHide(){
			this.messageUrl=""
		},
		onUnload() {
			this.messageUrl=""
		}
    }
</script>

<style>

</style>