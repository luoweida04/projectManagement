// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    tempType: ""
  },

  goToOperate(e) {
    let dataset = e.currentTarget.dataset
    getApp().globalData.projectId = dataset.projectid
    let nextUrl = ""
    switch (this.data.tempType) {
      case 'manager':
        nextUrl = '../manager/index';
        break;
      case 'worker':
        nextUrl = '../worker/index';
        break;
      case 'designer':
        nextUrl = '../designer/designer';
        break;
      case 'budgeter':
        nextUrl = '../budget/budgetTable/budgetTable';
        break;
      case "customer":
        nextUrl="../user/selectPanel/selectPanel"
    }
    wx.navigateTo({
      url: nextUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.role=="customer"){
      this.setData({
        tempType: "customer"
      })
      const that = this;
      let userPhone = wx.getStorageSync('userPhone')
      wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "getCustomerProjects",
          params: {
            phoneNumber: userPhone
          }
        }
      }).then(res => {
        console.log(res)
        if (res.result && res.result.data) {
          let projects = res.result.data;
          console.log(projects)
          that.setData({
            orderList: projects
          })
        } else {
          wx.showToast({
            title: '没有关于您的工单',
            icon: 'none'
          })
        }
      })
    }else{
    this.setData({
      tempType: options.userType
    })
  
    // return;
    const that = this;
    let userPhone = wx.getStorageSync('userPhone')
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProjectByRole",
        params: {
          phoneNumber: userPhone
        }
      }
    }).then(res => {
      if (res.result && res.result.data && res.result.data[options.userType].length > 0) {
        let projects = res.result.data[options.userType];
        console.log
        console.log(projects)
        that.setData({
          orderList: projects
        })

      } else {
        wx.showToast({
          title: '没有关于您的工单',
          icon: 'none'
        })
      }
    })
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