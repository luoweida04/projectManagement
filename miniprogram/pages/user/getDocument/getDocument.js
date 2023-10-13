// pages/user/getDocument/getDocument.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileArray:[],
    mode:"document",
    constructSiteFlag:false,
    webArray:[],
    website:[],
    mediaTypeArray:[],
  },
  previewTable(e){
    const that=this
    console.log(e.currentTarget.dataset.fileindex)
    console.log(that.data.fileArray)
    const urlArray=that.data.fileArray[e.currentTarget.dataset.fileindex]
    console.log(urlArray)
    if(!that.data.constructSiteFlag){
      if(that.data.mode=="document"){
    wx.showToast({
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
    })
  }else if(that.data.mode=="imageAndWeb"){
    var fID=urlArray.fileId
    
    if(that.data.webArray[e.currentTarget.dataset.fileindex]){
      wx.navigateTo({
        url: '/pages/user/openWebSite/openWebSite?web='+fID+'',
      })
      /*wx.setClipboardData({
        data: fID,
        success:function(res){
          wx.showToast({
            title: '已复制链接，请在浏览器中打开查看',
            icon:"none"
          })
          
        },
        fail:function(res){
          console.log("失败")
        }
      })*/
    }else{
      wx.previewImage({
        urls: [fID],
      })
    }
  }
  }else{        //施工过程
    wx.previewMedia({
      //sources: [urlArray.fileId],
      sources: [{
        url:urlArray.fileId,
        type:urlArray.data.type
      }],
      
    })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const requestType=options.docName
    const projectId=getApp().globalData.projectId
    const that=this
    var photosArray=[]
    wx.cloud.callFunction({
      name:"OrderServices",
      data:{
        action:"getProject",
        params:{
          projId:projectId
        }
      },
      success:function(res){
        console.log(res)
        console.log(res.result.data.photos)
       //console.log(res.result.data.procedure)
        photosArray=res.result.data.photos
        if(requestType=="surface"){//平面图相关
          wx.setNavigationBarTitle({
            title: "平面图文件",
          })
          
          that.setData({
            fileArray:photosArray.surface
          })
        }else if(requestType=="effect"){
          wx.setNavigationBarTitle({
            title: "效果图文件",
          })
          
          that.setData({
            fileArray:photosArray.effect,
            mode:"imageAndWeb"
          })
          let nowCnt=that.data.fileArray.length
          for(var i =0;i<photosArray.effectvr.length;i++){
            that.setData({
              ["fileArray["+nowCnt+"]"]:photosArray.effectvr[i]
            })
            nowCnt++
          }
          for(var i =0;i<photosArray.effect.length;i++){
            if(photosArray.effect[i].fileId[0]=="c"||photosArray.effect[i].fileId[0]=="C"){
              that.setData({
                ["webArray["+i+"]"]:0,
                ["website["+i+"]"]:"notAWebsite"
              })
            }else{
              that.setData({
                ["webArray["+i+"]"]:1,
                ["website["+i+"]"]:photosArray.effect[i].fileId
              })
            }
          }
        }else if(requestType=="construct"){
          wx.setNavigationBarTitle({
            title: "施工图文件",
          })
          that.setData({
            fileArray:photosArray.construct
          })
        }else if(requestType=="constructSite" ){
          
          const theProcedure=res.result.data.procedure[options.pid]
          console.log(theProcedure)
          wx.setNavigationBarTitle({
            title: theProcedure.name+"文件",
          })
          let nowCnt=0
          for(var i =0;i<theProcedure.files.length;i++){
            console.log(theProcedure.files[i].data.Date+"---"+options.docIndex)
            if(theProcedure.files[i].data.Date==options.docIndex){
              that.setData({
              ["fileArray["+nowCnt+"]"]:theProcedure.files[i],
              constructSiteFlag:true,
              ["mediaTypeArray["+nowCnt+"]"]:theProcedure.files[i].type
              })
              nowCnt+=1
            }
          }
          
          /*for(var i =0;i<theProcedure.files.length;i++){
            theProcedure.files[i]
            that.setData({
              ["mediaTypeArray["+i+"]"]:theProcedure.files[i].type
            })
          }*/
        }else if(requestType=="budgetFile" ){
          wx.setNavigationBarTitle({
            title: "质保表文件",
          })
          wx.cloud.callFunction({
            name:"OrderServices",
            data:{
              action:"getMaterial",
              params:{
                projId:projectId
              }
            },
            success:function(res){
              console.log(res.result.data[options.mid].files)
              that.setData({
                fileArray:res.result.data[options.mid].files
              })
            }
          })
        }
      }
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