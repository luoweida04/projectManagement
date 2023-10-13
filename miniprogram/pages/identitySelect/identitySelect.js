// pages/identitySelect/identitySelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icons: []
  },

  goToNextPage(e) {
    let dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userType = wx.getStorageSync('userType');
    if (!userType) {
      wx.showToast({
        title: '该用户没有任何权限',
        icon: 'none'
      })
      return;
    }
    let tempIcons = userType.map(item => {
      switch (item) {
        case 'designer':
          return {
            src: "../../images/Identity_Accountant.png",
              text: "设计师",
              navUrl: "../orderList/orderList?userType=designer"
          };
        case 'manager':
          return {
            src: "../../images/Identity_Designer.png",
              text: "项目经理",
              navUrl: "../orderList/orderList?userType=manager"
          };
        case 'worker':
          return {
            src: "../../images/Identity_Manager.png",
              text: "工人",
              navUrl: "../orderList/orderList?userType=worker"
          };
        case 'budgeter':
          return {
            src: "../../images/Identity_Seller.png",
              text: "预算员",
              navUrl: "../orderList/orderList?userType=budgeter"
          };
        case 'sales':
          return {
            src: "../../images/Identity_Worker.png",
              text: "销售",
              navUrl: "../sale/index"
          }
      }
    })
    this.setData({
      icons: tempIcons
    })
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