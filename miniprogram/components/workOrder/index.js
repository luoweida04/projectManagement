// components/workOrder/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    proj: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    preMeasure(){
      if(this.data.proj.status=="已结束工单") return;
      console.log("preMeasure");
      wx.navigateTo({
        url: `/pages/sale/detail/index?titleId=0&projId=${this.data.proj.projID}`,
      })
      console.log(this.data.proj);
    },
    assignWork(){
      if(this.data.proj.status=="已结束工单") return;
      console.log("assignWork");
      wx.navigateTo({
        url: `/pages/sale/detail/index?titleId=1&projId=${this.data.proj.projID}`,
      })
    },
    cancelStop(){
      this.setData({
        showDialog: false
      })
    },
    confirmStop(){
      this.setData({
        showDialog: false
      })
      let proj = JSON.stringify(this.data.proj)
      wx.navigateTo({
        url: `/pages/sale/contactAndStop/index?title=stop&proj=${proj}`,
      })
    },
    stop(){
      if(this.data.proj.status=="已结束工单") return;
      this.setData({
        showDialog: true
      })
    },
    goMaterial(){
      if(this.data.proj.status=="已结束工单") return;
      let projId = this.data.proj.projID
      wx.navigateTo({
        url: `/pages/sale/material/index?projId=${projId}`,
      })
    },
    goContact(){
      if(this.data.proj.status=="已结束工单") return;
      let proj = JSON.stringify(this.data.proj)
      wx.navigateTo({
        url: `/pages/sale/contactAndStop/index?title=contact&proj=${proj}`,
      })
    }
  }
})
