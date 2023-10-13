// pages/constructionDetail/constructionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    constructImageDate:[],   //现场施工图的日期
    projectName:[],//项目名
    projectIsCheck:[],//项目是否checked
    projectIsEmpty:1,
    constructTime:0,//工期
    constructorName:'施工人员名字',//施工人员名字
    ImageIsEmpty:1,
    pidIndex:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  previewPhotos(e){
    console.log(e.currentTarget.dataset.arrayindex)
    const that=this
    const arrayindex=e.currentTarget.dataset.arrayindex
    wx.navigateTo({
      url: '/pages/user/getDocument/getDocument?docName='+"constructSite"+'&docIndex='+that.data.constructImageDate[arrayindex].data.Date+'&pid='+that.data.pidIndex+'',
    })
  },
  onLoad(options) {
    console.log(options.pidIndex)
    this.setData({
      pidIndex:options.pidIndex
    })
    const processName=options.pid
    const projectId=getApp().globalData.projectId
    const that=this
    wx.setNavigationBarTitle({
      title: options.pid,
    })
    wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getProcedure",
        params:{
          projId: projectId
        },
        
        
      },
      success:function(res){
        console.log(res)
        const thisProcedure=res.result.data[options.pidIndex]
        console.log(options.pidIndex)
        //------------这里计算工期---------------
        let Day=(thisProcedure.endTime-thisProcedure.startTime)/86400000
        console.log(Day)
        that.setData({
          constructTime:Day
        })
        //------------这里结束计算工期------------

        //-------------这里开始处理现场施工图--------------
        const photos=thisProcedure.files
        console.log(thisProcedure)
        console.log(photos)
        
        if(photos==undefined&&photos.length!=0){
          
        }else{
        let flag=true
        let nowCnt=0
        for(var i =0;i<photos.length;i++){
          console.log(photos[i].data.Date)
          flag=true
          for(var j=0;j<that.data.constructImageDate.length;j++){
            
            if(photos[i].data.Date==that.data.constructImageDate[j].data.Date){
              flag=false
              break;
            }
          }
          if(flag){
            that.setData({
              ["constructImageDate["+nowCnt+"]"]:photos[i],
              ImageIsEmpty:0
            })
            nowCnt+=1
          }
        }
        
      }
        //--------------------------------------------------
        //console.log(res.result.data[0].procedure[options.pidIndex]);
        const workerArray=thisProcedure.worker
        //console.log(workerArray)
        let strStaff=""
        
        if(workerArray!=undefined&&workerArray.length>0){
          console.log(workerArray)
        for(var i =0;i<workerArray.length;i++){
          if(i!=0){
            strStaff+='、'
          }
        
        wx.cloud.callFunction({
          name:"UserServices",
          data:{
            action:"getUser",
            params: { phoneNumber: "123456"}
          },
          success:function(res){
            //console.log(res)
            strStaff+=res.result.data.userName
            that.setData({
              constructorName:strStaff      //因为是异步的，所以写在里面
            })
          }
        })
      }
      }
    
      }
  })

  console.log(projectId)
  console.log(processName)
  wx.cloud.callFunction({
    name:"OrderServices",
    data:{
      action:"getChecks",
      params: {
        projId: projectId, 
        procName: processName
      } 
    },
    success:function(res){
      console.log(res)
      const projectArray=res.result.data
      if(projectArray!=undefined&&projectArray.length>0){
        that.setData({
          projectIsEmpty:0
        })
      for (var i =0;i<projectArray.length;i++){
        that.setData({
          ["projectName["+i+"]"]:projectArray[i].name,
        })
        if(projectArray[i].done){
          that.setData({
            ["projectIsCheck["+i+"]"]:1
          })
        }else{
          that.setData({
            ["projectIsCheck["+i+"]"]:0
          })
        }
      }
    }
    }
  })
  /*wx.cloud.callFunction({
    name:"UserServices",
    data:{
      
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