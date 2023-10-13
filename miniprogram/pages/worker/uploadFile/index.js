// pages/worker/uploadFile/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: "",
    fileId: "",
    img: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  inputName(e){
    console.log(e);
    this.setData({
      fileName: e.detail.value
    })
  },
  chooseFile(e) {
    console.log('mychooseFile', e);
    wx.showLoading()
    getApp().globalData.waitingUpload = true;
    let fileName = this.data.fileName;
    let that = this
    // 将 Data URL 转换为文件对象
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: (res) => {
        that.setData({
          img: 1
        })
        console.log('chooseimg success',res)
        let filePath = res.tempFilePaths[0].replace('http://tmp/', '')
        filePath = filePath.replace("wxfile://", '')
        // 上传文件到云开发服务器
        wx.cloud.uploadFile({
          cloudPath: `images/${filePath}` + parseInt(Math.random() * 100), // 上传到云开发的文件路径
          filePath: res.tempFilePaths[0],
          success: function (res) {
            console.log('image上传成功', res.fileID); // 输出上传成功的文件 ID
            that.setData({
              fileId: res.fileID
            })
            getApp().globalData.waitingUpload = false;
            wx.hideLoading()
          },
          fail: function (error) {
            console.error('上传失败', error);
            getApp().globalData.waitingUpload = false;
            wx.hideLoading()
          }
        });
      },
      fail: function () {
        console.log("fail");
        getApp().globalData.waitingUpload = false;
        wx.hideLoading()
      }
    })
  },
  upload(){
    if(this.data.fileName=="" || this.data.fileId==""){
      wx.showToast({
        title: '信息未填写完整',
        icon: 'error'
      })
      return
    }
    let file = {}
    file.fileId = this.data.fileId
    file.fileName = this.data.fileName
    console.log(file);
    wx.setStorageSync('workerFile', file)
    wx.navigateBack()
  }
})