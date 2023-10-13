// pages/warrantySelect/warrantySelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialList:[],
  },

  door(e){
    console.log(e)
    console.log(e.currentTarget.dataset.materialindex)
    const mid=e.currentTarget.dataset.materialindex
    wx.navigateTo({
      url: '/pages/warrantyInfo/warrantyInfo?mid='+mid+'',
    })
  },
  window1(e){
    wx.navigateTo({
      url: '/pages/warrantyInfo/warrantyInfo?pid='+2+'',
    })
  },
  material(e){
    wx.navigateTo({
      url: '/pages/warrantyInfo/warrantyInfo?pid='+3+'',
    })
  },
  wall(e){
    wx.navigateTo({
      url: '/pages/warrantyInfo/warrantyInfo?pid='+4+'',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "质保信息",
    })
    const projectId=getApp().globalData.projectId
    const that=this
    wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getMaterial",
        params: {projId: projectId}
      },
      success:function(res){
        console.log(res)
        const materialArray=res.result.data
        for(var i =0;i<materialArray.length;i++){
          that.setData({
            ["materialList["+i+"]"]:materialArray[i].name
          })
        }
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