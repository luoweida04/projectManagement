// pages/sale/preMeasure/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId: "",
    proj: Object,
    titleId: "0",
    columns1: [],
    columns2: [],
    columns3: [],
    designerArr: [],
    budgeterArr: [],
    managerArr: [],
    // managerArr结构如下：
    //     "userName":
    //       "userType": []
    //       "openId":           这个不用管
    //       "phoneNumber":
    //       "_createTime":     这个不用管
    //       "_updateTime":     这个不用管
    // 备注：userType是数组是因为一个用户可以有多个角色
    showPicker1: false,
    showPicker2: false,
    showPicker3: false,
    pickerValue: "", // 共用一个就可以了
    pickerIndex: 0, // 共用一个就可以了
    designer: "",
    preMeasurer: "",
    manager: "",
    designerIndex: "",
    preMeasurerIndex: "",
    managerIndex: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading()
    let tit = options.titleId
    wx.setNavigationBarTitle({
      title: tit == '0' ? '预约量尺' : '安排施工',
    })
    console.log('opt', options);
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProject",
        params: {
          projId: options.projId
        }
      }
    }).then(res => {
      console.log('proj', res)
      this.setData({
        titleId: options.titleId,
        projId: options.projId,
        proj: res.result.data
      })
    }).then(res => {
      this.getDesigner()
      this.getBudgeter()
      this.getManager()
      setTimeout(() => {
        wx.hideLoading()
      }, 200);
    })
  },
  getDesigner() {
    wx.cloud.callFunction({
      name: "UserServices",
      data: {
        action: "getUsers",
        params: {
          userType: "designer"
        }
      }
    }).then(res => {
      console.log(res.result.data)
      let arr = res.result.data
      let cols = []
      let tempD, tempI;
      for (let i = 0; i < arr.length; i++) {
        cols.push(arr[i].userName)
        if (arr[i].phoneNumber == this.data.proj.designer) {
          tempD = arr[i].userName
          tempI = i
        }
      }
      this.setData({
        designerArr: res.result.data,
        columns1: cols,
        designerIndex: tempI,
        designer: tempD
      })
    })
  },
  getBudgeter() {
    wx.cloud.callFunction({
      name: "UserServices",
      data: {
        action: "getUsers",
        params: {
          userType: "budgeter"
        }
      }
    }).then(res => {
      console.log(res.result.data)
      let arr = res.result.data
      let cols = []
      let tempB, tempI;
      for (let i = 0; i < arr.length; i++) {
        cols.push(arr[i].userName)
        if (arr[i].phoneNumber == this.data.proj.budgeter) {
          tempB = arr[i].userName
          tempI = i
        }
      }
      this.setData({
        budgeterArr: res.result.data,
        columns2: cols,
        preMeasurer: tempB,
        preMeasurerIndex: tempI
      })
    })
  },
  getManager() {
    wx.cloud.callFunction({
      name: "UserServices",
      data: {
        action: "getUsers",
        params: {
          userType: "manager"
        }
      }
    }).then(res => {
      console.log(res.result.data)
      let arr = res.result.data
      let cols = []
      let tempM, tempI;
      for (let i = 0; i < arr.length; i++) {
        cols.push(arr[i].userName)
        if (arr[i].phoneNumber == this.data.proj.manager) {
          tempM = arr[i].userName
          tempI = i
        }
      }
      this.setData({
        managerArr: res.result.data,
        columns3: cols,
        manager: tempM,
        managerIndex: tempI
      })
    })
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      pickerValue: value,
      pickerIndex: index
    })
  },
  select1() {
    console.log("select1");
    this.setData({
      showPicker1: true,
      pickerValue: this.data.columns1[0],
      pickerIndex: 0
    })
  },
  select2() {
    console.log("select2");
    this.setData({
      showPicker2: true,
      pickerValue: this.data.columns2[0],
      pickerIndex: 0
    })
  },
  select3() {
    console.log("select3");
    this.setData({
      showPicker3: true,
      pickerValue: this.data.columns3[0],
      pickerIndex: 0
    })
  },
  cancel() {
    if (this.data.showPicker1 || this.data.showPicker2 || this.data.showPicker3) {
      this.setData({
        showPicker1: false,
        showPicker2: false,
        showPicker3: false
      })
      return;
    }
    wx.navigateBack();
  },
  affirm() {
    console.log(this.data.pickerIndex, this.data.pickerValue);
    if (this.data.showPicker1) {
      this.setData({
        showPicker1: false,
        designer: this.data.pickerValue,
        designerIndex: this.data.pickerIndex
      })
      return;
    } else if (this.data.showPicker2) {
      this.setData({
        showPicker2: false,
        preMeasurer: this.data.pickerValue,
        preMeasurerIndex: this.data.pickerIndex
      })
      return;
    } else if (this.data.showPicker3) {
      this.setData({
        showPicker3: false,
        manager: this.data.pickerValue,
        managerIndex: this.data.pickerIndex
      })
      return;
    }
    // 云函数提交
    let temp = this.data.proj
    if (this.data.titleId == '0') {
      if (this.data.designer == '' || this.data.preMeasurer == '') return;
      temp.designer = this.data.designerArr[this.data.designerIndex].phoneNumber
      temp.budgeter = this.data.budgeterArr[this.data.preMeasurerIndex].phoneNumber
      console.log("temp", temp);
      wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "update",
          params: {
            data: temp
          }
        }
      }).then(res => {
        console.log(res)
        if (this.data.proj.status == "施工中") wx.navigateBack();
        else {
          wx.cloud.callFunction({
            name: "OrderServices",
            data: {
              action: "updateStatus",
              params: {
                projId: this.data.projId,
                status: "方案预算沟通"
              }
            }
          }).then(res => {
            console.log("updateStatus0", res)
            wx.navigateBack();
          })
        }
      })
    } else {
      if (this.data.manager == '') return;
      temp.manager = this.data.managerArr[this.data.managerIndex].phoneNumber
      console.log("temp", temp);
      wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "update",
          params: {
            data: temp
          }
        }
      }).then(res => {
        console.log(res)
        wx.cloud.callFunction({
          name: "OrderServices",
          data: {
            action: "updateStatus",
            params: {
              projId: this.data.projId,
              status: "施工中"
            }
          }
        }).then(res => {
          console.log("updateStatus1", res)
          wx.navigateBack();
        })
      })
    }
  }
})