// pages/designerFile/designerFile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {
        icon:"../../../images/designer_Upload.png",
        text:"上传文件",
        url:'../uploadFile/uploadFile?type=effect'
      },
      {
        icon:"../../../images/designer_Link.png",
        text:"网址链接",
        url:'../uploadLink/uploadLink'
      },
    ]
  },

  goNextPage(e){
    console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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