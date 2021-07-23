uni.request({
    url: 'https://openapi.chuanglx.com/sys/dict/type/all',
    success: (res) => {
        uni.setStorageSync('dictData',res.data.data)
    }
});