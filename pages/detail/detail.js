var App = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    selectAllStatus: false,
    wxapp: null,
    steps: [{
        text: '付款中',
        desc: '请及时支付'
      },
      {
        text: '配送中',
        desc: '后台配货中'
      },
      {
        text: '已完成',
        desc: '享受宝物中'
      }
    ],
    active: 0,
    id: null,
    detail: [],
    //编号
    number: '',

    //下单时间
    addtime: '',
    //支付时间
    paytime: '',
    //收件人
    addressee: '',
    //共支付
    money: '',
    state: '',
    status: '',
    createtime: '',
    paytime: '',
  },

  onLoad: function (options) {
    var that = this;

    //页面启动后 调取首页的数据
    if (options.order_id) {
      console.log(options.order_id + '1111')
      util.ajax('api/Order/getOrderPay', {
        orderId: options.order_id
      }, res => {
        that.setData({
          number: res.data.orderData.number,
          addressee: res.data.orderData.addressee,
          addtime: res.data.orderData.addtime,
          paytime: res.data.orderData.paytime,
          money: res.data.orderData.money,
          state: res.data.orderData.state,
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
        this.setData({
          createtime: timestampToTime(res.data.orderData.addtime),
          paytime: timestampToTime(res.data.orderData.paytime)
        })
        if (this.data.state == 0) {
          that.setData({
            status: '未支付'
          })
        } else if (this.data.state == 1) {
          that.setData({
            status: '配送中'
          })

        } else if (this.data.state == 2) {
          that.setData({
            status: '已送达'
          })

        } else {
          that.setData({
            status: '已确认'
          })
        }
      })

    } else {
      wx.navigateBack({})
    }
    that.getdetail()
  },
  onShow: function () {},
  timechange: function () {

  },

  // TapCancel: function() {
  //   let that = this;
  //   wx.showModal({
  //     title: "提示",
  //     content: "确认取消订单？",
  //     success: function(o) {
  //       if (o.confirm) {

  //         App._post('order/cancel', {
  //           'id': that.data.id
  //         }, function(result) {
  //           var pages = getCurrentPages();
  //           var prevPage = pages[pages.length - 2];
  //           prevPage.setData({
  //             page:1,
  //             OrderList:[],
  //             status:0,
  //             active:0
  //           })
  //           prevPage.onShow()
  //           setTimeout(function() {
  //             wx.navigateBack();
  //           }, 500)

  //         });
  //       }
  //     }
  //   });
  // },
  // onClicktjButton: function () {
  //   let that = this;
  //   if (that.data.disabled) {
  //     return false;
  //   }
  //   that.data.disabled = true;

  //   // wx.showLoading({
  //   //   title: '正在处理...'
  //   // });
  //   if (that.data.active == 6) {
  //     wx.hideLoading()
  //     return
  //   }
  //   //如果待评价
  //   if (that.data.active == 4) {

  //     var id = that.data.id

  //     wx.navigateTo({
  //       url: "/pages/addComment/addComment?order_id=" + id
  //     })
  //     return;
  //   }
  //   //如果是确认收货
  //   if (that.data.active == 2) {


  //     App._post('order/finish', {
  //       'id': that.data.id
  //     }, function (result) {
  //       var pages = getCurrentPages();
  //       var prevPage = pages[pages.length - 2]; //上一个页面
  //       var index = that.data.index
  //       var status = "OrderList[" + index + "].status";
  //       var showText = "OrderList[" + index + "].showText";
  //       var showType = "OrderList[" + index + "].showType";
  //       var showactive = "OrderList[" + index + "].showactive";


  //       if (prevPage) {
  //         // 可以修改上一页的数据
  //         prevPage.setData({
  //           [status]: "已完成",
  //           [showText]: "waitcom",
  //           [showType]: "已完成",
  //           [showactive]: 6
  //         })


  //         setTimeout(function () {
  //           that.onShow()
  //         }, 1000)
  //         //  wx.navigateBack({
  //         //   delta:1
  //         // })

  //       }

  //     }, function (result) {
  //       console.log(result);
  //     }, function () {
  //       that.data.disabled = false;
  //     });
  //     return;
  //   }

  //   App._post('order/order_pay', {
  //     'id': that.data.id
  //   }, function (result) {

  //     //这里发起支付
  //     that.wx_pay_fun(result.data);
  //   }, function (result) {
  //     console.log(result);
  //   }, function () {
  //     that.data.disabled = false;
  //   });
  // },

  // countDown: function () {

  //   var that = this;
  //   var now_time = that.data.time_diff; //获取时间差
  //   this.data.intervarID = setInterval(function () { //设置定时器
  //     //将时间差减一秒
  //     now_time--;
  //     //计算天时分秒
  //     let d = Math.floor((now_time - (now_time % 86400)) / 86400);
  //     let h = Math.floor((now_time % 86400) / 3600);
  //     let m = Math.floor((now_time % 3600) / 60);
  //     let s = now_time % 60;
  //     //将计算结果保存至data
  //     that.setData({
  //       day: d,
  //       hourse: h,
  //       minute: m,
  //       second: s,
  //     });
  //     //当时间差为0时,清除定时器
  //     if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
  //       clearInterval(that.data.intervarID);
  //     }
  //   }, 1000)
  // },

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

  onUnload() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      fromDetail: true
    })
  }
})