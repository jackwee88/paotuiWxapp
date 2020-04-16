var App = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    selectAllStatus: false,
    wxapp: null,
    detail_addr:[
      {id:'1',name:'福建省厦门市'},
    ],
    limit:10,
    page:1,
  },

  onLoad: function() {
    this.getData()
  },
  onShow: function() {
    
  },
  getData:function(){
    const that = this
    util.ajax('api/Sundry/getAddressList',{
      limit:10,
      page:that.data.page
    },res=>{
      console.log(res)
      that.setData({
        detail_addr:res.data.addressList
      })
    })
  },
  checked:function(e){
    var pages = getCurrentPages();
    console.log(pages)
    var prevPage = pages[pages.length-2];
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    console.log(name)
    prevPage.setData({
      address_id:id,
      address_name:name,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1, //返回到前一个页面
      })
    }, 2000)
  },
  onUnload(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      fromDetail:true
    })
  }
})