const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function ajax(url, params, cb) {
  // wx.showLoading({
  //   title: '加载中',
  //   mask: true,
  // })
  wx.request({
    url: getApp().globalData.requestUrl + url,
    method: 'post',
    data: params,
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync("token")
    },
    success: function(res) {
      wx.hideLoading();
      // wx.navigateTo({
      //   url: '/pages/logo/logo',
      // })

      if (res.data.code == 0) {

        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true
        })
      } else if (res.data.code == -1) {
        console.log('123131')
        //未登录，登录授权
        wx.navigateTo({
          url: '/pages/index/login',
        })

      }

      else if (res.data.code == 1 || res.data.code == 2 || res.data.code == 3) {

        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function() {
      wx.hideLoading();
      // wx.showModal({
      //   title: '网络错误',
      //   content: '网络出错，请刷新重试',
      //   showCancel: false,
      //   mask: true
      // })
      return typeof cb == "function" && cb(false)
    }
  })
}
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn()
      _lastTime = _nowTime
    }
  }
}
module.exports = {
  formatTime: formatTime,
  ajax: ajax,
  throttle: throttle
}
