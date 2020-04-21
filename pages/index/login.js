let App = getApp();
var util = require('../../utils/util.js')
Page({

  data: {
    userInfo: {
      id: 0,
      avatar: '/assets/img/avatar.png',
      nickname: '游客',
      balance: 0,
      score: 0,
      level: 0,
      group_id: 1,
      mobile: "NoLoginData",
      showModal: false,
      windowWidth: ''
    },
    datanum: [],
  },

  onLoad: function (options) {


  },

  onShow: function () {
    var screenW = wx.getSystemInfoSync().windowWidth
    this.setData({
      windowWidth: screenW
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onGotUserInfo: function (e) {
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: ress => {
            // 可以将 res 发送给后台解码出 unionId
            util.ajax(
              'api/Member/login', {
                code: res.code,
                encryptedData: ress.encryptedData,
                iv: ress.iv
              }, res => {
                wx.setStorageSync('token', res.data.memberDetails.token)
                App.globalData.userInfo = res.data.memberDetails;
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                wx.navigateBack({
                  detal: 1
                })
              }
            )
          }
        })

      }
    })

  },
  cancel: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.switchTab({
      url: '/pages/address/create',
    })
  }
})