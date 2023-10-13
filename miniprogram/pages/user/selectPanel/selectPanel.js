// pages/user/selectPanel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"用户",
    contactNum:"12345678910",
    address:"SCUT",
    surfacePhoto:[],
    effectPhoto:{}
  },
  toWarrenty(e){
    wx.navigateTo({
      url: '/pages/warrantySelect/warrantySelect',
    })
  },

  constructProcess(e){
    wx.navigateTo({
      url: '/pages/constructProcess/constructProcess',
    })
  },
  toBudget(e){
    wx.navigateTo({
      url: '/pages/user/budgetTable/budgetTable',
    })
  },
  toConstructionSite(e){
    wx.navigateTo({
      url: '/pages/user/getDocument/getDocument?docName='+"construct"+'',
    })
  },
  surfaceImage(e){
    const that=this
    wx.navigateTo({
      url: '/pages/user/getDocument/getDocument?docName='+"surface"+'',
    })
    /*console.log(that.data.surfacePhoto)
    wx.cloud.downloadFile({
      fileID:that.data.surfacePhoto[2],
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
    })*/
  },

  effectImage(e){
    const that=this
    wx.navigateTo({
      url: '/pages/user/getDocument/getDocument?docName='+"effect"+'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "达意装修",
    })
    const that=this;
    var telephoneNum;
    const projectId=getApp().globalData.projectId
    //console.log(getApp().globalData.userPhone)
    wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getProject",
        params:{
          projId: projectId,
          
        }
      },
      success:function(res){
        console.log(res)
        const photos=res.result.data.photos
        if(photos.surface!=undefined&&photos.surface
          .length>0){
            for(var i =0;i<photos.surface
              .length;i++){
                that.setData({
                ["surfacePhoto["+i+"]"]:photos.surface[i].fileId
                })
              }
          }
          if(photos.effect!=undefined&&photos.effect
            .length>0){
              for(var i =0;i<photos.effect
                .length;i++){
                  that.setData({
                  ["effectPhoto["+i+"]"]:photos.effect[i].fileId
                  })
                }
            }
      }
    })
    wx.cloud.callFunction({
      name:"UserServices",
      data:{
        action:"getUser",
        params:{
          phoneNumber:wx.getStorageSync('userPhone')
        }
      },
      success:function(res){
        that.setData({
          userName:res.result.data.userName,
          contactNum:res.result.data.phoneNumber,
          address:res.result.data.address
        })
        console.log(that.data.contactNum)
      },
      fail:console.error
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