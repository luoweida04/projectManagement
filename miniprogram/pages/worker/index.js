// pages/worker/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId: 16,
    phone: "12306test",
    boxs: [
      // {
      //   name: "主体打拆",
      //   url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_01@3x.png"
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 这里是要加上的, 测试暂时不加, projid也需要
    let phone = wx.getStorageSync('userPhone')
    this.setData({
      phone: phone,
      projId: getApp().globalData.projectId
    })
  },
  onShow(){
    this.getProcedure()
  },
  getProcedure(){
    wx.showLoading({
      title: 'Loading...',
    })
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProcedure",
        params: {
          projId: this.data.projId,
        }
      }
    }).then(res => {
      console.log(res)
      let temp = []
      let phone = this.data.phone
      res.result.data.forEach(item => {
        item.worker.forEach(w => {
          if(w==phone) {
            temp.push(item)
            return
          }
        });
      });
      this.setData({
        boxs: temp
      })
      console.log(this.data.boxs);
      wx.hideLoading()
    })
  },
  upLoad(e){
    let procedure = JSON.stringify(this.data.boxs[e.currentTarget.dataset.i])
    wx.navigateTo({
      url: `/pages/worker/onePro/index?pro=${procedure}&phone=${this.data.phone}&projId=${this.data.projId}`,
    })
  },
})