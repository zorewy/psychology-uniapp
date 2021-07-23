import {
  rightOffPay
} from '../api/payment';

function payOrder(orderId) {
  console.log(orderId)
  return new Promise(function (resolve, reject) {
    let payId = wx.getStorageSync('openId')
    let argu = {
      payChannel: "WECHAT",
      payId: payId,
      id: orderId
    }
    rightOffPay(argu).then((res) => {
      if (res.code === 200) {
        const payParam = res.data.prePayTnObj;
        console.log(res.data)
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.requestSubscribeMessage({
              tmplIds: ['awlYe3Kbug7rSfLHSw4ZaJjLinXqaLNHZW_KG8TVOxs'],
              success(res) {
                console.log(res);
              },
              fail(err) {
                console.log(err);
              }
            })
            resolve(res);
          },  
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    })
  });
}
//  线下买单
function goPay(e) {
  console.log(e)
  let that = this;
  let paytype = e.currentTarget.dataset.value;
  let number = e.currentTarget.dataset.number
  if (!that.data.order_id) return app.Tips({
    title: '请选择要支付的订单'
  });
  wx.showLoading({
    title: '支付中'
  });
  offlinePayment({
    uni: that.data.order_id,
    paytype: paytype,
    'from': 'routine'
  }).then(res => {
    if (res.data.result === undefined) return app.Tips({
      title: '缺少支付参数'
    });
    var jsConfig = res.data.result.jsConfig;
    wx.requestPayment({
      timeStamp: jsConfig.timestamp,
      nonceStr: jsConfig.nonceStr,
      package: jsConfig.package,
      signType: jsConfig.signType,
      paySign: jsConfig.paySign,
      success: function (res) {
        wx.hideLoading();
        return app.Tips({
          title: res.msg,
          icon: 'success'
        }, () => {
          that.triggerEvent('onChangeFun', {
            action: 'pay_complete'
          });
        });
      },
      fail: function (e) {
        wx.hideLoading();
        return app.Tips({
          title: '取消支付'
        }, () => {
          that.triggerEvent('onChangeFun', {
            action: 'pay_fail'
          });
        });
      },
      complete: function (e) {
        wx.hideLoading();
        if (e.errMsg == 'requestPayment:cancel') return app.Tips({
          title: '取消支付'
        }, () => {
          that.triggerEvent('onChangeFun', {
            action: 'pay_fail'
          });
        });
      },
    });
  }).catch(err => {
    wx.hideLoading();
    return app.Tips({
      title: err
    }, () => {
      that.triggerEvent('onChangeFun', {
        action: 'pay_fail'
      });
    });
  })
}

module.exports = {
  payOrder,
  goPay
};