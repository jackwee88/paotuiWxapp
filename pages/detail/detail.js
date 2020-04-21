var App = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    active: 0,
    id: null,
    detail: [],
    //编号
    number: '',

    //下单时间
    addtime: '',
    //支付时间
    //收件人
    addressee: '',
    //共支付
    money: '',
    state: '',
    status: '',
    createtime: '',
    paytime: '',
    tackcode: '',
    orderId: '',
    windowHeight: ''
  },

  onLoad: function (options) {
    var that = this;

    //页面启动后 调取首页的数据
    if (options.order_id) {
      var orderId = options.order_id
      this.setData({
        orderId: orderId
      })
    } else {
      wx.navigateBack({})
    }
  },
  onShow: function () {
    var screenH = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowHeight: screenH

    })
    this.getData()
    console.log('12354')
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    // prevPage.loadData()  
    prevPage.setData({
      page: 1,
      orderlist: [],
    })
  },

  getData() {
    let that = this
    util.ajax('api/Order/getOrderDetails', {
      id: this.data.orderId
    }, res => {
      that.setData({
        number: res.data.orderDetails.number,
        addressee: res.data.orderDetails.addressee,
        addtime: res.data.orderDetails.addtime,
        money: res.data.orderDetails.money,
        state: res.data.orderDetails.state,
        tackcode: res.data.orderDetails.tackcode,
      })
      function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
      }
      if (res.data.orderDetails.paytime == 0) {
        this.setData({
          paytime: '未支付'
        })
      } else {
        this.setData({
          paytime: timestampToTime(res.data.orderDetails.paytime),
        })
      }
      this.setData({
        createtime: timestampToTime(res.data.orderDetails.addtime),
      })
      if (res.data.orderDetails.state == 0) {
        that.setData({
          status: '未支付'
        })
      } else if (res.data.orderDetails.state == 1) {
        that.setData({
          status: '配送中'
        })

      } else if (res.data.orderDetails.state == 2) {
        that.setData({
          status: '已送达'
        })

      } else if (res.data.orderDetails.state == 3) {
        that.setData({
          status: '已确认'
        })
      } else {

      }
    })
  },
  tapcacel: function () {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          util.ajax('api/Order/setCancel', {
            orderId: that.data.orderId
          }, res => {
            wx.showToast({
              title: res.msg,
            })

            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            // prevPage.loadData()  
            prevPage.setData({
              page: 1,
              orderlist: [],
            })
            setTimeout(function () {
              // wx.switchTab({
              //   url: '/pages/index/index',
              // });
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          })


        }
      }
    });

  },
  confirm: function () {
    util.ajax('api/Order/setConfirm', {
      orderId: this.data.orderId
    }, res => {
      this.getData()
    })
  },
  pay: function () {
    let that = this
    util.ajax('api/Order/getOrderPay', {
      orderId: this.data.orderId
    }, ress => {
      wx.requestPayment({
        timeStamp: String(ress.data.requestPayment.timeStamp),
        nonceStr: ress.data.requestPayment.nonceStr,
        package: ress.data.requestPayment.package,
        signType: ress.data.requestPayment.signType,
        paySign: ress.data.requestPayment.paySign,
        success: function (payres) {
          wx.showToast({
            title: '成功支付',
          })
          setTimeout(() => {
            that.onShow()
          }, 500);
        },
        fail: function () {
          wx.showModal({
            title: '错误提示',
            content: '支付失败',
            showCancel: false
          })
          setTimeout(() => {
            that.onShow()
          }, 500);
        },
        complete: function () {},
      })
    })
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
  countDown: function () {

    var that = this;
    var now_time = that.data.time_diff; //获取时间差
    this.data.intervarID = setInterval(function () { //设置定时器
      //将时间差减一秒
      now_time--;
      //计算天时分秒
      let d = Math.floor((now_time - (now_time % 86400)) / 86400);
      let h = Math.floor((now_time % 86400) / 3600);
      let m = Math.floor((now_time % 3600) / 60);
      let s = now_time % 60;
      //将计算结果保存至data
      that.setData({
        day: d,
        hourse: h,
        minute: m,
        second: s,
      });
      //当时间差为0时,清除定时器
      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        clearInterval(that.data.intervarID);
      }
    }, 1000)
  },

  logistics() {
    wx.navigateTo({
      url: '/pages/logistics/logistics?order_id=' + this.data.detail.id,
    })
  },

  // delOrder(){
  //   App._post('order/finish', { 'id': that.data.id }, function (result) {

  //     wx.redirectTo({
  //       url: './detail?id=' + that.data.id
  //     })
  //   }, function (result) {
  //     console.log(result);
  //   }, function () {
  //     that.data.disabled = false;
  //   });
  // }
  selectList(e) {
    var that = this
    var index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let detail = this.data.detail; // 获取购物车列表
    const selected = detail.goods[index].selected; // 获取当前商品的选中状态
    detail.goods[index].selected = !selected; // 改变状态

    let selectAll = true
    detail.goods.forEach(function (item, index, arrSelf) {
      if (item.selected == false) {
        selectAll = false
      }
    });



    if (selectAll) {
      this.setData({
        selectAllStatus: true
      });
    } else {
      this.setData({
        selectAllStatus: false
      });
    }
    this.setData({
      detail: detail
    });

    // this.getTotalPrice(); // 重新获取总价
  },

  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let detail = this.data.detail;

    for (let i = 0; i < detail.goods.length; i++) {
      detail.goods[i].selected = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      detail: detail
    });

  },

  // onUnload() {
  //   var pages = getCurrentPages();
  //   var prevPage = pages[pages.length - 2]; //上一个页面
  //   prevPage.setData({
  //     fromDetail: true
  //   })
  // }
})