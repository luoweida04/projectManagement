// pages/sale/contactAndStop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // title: "stop",
    title: "contact",
    proj: Object,
    reason: "",
    contact: "",
    // records: [{
    //   content: "记录2的内容",
    //   time: "2023.5.15 23:44:21"
    // }, {
    //   content: "记录1的内容记录1的内容记录1的内容记录1的内容记录1的内容记录1的内容",
    //   time: "2023.5.15 23:44:21"
    // }, ],
    contentIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let tit = this.data.title
    wx.setNavigationBarTitle({
      title: tit=='stop'?'终止原因':'沟通客户',
    })
    console.log("沟通proj", JSON.parse(options.proj));
    let proj = JSON.parse(options.proj);
    proj.contacts.reverse()
    proj.contacts.forEach(item => {
      let time = item._updateTime
      time = time.slice(0,-3);
      time = time.replace(',', '');
      time = time.replace('/', '.'); // 有两个斜杠
      time = time.replace('/', '.');
      item._updateTime = time
    });
    this.setData({
      title: options.title,
      proj: proj
    })
  },
  inputReason(e){
    this.setData({
      reason: e.detail.value
    })
  },
  inputContact(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  stopCancel() {
    wx.navigateBack();
  },
  stopSave() {
    // 提交云函数
    if(this.data.reason=="")return;
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "end",
        params: { 
          projId: this.data.proj.projID,
          endMessage: this.data.reason
        }
      }
    }).then(res => {
      console.log("res", res)
      wx.navigateBack();
    })
  },
  contactSave() {
    if(this.data.contact=='')return;
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "contact",
        params: { 
          projId: this.data.proj.projID,
          msg: this.data.contact
        }
      }
    }).then(res => {
      console.log("res", res)
      wx.showLoading({
        title: 'Loading...',
      })
      wx.cloud.callFunction({
        name: "OrderServices",
        data: {
          action: "getProject",
          params: { 
            projId: this.data.proj.projID
          }
        }
      }).then(res => {
        console.log("getProject", res)
        this.setData({
          proj: res.result.data,
          contact: ""
        })
        wx.hideLoading()
      })
      // wx.navigateBack();
    })
  },
  showContent(e) {
    let i = e.currentTarget.dataset.index
    if(this.data.contentIndex==i) i=-1;
    this.setData({
      contentIndex: i
    })
  }
})