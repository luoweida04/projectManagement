// pages/sale/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
    phone: "",
  },
  onLoad(options){
    let phone = wx.getStorageSync('userPhone')
    this.setData({
      phone: phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    wx.cloud.callFunction({
      name: "OrderServices",
      // name: "ProjectServices",
      data: {
        action: "getProjectByRole",
        params: { 
          // phoneNumber: "12345"
          phoneNumber: this.data.phone
        }
      }
    }).then(res => {
      console.log("res", res.result.data.sales)
      this.setData({
        projects: res.result.data.sales
      })
    })
  },
  createWorkOrder(){
    wx.navigateTo({
      url: '/pages/sale/createOrder/index',
    })
  }
})