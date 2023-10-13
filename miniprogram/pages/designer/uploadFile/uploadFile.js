// pages/designer/uploadFile/uploadFile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: "",
    fileUrl: "",
    uploadState: false,
    uploadType: "",
    projId: "",
    workerFile: 0,
    material: 0
  },

  // 选择文件
  async chooseFile(e) {
    wx.showLoading()
    getApp().globalData.waitingUpload = true;
    console.log("e", e)
    const that = this;
    let dataUrl = e.detail.data[0].fileData;
    let fileName = e.detail.data[0].fileName;
    if (fileName == "") {
      getApp().globalData.waitingUpload = false;
      wx.hideLoading();
      wx.showToast({
        title: '文件名为空，上传失败',
        icon: 'error'
      })
      return;
    }
    // 将 Data URL 转换为文件对象
    const filePath = fileName; // 指定文件名称
    const buffer = wx.base64ToArrayBuffer(dataUrl.split(',')[1]); // 将 base64 数据转换为 ArrayBuffer
    const fs = wx.getFileSystemManager();
    const filePathInWX = `${wx.env.USER_DATA_PATH}/${filePath}` + parseInt(Math.random() * 100);
    console.log("filePathInWX", filePathInWX);

    const basepath = `${wx.env.USER_DATA_PATH}`
    // 写入前清除临时文件，确保能写入
    await fs.readdir({
      dirPath: basepath, /// 获取文件列表
      success(res) {
        res.files.forEach((val) => { // 遍历文件列表里的数据
          fs.unlink({
            filePath: basepath + '/' + val
          });
        })
      },
      fail(err) {
        console.err(err)
      },
      complete() {
        console.log('complete')
      }
    })
    fs.writeFile({
      filePath: filePathInWX,
      data: buffer,
      encoding: 'binary',
      success: () => {
        // 上传文件到云开发服务器
        wx.cloud.uploadFile({
          cloudPath: `files/${that.data.projId}/${that.data.projId}/${filePath}`, // 上传到云开发的文件路径
          filePath: filePathInWX,
          success: async function (res) {
            console.log('上传成功', res.fileID); // 输出上传成功的文件 ID
            let uploadres;
            switch (that.data.uploadType) {
              case 'surface':
                uploadres = await wx.cloud.callFunction({
                  name: "OrderServices",
                  data: {
                    action: "addUploadedFiles",
                    params: {
                      projId: that.data.projId,
                      fileType: "surface",
                      fileName: fileName,
                      // type: "file",
                      fileId: res.fileID
                    }
                  }
                })
                if (uploadres.result && uploadres.result.data && uploadres.result.data.errMsg == "collection.add:ok") {
                  wx.showToast({
                    title: '上传成功',
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '网络异常，请重试',
                  })
                }
                break;
              case 'effect':
                uploadres = await wx.cloud.callFunction({
                  name: "OrderServices",
                  data: {
                    action: "addUploadedFiles",
                    params: {
                      projId: that.data.projId,
                      fileType: "effect",
                      fileName: fileName,
                      fileId: res.fileID,
                    }
                  }
                })
                console.log("uploadRes",uploadres)
                if (uploadres.result && uploadres.result.data && uploadres.result.data.errMsg == "collection.add:ok") {
                  wx.showToast({
                    title: '上传成功',
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '网络异常，请重试',
                  })
                }
                break;
              case 'construct':
                uploadres = await wx.cloud.callFunction({
                  name: "OrderServices",
                  data: {
                    action: "addUploadedFiles",
                    params: {
                      projId: that.data.projId,
                      fileType: "construct",
                      fileName: fileName,
                      fileId: res.fileID
                    }
                  }
                })
                if (uploadres.result && uploadres.result.data && uploadres.result.data.errMsg == "collection.add:ok") {
                  wx.showToast({
                    title: '上传成功',
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '网络异常，请重试',
                  })
                }
                break;
              case 'budgeter':
                uploadres = await wx.cloud.callFunction({
                  name: "OrderServices",
                  data: {
                    action: "addBudget",
                    params: {
                      projId: that.data.projId,
                      files: [{
                        fileName: fileName,
                        fileId: res.fileID
                      }]
                    }
                  }
                })
                console.log("uploadres",uploadres)
                if (uploadres.result && uploadres.result.ok && uploadres.result.ok == true) {
                  wx.showToast({
                    title: '上传成功',
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '网络异常，请重试',
                  })
                }
                break;
            }
            // 主材文件
            console.log(that.data.workerFile)
            if (that.data.material != 0 && that.data.material != undefined) {
              console.log("上传主材文件");
              let file = {
                name: fileName,
                fileId: res.fileID
              }
              wx.setStorageSync('material', file)
            }
            // 工人视频
            else if (that.data.workerFile == 1) {
              console.log("上传工人视频, fileName=", fileName);
              let file = {
                fileName: fileName,
                fileId: res.fileID
              }
              wx.setStorageSync('workerFile', file)
            }
            getApp().globalData.waitingUpload = false;
          },
          fail: function (error) {
            getApp().globalData.waitingUpload = false;
            console.error('上传失败', error);
          }
        });
      },
      fail: (error) => {
        getApp().globalData.waitingUpload = false;
        console.error('写入文件失败', error);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options",options)
    this.setData({
      uploadType: options.type,
      projId: getApp().globalData.projectId,
      workerFile: options.workerFile,
      material: options.material
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