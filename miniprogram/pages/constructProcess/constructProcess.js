// pages/warrantySelect/warrantySelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameToArrayMapValue:0,
    nameToArrayMap:{},
    nameHashMap:{
      '主体打拆':0,
      '基层检查':1,
      '砌墙':2,
      '抹灰':3,
      '配电安装':4,
      '给水排水工程':5,
      '信息化布线工程':6,
      '封埋线管':7,
      '大门安装':8,
      '窗户安装':9,
      '防水工程':10,
      '包管道':11,
      '吊顶及窗帘盒':12,
      '地砖铺贴':13,
      '面层腻子':14,
      '刷涂底漆':15,
      '房间门安装':16,
      '插座安装':17,
      '刷涂面漆':18,
      '灯具安装':19,
      '卫浴安装':20,
      '木地板安装':21,
      '开荒保洁':22,
      '家具家电安装':23,
      '其他':24,
    },
    flesh:0,
    availableArray:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    buttonText:['主体打拆','基层检查','砌墙',"抹灰","配电安装","给水排水工程","信息化布线工程","封埋线管","大门安装","窗户安装","防水工程","包管道","吊顶及窗帘盒","地砖铺贴","面层腻子","刷涂底漆","房间门安装","插座安装","刷涂面漆","灯具安装","卫浴安装","木地板安装","开荒保洁","家具家电安装","其他"],
    buttonName:['mainDestroy','inspire','buildWall','plasterer',"powerDistribution",'waterSupply',"internetWire","pipeLaying","gateInstall","windowInstall","waterProof","pipework","ceiling","tilework","putty","primer","roomDoor","outlet","topcoat","lightInstall","bathroom","woodFloor","cleaning","furniture","others"]
  },

  
  mainDestroy(event){
    console.log(event.currentTarget.dataset)
    const title=this.data.buttonText[event.currentTarget.dataset
    ['idd']]
    console.log(title)
    wx.navigateTo({
      url: '/pages/constructionDetail/constructionDetail?pid='+title+'&pidIndex='+this.data.nameToArrayMap[title]+''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "施工过程",
    })
    const that=this;
    var procedure;
    const projectId=getApp().globalData.projectId
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProject",
        params: {
          projId: projectId
        }
      },success:function(res){
        console.log(res);
        procedure=res.result.data.procedure
        console.log(procedure)
        for(var i=0;i<procedure.length;i++){
          let num=that.data.nameHashMap[procedure[i]["name"]]
          //console.log(num)
          that.setData({
            ["availableArray["+num+"]"]:1 //这个是要解决的问题！！！
          })
          that.data.nameToArrayMap[procedure[i]["name"]]=i
        }
      },
      fail:console.error
        
      
    
    })
    /*wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getProject",
        params:{
          params: {projId: 19}
        }
      },
      success:function(res){
        console.log(res);
        procedure=res.result.data.procedure
        console.log(procedure)
        for(var i=0;i<procedure.length;i++){
          let num=that.data.nameHashMap[procedure[i]["name"]]
          //console.log(num)
          that.setData({
            ["availableArray["+num+"]"]:1 //这个是要解决的问题！！！
          })
          that.data.nameToArrayMap[procedure[i]["name"]]=i
        }
      },
      fail:console.error
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