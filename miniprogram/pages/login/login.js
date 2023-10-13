// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: ""
  },

  inputPhone(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  goToIntro() {
    wx.navigateTo({
      url: '../intro/intro',
    })
  },

  login() {
    const that = this;
    let type = "none";
    console.log(that.data.phoneNum)
    //通过手机号判断权限，并跳转页面
    wx.cloud.callFunction({
      name: "UserServices",
      data: {
        action: "getUser",
        params: {
          phoneNumber: that.data.phoneNum
        }
      }
    }).then(res => {
      //如果存在该手机号注册的用户，则更新type，否则type仍为none
      if (res.result && res.result.data && res.result.data) {
        let user = res.result.data;
        type = user.userType;
        console.log(type)
        if(typeof(type)!="object"){
          console.error('userType类型错误')
          return
        }
        //将手机号写入缓存
        wx.setStorageSync('userPhone', that.data.phoneNum)
        //将用户权限写入缓存
        wx.setStorageSync('userType', type)
      }
      //手机号未找到
      if (type === "none") {
        wx.showToast({
          icon: "none",
          title: '该手机号未注册',
        })
      } 
      //是客户
      else if (typeof(type)==="object"&&type.find(item => item === 'customer')) {
        wx.navigateTo({
          //url: '../user/selectPanel',
          url:"../orderList/orderList?role=customer"
        })
      } 
      //是工作人员
      else {
        wx.navigateTo({
          url: '../identitySelect/identitySelect',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('userPhone')) {
      this.setData({
        phoneNum: wx.getStorageSync('userPhone')
      })
      this.login();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})