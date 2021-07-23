import Vue from 'vue';

import App from './App';

import uView from "uview-ui";

import {getAllDict} from '@/utils/dict.js';

import Server from '@/utils/Server.js';

import util from '@/utils/util.js';

// #ifdef H5
import jwx from '@/request/jwx.js';

Vue.prototype.$jwx = jwx;
// #endif

Vue.use(uView);
Vue.prototype.$getAllDict = getAllDict;
Vue.prototype.util = util;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
