// pages/warrantyInfo/warrantyInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialType: -1,   //1表示门、2表示窗户、3表示板材、4表示墙
    materialName:"123",
    materialBrand:"SCUT",
    materialPrice:"0",
    shelfLife:"365",
    warrentyStartTime:"2023-6-23",
    supplier:"supplier",
    contact:"联系人",
    contactNum:"联系方式",
    lastTime:"质保剩余",
    fileArray:[],
    fileIsNotEmpty:0,
    mid:-1              //本material的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const materialIndex=options.mid
    const projectId=getApp().globalData.projectId
    const that=this
    
    that.setData({
      mid:materialIndex
    })
    console.log(wx.getStorageSync('userPhone'))
    wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getMaterial",
        params: {projId: projectId}
      },
      success:function(res){
        
        console.log(res)
        const thisMaterial=res.result.data[materialIndex]
        wx.setNavigationBarTitle({
          title: thisMaterial.name,
        })
        let date1=new Date(thisMaterial.guaStart)
        //console.log(date1.getYear())
        //console.log(date1.getMonth())
        //console.log(date1.getDate())
        const DateStr=(date1.getYear()+1900)+"-"+(date1.getMonth()+1)+"-"+(date1.getDate())
        that.setData({
          materialName:thisMaterial.name,
          materialBrand:thisMaterial.brand,
          materialPrice:thisMaterial.price,
          supplier:thisMaterial.supplier,
          contactNum:thisMaterial.phone,
          contact:thisMaterial.clientName,
          warrentyStartTime:DateStr,
          lastTime:thisMaterial.guaTime
        })
        if(thisMaterial.files!=undefined&&thisMaterial.files.length>0){
        for(var i=0;i<thisMaterial.files.length;i++){
          that.data.fileArray[i]=thisMaterial.files[i].fileId
        }
        that.setData({
          fileIsNotEmpty:1
        })
      }
      }
    })
      
  },

  previewPict(e){
    const that =this
    console.log(that.data.mid)
    wx.navigateTo({
      url: '/pages/user/getDocument/getDocument?docName='+"budgetFile"+'&mid='+that.data.mid+'',
    })
    /*wx.previewImage({
      urls:that.data.fileArray
    })*/
    /*wx.showToast({
      title: '正在加载文件',
      icon:"loading"
    })
    wx.cloud.downloadFile({
      fileID:urlArray.fileId,
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