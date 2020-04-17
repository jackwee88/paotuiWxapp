//app.js
var util = require('utils/util.js')
App({

  onLaunch: function () {

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
     
    })
    wx.setStorageSync("modelType", 1)
    
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.iv = res.iv
              this.globalData.encryptedData = res.encryptedData

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //requestUrl:'https://kxsx.kaifadanao.cn',
    requestUrl: 'https://paotui.xutavip.com/index.php/',
    preview:true,
    encryptedData:null,
    iv:null,
    shouInfo:null,
  
   
  },

  showError: function (msg, callback) {
    // wx.showModal({
    //   title: '温馨提示',
    //   content: msg,
    //   showCancel: false,
    //   success: function (res) {
    //     callback && callback();
    //   }
    // });
  },
  showSuccess: function (msg, callback) {
    // Toast.success(msg);
    wx.showToast({
      title: msg,
      icon:'none',
      mask: true,
      duration: 2000
    })
    callback && (setTimeout(function () {
      callback();
    }, 1000));
  },

  /* 关于登录 */
  //判断是否登录
  check: function (cb) {
    console.log('11111')
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      this.login(cb);
    }
  },
  Log_after_fun: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //这里循环等待出数据
      setTimeout(function () { that.Log_after_fun(cb); }, 500);
    }
  },

  sysInfo: function () {
    let res = wx.getSystemInfoSync();
    let info = {
      width: res.windowWidth,//可使用窗口宽度
      height: res.windowHeight,//可使用窗口高度
      system: res.system,//操作系统版本
      statusBarHeight: res.statusBarHeight//状态栏的高度
    }
    return info;
  },
})