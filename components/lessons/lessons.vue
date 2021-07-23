<template>
		<view class="lessons padding-top-sm" :class="ismanager?'ismanager':''">
	<!-- 		<view v-if="lessons.length==0 && showempty" class="text-empty">空空如也</view> -->
			<view class="cu-card article">
				<view @click="bindTap(item.id)" class="cu-item ls-item shadow" v-for="(item, index) in lessons" :key="index">
					<view class="content">
						<image class="cover" :src="item.imageUrl" mode="aspectFill"></image>
						<view class="desc">
							<view class="title text-cut">{{item.title}}</view>
							<view class="text-content text-warp">
								<text class="padding-right-sm" v-if="!ismanager">{{item.author || '认证讲师'}}</text>
								<text class="padding-right-sm" :class="'status'+item.status" v-else>{{item.author}}</text>
								<!-- {{item.multiple?'多章节':'单章'}} -->
							</view>
							<view class="text-content justify-between flex">
								<view class="text-red" v-if="iospay || device!='ios'">{{item.amount>0?'￥'+item.amount:'免费'}}</view>
								<view class="text-gray" v-else>{{item.updating?'连载':'完结'}}</view>
								<view v-if="!ismanager" class="text-red">{{item.hits}}
								<text>人已学</text>
								</view>
								<view v-else class="text-xxl" :class="showmenu==item.id?'text-red':''"><text class="cuIcon-more"></text></view>
							</view>
	<!-- 						<view class="cu-list menu padding-xs bg-white" v-if="ismanager" :class="showmenu==item.id?'active':''">
								<view class="cu-item" @click="naviTo('lesson/detail',{id:item.id})">
									<view class="content">
										<text class="cuIcon-attention text-yellow"></text>
										<text>预览</text>
									</view>
								</view>
								<view class="cu-item" @click="naviTo('lesson/post',{id:item.id})">
									<view class="content">
										<text class="cuIcon-edit text-blue"></text>
										<text>编辑</text>
									</view>
								</view>
								<view class="cu-item" @click="naviTo('lector/section',{id:item.id})" v-if="item.multiple">
									<view class="content">
										<text class="cuIcon-list text-green"></text>
										<text>章节</text>
									</view>
								</view>
								<view class="cu-item" @click="RmLesson(item.id,index)">
									<view class="content">
										<text class="cuIcon-delete text-red"></text>
										<text>删除</text>
									</view>
								</view>
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>

	export default {
		name: 'lessons',
		props: {
			lessons : {
				type:Array,
				default:function(){
					return [];
				}
			},
			ismanager : {
				type:Boolean,
				default:false
			},
			showempty:{
				type:Boolean,
				default:true
			}
		},

		methods: {
			naviTo(page,data={}){
				return core.navito(page,data);
			},
			bindTap(id){
				// let id = e.currentTarget.dataset.id;
				console.log(id)
				uni.navigateTo({
					url:`/pages/course-details/course-details?id=${id}`
				})
			},
			// RmLesson(id,index=0){
			// 	if(!id) return false;
			// 	var that = this;
			// 	return core.confirm('删除后将清理课程相关的章节、评价、收藏等数据且不可恢复','删除课程',function(){
			// 		core.get('lesson/remove',function(res){
			// 			if(res.type=='success'){
			// 				that.lessons.splice(index,1);
			// 			}
			// 			core.toast(res.message,res.redirect,res.type);
			// 		},{id:id})
			// 	})
			// }
		}
	}
</script>

<style lang="less">
.status0{color: #f37b1d;}
.status1{color: #39b54a;}
.status2{color: #aaaaaa;}
.ismanager .cu-card.article{padding-bottom: 200upx;}
.ls-item{overflow: visible !important;}
.ls-item.shadow{box-shadow:0 0 16upx 0 rgba(219,219,219,0.6);}
.ls-item .desc .title{padding: 0 !important; line-height: 48upx !important;}
.ls-item .desc .text-content{height: auto;}

.desc {
	width: 100%;
	text {
		color: #666666;
	}
}
.text-red {
	color: #ff5757;
}


.justify-between {
	display: flex;
	justify-content: space-between;
}
.cu-card {
	display: block;
	overflow: hidden;
}

.cu-card>.cu-item {
	display: block;
	background-color: #ffffff;
	overflow: hidden;
}

.cu-card>.cu-item.shadow-blur {
	overflow: initial;
}

.cu-card.no-card>.cu-item {
	margin: 0upx;
	border-radius: 0upx;
}

.cu-card .grid.grid-square {
	margin-bottom: -20upx;
}

.cu-card.case .image {
	position: relative;
}

.cu-card.case .image image {
	width: 100%;
}

.cu-card.case .image .cu-tag {
	position: absolute;
	right: 0;
	top: 0;
}

.cu-card.case .image .cu-bar {
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color: transparent;
	padding: 0upx 30upx;
}

.cu-card.case.no-card .image {
	margin: 30upx 30upx 0;
	overflow: hidden;
	border-radius: 10upx;
}

.cu-card.dynamic {
	display: block;
}

.cu-card.dynamic>.cu-item {
	display: block;
	background-color: #ffffff;
	overflow: hidden;
}

.cu-card.dynamic>.cu-item>.text-content {
	padding: 0 30upx 0;
	max-height: 6.4em;
	overflow: hidden;
	font-size: 30upx;
	margin-bottom: 20upx;
}

.cu-card.dynamic>.cu-item .square-img {
	width: 100%;
	height: 200upx;
	border-radius: 6upx;
}

.cu-card.dynamic>.cu-item .only-img {
	width: 100%;
	height: 320upx;
	border-radius: 6upx;
}


.cu-card.article {
	display: block;
}

.cu-card.article>.cu-item {
	padding-bottom: 30upx;
}

.cu-card.article>.cu-item .title {
	font-size: 30upx;
	font-weight: 600;
	color: #333333;
}

.cu-card.article>.cu-item .content {
	display: flex;
	padding: 0 30upx;
}

.cu-card.article>.cu-item .content>image {
	width: 240upx;
	height: 6.4em;
	margin-right: 20upx;
	border-radius: 6upx;
}



.cu-card.article>.cu-item .content .text-content {
	font-size: 28upx;
	color: #888;
	overflow: hidden;
	line-height: 44upx;
}
.desc .cu-list{display: none; position: absolute; box-shadow:0px 4px 22px 0px rgba(0,0,0,0.14); width: 172upx; right: -14upx; top: 172upx; overflow: visible; z-index: 888;}
.desc .cu-list::before{content: ''; width: 20upx; height: 20upx; background: #FFFFFF; position: absolute; top: -8upx; right: 20upx; transform: rotate(45deg);}
.desc .cu-list.active{display: block;}
.desc .cu-list .cu-item{padding: 0; min-height: 64upx;}
.desc .cu-list .cu-item .content{padding: 0; line-height: 64upx;}
</style>
