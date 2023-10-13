// pages/budgetTable/budgetTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    budgetArray:[]
  },

  previewTable(e){
    
    const that=this
    console.log(e.currentTarget.dataset.budgetindex)
    const urlArray=[that.data.budgetArray[e.currentTarget.dataset.budgetindex].fileId]
    console.log(urlArray)
    wx.showToast({
      title: '正在加载文件',
      icon:"loading"
    })
    wx.cloud.downloadFile({
      fileID:urlArray[0],
      success:function(res){
        console.log(res)
        
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail:function(e){
        console.log(e)
        wx.showToast({
          title: '下载失败',
          icon:"error"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "预算表文件",
    })
    const projectId=getApp().globalData.projectId
    const userPhone=wx.getStorageSync('userPhone')
    console.log(projectId)
    const that=this
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProject",
        params: {
          projId: projectId
        }
      },success:function(res){
        console.log(res)
        that.setData({
          budgetArray:res.result.data.budget
        })
        
      }
    
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