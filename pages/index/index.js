//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    orderlist: [],
    page: 1
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    this.getOrderList()
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  getOrderList: function () {
    let that = this
    util.ajax('api/Order/getOrderList', {
      limit: 10,
      page: this.data.page
    }, res => {

      res.data.orderList.forEach(function (item, index, arr) {
        if (item.state == "0") {
          console.log('123')
          arr[index].showText = "未支付";
        }
        if (item.state == "1") {
          arr[index].showText = "配送中";
        }
        if (item.state == "2") {
          arr[index].showText = "已送达";
        }
        if (item.state == "3") {
          arr[index].showText = "已确认";
        }  
      });
      var list = []
        list = that.data.orderlist.concat(res.data.orderList)
      this.setData({
        orderlist: list,
        page:this.data.page+1
      })
      console.log(this.data.orderlist)
    })
  },
  getdetail: function (e) {
    let order_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?order_id=' + order_id,
    })
  }
})