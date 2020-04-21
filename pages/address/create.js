let App = getApp();
var util = require('../../utils/util.js')
Page({

  data: {
  checkedtime:'',
    campusList: [],
    visible:false,
    addressee:'',
    addressee_mobile:'',
    receipt_address:'',
    tackcode:'',
    address_id:'',
    address_name:'',
    annouce:'啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
    sexList:[
      {
        id:2,
        name:'女士'
      },
      {
        id: 1,
        name: '先生'
      },
    ],
    sexCurrent:0

  },

  onLoad: function (options) {
    this.getAnnouce()
    this.init()
    var token=wx.getStorageSync('token')
    var userinfo = wx.getStorageSync('userinfo')
    var id = wx.getStorageSync('sex')
    if(!token){
      wx.navigateTo({
        url: '/pages/index/login',
      })
    }
    if(userinfo){
      this.setData({
        addressee:userinfo.addressee,
        addressee_mobile:userinfo.addressee_mobile,
        receipt_address:userinfo.receipt_address,
      })
    }
    if(id){
      this.setData({
        sexCurrent:id
      })
    }
  },

  onShow: function () {
    this.getAnnouce()
    var screenW = wx.getSystemInfoSync().windowWidth
    var token=wx.getStorageSync('token')
    var address = wx.getStorageSync('addressinfo')
    if(address){
      this.setData({
        address_name:address.address_name,
        address_id:address.address_name
      })
    }
    if(!token){
      wx.navigateTo({
        url: '/pages/index/login',
      })
    }
  },
  //获取地址类型
  getAnnouce:function(){
    let that=this
    util.ajax('api/Sundry/getNotice','',res=>{
      if(res.code==0){
        wx.navigateTo({
          url: '/pages/index/login',
        })
      }
      that.setData({
        annouce:res.data.notice.content
      })
    })
  },
  init:function(){

  },
  pay: function (e) {
    let that = this;
    let param={
      addressee:that.data.addressee,
      address_id:that.data.address_id,
      addressee_mobile:that.data.addressee_mobile,
      receipt_address:that.data.receipt_address,
      takecode:that.data.tackcode,
      // time:e.currentTarget.dataset.id,
    }
    if (!that.validation(param)) {
      App.showError(that.data.error);
      return false;
    }

    if(this.data.sexCurrent==0){
      App.showError('请选择性别');
      return false;
    }
    that.setData({
      disabled: true
    });
    //这里提交服务器
    util.ajax('api/Order/setOrder', param,res=>{
      wx.setStorageSync('userinfo', param)
      util.ajax('api/Order/getOrderPay',{orderId:res.data.orderDetails.id},ress=>{
        wx.requestPayment({
          timeStamp: String(ress.data.requestPayment.timeStamp),
          nonceStr: ress.data.requestPayment.nonceStr,
          package: ress.data.requestPayment.package,
          signType: ress.data.requestPayment.signType,
          paySign: ress.data.requestPayment.paySign,
          success: function (payres) {
            wx.navigateTo({
              url: '/pages/detailindex/detail?order_id=' + res.data.orderDetails.id

            })

          },
          fail: function () {
            // wx.showModal({
            //   title: '错误提示',
            //   content: '支付失败',
            //   showCancel: false
            // })
            wx.navigateTo({
              url: '/pages/detailindex/detail?order_id=' + res.data.orderDetails.id

            })
          },
          complete: function () {
            // complete
          }
        })
      })
    });
  },

  getTime:function(){
    let that=this
    const show = this.data.visible
    that.setData({
      visible:!show
    })
  },
  checkedtime:function(e){
    let that=this
    that.setData({
      visible:false,
      checkedtime:e.currentTarget.dataset.time
    })
  },
  inputChange:function(e){
    var that = this
    var type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  validation: function (values) {   
    if (values.address_name === '') {
      wx.showToast({
        title: '请选择取件地址',
        icon:"none"

      })
      return false;
    }
    if (values.addressee === '') {
      wx.showToast({
        title: '收件人不能为空',
        icon:"none"
      })
      return false;
    }
    if (values.addressee_mobile.length < 1) {
      wx.showToast({
        title: '手机号不能为空',
        icon:"none"
      });
      return false;
    }
    // let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    let reg = /^(((1[0-9]{1}[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.addressee_mobile)) {
      wx.showToast({
        title: '手机号不符合要求',
        icon:"none"

      });
      return false;
    }
    if (values.receipt_address === '') {
      wx.showToast({
        title: '请填写送达地址',
        icon:"none"

      });
      return false;
    }
    if(values.tackcode === ''){
      wx.showToast({
        title: '取件码不能为空',
        icon:"none"

      });
    }
    return true;
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.iv == undefined) {
      return;
    }
    let dataTMp = [];
    dataTMp.encryptedData = e.detail.encryptedData;
    dataTMp.iv = e.detail.iv;
    var that = this;
    App._post('aboutwechat/get_PhoneNum', dataTMp, function (result) {
      App.showSuccess('成功获取');
      that.setData({
        phoneNumber: result.data.phoneNumber
      });
    });
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  getLocation() {
    wx.navigateTo({
      url: '/pages/addressDetail/detail',
    })
  },
  getPermission: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          addrname: res.name,
          addr: res.address,    //调用成功直接设置地址
          addrLat: res.latitude,
          addrLon: res.longitude
        })
        let data = { latitude: res.latitude, longitude: res.longitude };
        // that.sendMessage(4, JSON.stringify(data));
        that.loadCity(res.longitude, res.latitude)
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              that.setData({
                                addrname: res.name,
                                addr: res.address,    //调用成功直接设置地址
                                addrLat: res.latitude,
                                addrLon: res.longitude
                              })
                              let data = { latitude: res.latitude, longitude: res.longitude };
                              that.sendMessage(4, JSON.stringify(data));
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },


  loadCity: function (longitude, latitude) {
    var _self = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo?output=json&location=' + longitude + ',' + latitude + '&key=fd07585360185ee1b6dc8e87ff555ed4&radius=1000&extensions=all',

      success: function (res) {
        if (res.data.regeocode.addressComponent.city.length==0){
          _self.setData({
            region: res.data.regeocode.addressComponent.province + ',' + res.data.regeocode.addressComponent.province + ',' + res.data.regeocode.addressComponent.district + ',' + res.data.regeocode.addressComponent.township
          })
        }else{
          _self.setData({
            region: res.data.regeocode.addressComponent.province + ',' + res.data.regeocode.addressComponent.city + ',' + res.data.regeocode.addressComponent.district + ',' + res.data.regeocode.addressComponent.township
          })
        }
       
        // console.log(res.data.regeocode.addressComponent.city);
      },
      fail: function (res) {
        console.log('获取地理位置失败')
      }
    })
  },



  chooseSex:function(e){
    var _this = this
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    _this.setData({
      sexCurrent: id
    })
    wx.setStorageSync('sex', id)
  },
  getInput: function (e) {//方法1
    this.data.addrname = e.detail.value;
  },
})