// pages/sale/material/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId: "",
    editIndex: -1,
    info: [
      // {
      //   name: '',
      //   brand: '1',
      //   price: 1,
      //   guaTime: 180,
      //   guaStart: 1420041600000,
      //   supplier:"123",
      //   clientName:"456",
      //   phone:"12345",
      //   files: []
      // }
    ],
    colors: [
      ["#2187FF", "#64BEFF"],
      ["#21AFFF", "#64C7FF"],
      ["#FF9E57", "#FFC34F"]
    ],
    showEdit: false,
    formData: {},
    date: '', // "2023.7.13",
    showDatePicker: false,
    datePickerTime: Number // 暂时的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projId: options.projId
    })
    this.getMaterial()
  },
  onShow() {
    if (this.data.showEdit == false) return;
    // wx.showLoading({
    //   title: 'Loading...',
    // })
    let that = this
    let loop = true;

    function getInf() {
      if (loop) {
        setTimeout(() => {
          if (getApp().globalData.waitingUpload == false) {
            loop = false;
            let file = wx.getStorageSync('material')
            console.log("file", file);
            if (file == undefined || file=='') return;
            let fd = that.data.formData
            if (fd.files == undefined) fd.files = []
            fd.files.push({
              name: file.name,
              fileId: file.fileId
            })
            that.setData({
              formData: fd
            })
            wx.setStorageSync('material', undefined)
            wx.hideLoading();
          } else getInf();
        }, 500)
      }
    }
    getInf();
  },
  getMaterial() {
    console.log("get: getMaterial");
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getMaterial",
        params: {
          projId: this.data.projId,
        }
      }
    }).then(res => {
      console.log('getMaterial',res);
      if(JSON.stringify(res.result.data)=='{}'){
        this.setData({
          info: []
        })
      }else {
        this.setData({
          info: res.result.data
        })
      }
    })
  },
  formater(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let temp = year + '.' + (month < 10 ? '0' + month : month) + '.' + (day < 10 ? '0' + day : day);
    this.setData({
      date: temp
    })
  },
  newInfo() {
    this.setData({
      showEdit: true,
      formData: {},
      date: "",
      editIndex: -1,
    })
  },
  edit(e) {
    console.log("this.data.info", this.data.info);
    // 可能是指针问题，只能这样做
    let temp = {
      ...(this.data.info[e.currentTarget.dataset.index])
    }
    let tempFiles
    if (temp.files == undefined || temp.files == []) tempFiles = []
    else tempFiles = [...temp.files]
    temp.files = tempFiles

    this.setData({
      showEdit: true,
      formData: temp,
      date: '',
      editIndex: e.currentTarget.dataset.index
    })
    this.formater(temp.guaStart)
  },
  inputName(e) {
    this.setData({
      "formData.name": e.detail.value
    })
  },
  inputBrand(e) {
    this.setData({
      "formData.brand": e.detail.value
    })
  },
  inputPrice(e) {
    this.setData({
      "formData.price": e.detail.value
    })
  },
  inputQgp(e) {
    this.setData({
      "formData.guaTime": e.detail.value
    })
  },
  selectTime() {
    this.setData({
      showDatePicker: true
    })
  },
  onInputDatePicker(e) {
    console.log("e", e);
    this.setData({
      datePickerTime: e.detail
    })
  },
  comfirmDate() {
    this.setData({
      showDatePicker: false,
      "formData.guaStart": this.data.datePickerTime,
    })
    this.formater(this.data.datePickerTime)
  },
  cancelDate() {
    this.setData({
      showDatePicker: false
    })
  },
  inputSupplier(e) {
    this.setData({
      "formData.supplier": e.detail.value
    })
  },
  inputContacts(e) {
    this.setData({
      "formData.clientName": e.detail.value
    })
  },
  inputContactWay(e) {
    this.setData({
      "formData.phone": e.detail.value
    })
  },
  upLoad() {
    wx.navigateTo({
      url: '/pages/designer/uploadFile/uploadFile?material=1',
    })
  },
  downloadFile(e) {
    console.log('开始下载',e);
    let i = e.currentTarget.dataset.i
    let that = this
    wx.showLoading({
      title: '下载中...',
    })
    console.log('urls', that.data.info[that.data.editIndex].files);
    let fileId = that.data.info[that.data.editIndex].files[i].fileId
    wx.cloud.downloadFile({
      fileID: fileId,
      success(res) {
        wx.hideLoading()
        console.log('下载成功',res);
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          success(res) {
            console.log('success',res)
          },
          fail(res) {
            console.log('fail',res);
          }
        })
      },
      fail(res) {
        wx.hideLoading()
        console.log('下载失败', res);
      }
    })
  },
  delFile(e) {
    // 这里修改不知道怎么回事，直接temp = this.data.formData然后temp.files.splie不行
    let temp = this.data.formData
    let tempFiles = [...this.data.formData.files]
    tempFiles.splice(e.currentTarget.dataset.i, 1);
    temp.files = [...tempFiles]
    this.setData({
      formData: temp
    })
  },
  cancel() {
    this.setData({
      showEdit: false
    })
  },
  save() {
    let obj = this.data.formData;
    let len = 0;
    for (let key in obj) {
      if (obj[key] == "") {
        wx.showToast({
          title: '信息未填写完整',
          icon: 'error'
        })
        return;
      }
      len++;
    }
    if (len < 8) {
      wx.showToast({
        title: '信息未填写完整',
        icon: 'error'
      })
      return;
    }
    // 调用云函数
    let temp = this.data.info
    if (this.data.editIndex == -1) temp.push(obj)
    else temp[this.data.editIndex] = obj
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "updateMaterial",
        params: {
          projId: this.data.projId,
          data: temp
        }
      }
    }).then(res => {
      console.log("updateMaterial", res)
      wx.showToast({
        title: '录入成功',
        icon: 'success'
      })
      this.setData({
        showEdit: false
      })
      this.getMaterial()
    })
  }
})