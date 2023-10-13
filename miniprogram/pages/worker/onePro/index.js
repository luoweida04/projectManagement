// pages/worker/onePro/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId: 16,
    phone: "12306test",

    pro: Object,
    showDialog: false,
    delIndex: 0,
    isPreview: false,//预览图片
    type: 'image' // 文件类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      phone: options.phone,
      projId: options.projId,
      pro: JSON.parse(options.pro)
    })
    console.log('pro', this.data.pro);
  },
  onShow() {
    if(this.data.isPreview==true) {
      this.setData({
        isPreview: false
      })
      return
    }
    console.log('onShow');
    let that = this
    let loop = true;
    function getInf() {
      if (loop) {
        setTimeout(() => {
          if (getApp().globalData.waitingUpload == false) {
            loop = false;
            let file = wx.getStorageSync('workerFile')
            if(file != "" && file != undefined) that.uploadVideoAndImage(file)
            console.log("workerFile", file);
            wx.setStorageSync('workerFile', undefined)
            wx.hideLoading();
          } 
          else getInf();
        }, 500)
      }
    }
    getInf();
  },
  gotoUpLoad(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '您要上传图片还是视频',
      cancelText: '图片',
      confirmText: '视频',
      success (res) {
        if (res.confirm) {
          console.log('视频')
          // 上传页面
          that.setData({
            type: 'video'
          })
          wx.navigateTo({
            url: '/pages/designer/uploadFile/uploadFile?workerFile=1',
          })
        } else if (res.cancel) {
          console.log('图片')
          that.setData({
            type: 'image'
          })
          wx.navigateTo({
            url: '/pages/worker/uploadFile/index',
          })
        }
      }
    })
  },
  formater(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let temp = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    return temp;
  },
  uploadVideoAndImage(file){
    let temp = this.data.pro
    if(temp.files==undefined) temp.files=[]
    file.type = this.data.type
    file.Date = this.formater(new Date())
    temp.files.push(file)
    this.setData({
      pro: temp
    })
    console.log(temp);
    this.updateProcedure(temp)
    this.addFile(file)
  },
  updateProcedure(temp){
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "updateProcedure",
        params: {
          projId: this.data.projId,
          data: temp
        }
      }
    }).then(res => {
      console.log('updateProcedure',res);
    })
  },
  // 改成单独更新文件了
  addFile(oneFile){
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "addConstructPhotos",
        params: {
          projId: this.data.projId,
          procName: this.data.pro.name,
          fileId: oneFile.fileId,
          fileName: oneFile.fileName,
          data: {
            Date: oneFile.Date,
            type: oneFile.type
          }
        }
      }
    }).then(res => {
      console.log('addFile',res);
    })
  },
  removeFile(oneFile){
    console.log(oneFile);
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "removeConstructPhotos",
        params: {
          projId: this.data.projId,
          procName: this.data.pro.name,
          fileId: oneFile.fileId,
        }
      }
    }).then(res => {
      console.log('removeFile',res);
    })
  },
  delFile(e){
    this.setData({
      showDialog: true,
      delIndex: e.currentTarget.dataset.i
    })
    console.log(e.currentTarget.dataset.i);
    console.log(this.data.pro.files[e.currentTarget.dataset.i]);
  },
  cancelDel(){
    this.setData({
      showDialog: false
    })
  },
  confirmDel(){
    let temp = this.data.pro
    this.removeFile(temp.files[this.data.delIndex])
    temp.files.splice(this.data.delIndex, 1);
    this.setData({
      pro: temp,
      showDialog: false
    })
    console.log('temp',temp);
    // this.updateProcedure(temp)
  },
  previewImg(e){
    this.setData({
      isPreview: true
    })
    console.log('previewImg');
    let cur = this.data.pro.files[e.currentTarget.dataset.i].fileId
    let that = this
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: [cur], // 需要预览的图片http链接列表
      success(res){
        console.log('成功',res);
      },
      fail(res) {
        console.log('失败',res);
        that.setData({
          isPreview: false
        })
      }
    })
  }
})