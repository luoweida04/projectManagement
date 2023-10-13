// pages/sale/createOrder/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    formData: {
      name: "",
      contact: "",
      address: "",
      area: "",
      price: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let phone = wx.getStorageSync('userPhone')
    this.setData({
      phone: phone
    })
  },
  inputName(e) {
    this.setData({
      "formData.name": e.detail.value
    })
  },
  inputContact(e) {
    this.setData({
      "formData.contact": e.detail.value
    })
  },
  inputAddress(e) {
    this.setData({
      "formData.address": e.detail.value
    })
  },
  inputAera(e) {
    this.setData({
      "formData.area": e.detail.value
    })
  },
  inputPrice(e) {
    this.setData({
      "formData.price": e.detail.value
    })
    console.log(this.data.formData);
  },
  cancel() {
    wx.navigateBack();
  },
  affirm() {
    // 提交云函数
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "create",
        params: {
          // phoneNumber: "12345",
          phoneNumber: this.data.phone,
          data: {
            name: this.data.formData.name,
            worker: "",
            sales: "",
            designer: "",
            budgeter: "",
            manager: "",
            // 自定义
            customer: this.data.formData.contact,
            address: this.data.formData.address,
            area: this.data.formData.area,
            price: this.data.formData.price
          }
        }
      }
    }).then(res => {
      console.log("立项", res)
      wx.navigateBack();
    })
  }
})