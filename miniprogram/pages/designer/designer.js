// pages/designer/designer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surface: [

    ],
    effect: [],
    effectvr:[],
    construct: [],
    vr: [],
    deleteCheck: false,
    delIdx: -1,
    delArr: "",
    projectId: ""
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

  deleteConfirm(e) {
    //AfterDeleteFile
    const delArr = this.data[this.data.delArr]
    let removeId = delArr[this.data.delIdx].fileId
    wx.showLoading({
      title: '正在删除',
    })
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "removeUploadedFiles",
        params: {
          projId: getApp().globalData.projectId,
          fileType: this.data.delArr,
          fileId: removeId
        }
      }
    }).then(res => {
      console.log(res)
      if (res.result && res.result.data && res.result.data.stats && res.result.data.stats.removed >= 1) {
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
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常，请重试',
          icon: "error"
        })
      }

    })

  },

  goToUpload(e) {
    let dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: dataset.url + '?type=' + dataset.type,
    })
  },

  downloadItem(e) {
    // let index = e.currentTarget.dataset.index;
    // let type = e.currentTarget.dataset.type;
    // let fileID = this.data[type][index].fileId;
    // wx.cloud.downloadFile({
    //   fileID: fileID
    // }).then(res => {
    //   console.log(res)
    // })
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
        setTimeout(async () => {
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
              console.log(res.result.data)
              if (res.result && res.result.data && res.result.data.photos) {
                let photos = res.result.data.photos;
                that.setData({
                  surface: photos.surface || [],
                  effect: photos.effect || [],
                  effectvr :photos.effectvr || [],
                  vr: photos.vr || [],
                  construct: photos.construct || []
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