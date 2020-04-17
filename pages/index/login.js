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
      mobile:"NoLoginData",
    },
    datanum:[],
  },

  onLoad: function (options) {


  },

  onShow: function () {

  },
  getUserInfo: function(e) {
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
              'api/Member/login',{
                code:res.code,
                encryptedData:ress.encryptedData,
                iv:ress.iv
              },res =>{
                wx.setStorageSync('token', res.data.memberDetails.token)
                App.globalData.userInfo = res.data.memberDetails;
                wx.switchTab({
                  url: '/pages/address/create',
                })
                // wx.navigateBack({
                //   detal:1
                // })
              }
            )
          }
        })
        
        }
    })
    
  },
 
})