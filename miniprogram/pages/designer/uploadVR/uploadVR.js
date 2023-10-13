// pages/uploadVR/uploadVR.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadInfs: [{
        title: "未装修全景",
        placeholder: "请输入未装修全景网址链接",
        value: ""
      },
      {
        title: "水电全景",
        placeholder: "请输入水电全景网址链接",
        value: ""
      },
      {
        title: "装修后全景",
        placeholder: "请输入装修后全景网址链接",
        value: ""
      },
    ],

  },

  handleInput(e) {
    console.log(e)
    let inputVal = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let tempArr = this.data.uploadInfs;
    tempArr[index].value = inputVal;
    this.setData({
      uploadInfs: tempArr
    })
  },

  uploadVR() {
    wx.showLoading()
    let projectId = getApp().globalData.projectId;
    Promise.all(this.data.uploadInfs.map((item) => {
      return wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "addUploadedFiles",
          params: {
            projId: projectId,
            fileType: "vr",
            fileName: item.title,
            fileId: item.value
          }
        }
      })
    })).then(res=>{
      let flag = true;
      console.log(res)
      for(let i=0;i<res.length;i++){
        if(res[i].result && res[i].result.data && res[i].result.data.errMsg == "collection.add:ok"){
        }else{
          flag = false;
        }
      }
      wx.hideLoading();
      if(!flag){
        wx.navigateBack();
        wx.showToast({
          title: '有文件信息上传失败，请重试',
        })
      }else{
        wx.navigateBack();
        wx.showToast({
          title: '上传成功',
          icon:'success'
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