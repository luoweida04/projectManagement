// pages/budget/budgetTable/budgetTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    budget: [],
    deleteCheck: false,
    delIdx: -1,
    delArr: ""
  },

  onClose() {
    this.setData({
      deleteCheck: false
    });
  },

  deleteFile(e) {
    const dataset = e.currentTarget.dataset
    this.setData({
      deleteCheck: true,
      delArr: dataset.delarr,
      delIdx: dataset.delidx
    })
  },

  deleteConfirm() {
    //AfterDeleteFile
    const delArr = this.data[this.data.delArr]
    let removeId = delArr[this.data.delIdx].fileId
    wx.showLoading({
      title: '正在删除',
    })
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "removeBudget",
        params: {
          projId: getApp().globalData.projectId,
          files: [
            removeId
          ]
        }
      }
    }).then(res => {
      console.log(res)
      if (res.result && res.result.ok && res.result.ok == true) {
        delArr.splice(this.data.delIdx, 1);
        let tempObj = {};
        tempObj[this.data.delArr] = delArr;
        tempObj["deleteCheck"] = false;
        this.setData(tempObj)
        wx.hideLoading();
        wx.showToast({
          title: '删除成功',
          icon: "success"
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: '网络异常，请重试',
          icon: "error"
        })
      }
    })
  },

  goToUpload(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url + '?type=budgeter',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    let projectId = getApp().globalData.projectId
    this.setData({
      projectId: projectId
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
    const that = this;
    // wx.showLoading();
    let loop = true;

    function getInf() {
      if (loop) {
        setTimeout(() => {
          if (getApp().globalData.waitingUpload == false) {
            loop = false;
            wx.cloud.callFunction({
              name: "OrderServices",
              data: {
                action: "getProject",
                params: {
                  projId: that.data.projectId
                }
              }
            }).then(res => {
              console.log("getProject:", res.result.data)
              if (res.result && res.result.data && res.result.data.budget) {
                that.setData({
                  budget: res.result.data.budget || [],
                })
              }
            })
            wx.hideLoading();
          } else {
            getInf();
          }
        }, 500)
      }
    }
    getInf();
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