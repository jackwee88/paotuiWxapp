//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    orderlist: [],
    page: 1,
    windowHeight:'',
    trueHeight:''

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    var screenH = wx.getSystemInfoSync().windowHeight

    this.setData({
      windowHeight:screenH-20
    })
    this.getOrderList()
    var token=wx.getStorageSync('token')

    if(!token){
      wx.navigateTo({
        url: '/pages/index/login',
      })
    }
  },
  onLoad: function () {
   
  },
  onShareAppMessage: function(e) {
    App.globalData.preview = false
    if (e.from === 'button') {
    } else {
      var that = this
      return {
        title: '快乐邮差',
        path: '',
        success: function(res) {

        }
      }
    }
  },
  onReachBottom(){
      let that = this
      util.ajax('api/Order/getOrderList', {
        limit: 10,
        page: this.data.page+1
      }, res => {
  
        res.data.orderList.forEach(function (item, index, arr) {
          if (item.state == "0") {
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
      })
  },
  getOrderList: function () {
    let that = this
    util.ajax('api/Order/getOrderList', {
      limit: 10,
      page: this.data.page
    }, res => {
      res.data.orderList.forEach(function (item, index, arr) {
        if (item.state == "0") {
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
      this.setData({
        orderlist: res.data.orderList,
      })
    })
  },
  getdetail: function (e) {
    let order_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?order_id=' + order_id,
    })
  }
})