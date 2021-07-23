const userinfo = uni.getStorageSync('userinfo');
console.log(userinfo)
export default {
	token: userinfo.token,
}
