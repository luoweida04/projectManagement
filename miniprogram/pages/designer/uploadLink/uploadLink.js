// pages/uploadLink/uploadLink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadInfs: [{
        title: "链接命名",
        placeholder: "请输入文件名称",
        value: ""
      },
      {
        title: "网站链接",
        placeholder: "请输入VR图的网站链接",
        value: ""
      },
    ]
  },

  handleInput(e) {
    let inputVal = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let tempArr = this.data.uploadInfs;
    tempArr[index].value = inputVal;
    this.setData({
      uploadInfs: tempArr
    })
  },

  uploadFile() {
    let projectId = getApp().globalData.projectId;
    wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "addUploadedFiles",
          params: {
            projId: projectId,
            fileType: "effectvr",
            fileName: this.data.uploadInfs[0].value,
            fileId: this.data.uploadInfs[1].value
          }
        }
      })
      .then(res => {
        console.log(res)
          if (res.result && res.result.data && res.result.data.errMsg=="collection.add:ok") {
            wx.navigateBack();
            wx.showToast({
              title: '上传成功',
              icon:"success"
            })
          } else {
            wx.navigateBack();
            wx.showToast({
              title: '有文件信息上传失败，请重试',
            })
          }

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