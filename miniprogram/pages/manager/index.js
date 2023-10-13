// pages/manager/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId:16,
    procedure:[],
    edit: false,
    index:0,
    boxs: [
      {
        name: "主体打拆",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_01@3x.png"
      },
      {
        name: "基层检查",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_02@3x.png"
      },
      {
        name: "砌墙",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_03@3x.png"
      },
      {
        name: "抹灰",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_04@3x.png"
      },
      {
        name: "配电安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_05@3x.png"
      },
      {
        name: "给水排水工程",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_06@3x.png"
      },
      {
        name: "信息化布线工程",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_07@3x.png"
      },
      {
        name: "封埋线管",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_08@3x.png"
      },
      {
        name: "大门安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_09@3x.png"
      },
      {
        name: "窗户安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_10@3x.png"
      },
      {
        name: "防水工程",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_11@3x.png"
      },
      {
        name: "包管道",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_12@3x.png"
      },
      {
        name: "吊顶及窗帘盒",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_13@3x.png"
      },
      {
        name: "地砖铺贴",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_14@3x.png"
      },
      {
        name: "面层腻子",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_15@3x.png"
      },
      {
        name: "刷涂底漆",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_16@3x.png"
      },
      {
        name: "房间门安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_17@3x.png"
      },
      {
        name: "插座安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_18@3x.png"
      },
      {
        name: "刷涂面漆",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_19@3x.png"
      },
      {
        name: "灯具安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_20@3x.png"
      },
      {
        name: "卫浴安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_21@3x.png"
      },
      {
        name: "木地板安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_22@3x.png"
      },
      {
        name: "开荒保洁",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_23@3x.png"
      },
      {
        name: "家具家电安装",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_24@3x.png"
      },
      {
        name: "其他",
        url: "cloud://cloud1-4gfnhjpdbdddb9e0.636c-cloud1-4gfnhjpdbdddb9e0-1318704896/Process_25@3x.png"
      },
    ],
    workers: [], // 用于选择器，只放工人名字
    workerArr: [],
    selWorker: "",
    selWorkerIndex: 0,
    workerName: "", // 真正的
    workerIndex: [], // 真正的, 提交
    projects: ['项目A','项目B','项目C','项目D'],
    projectsNow: [
      // {
      //   name: '项目1',
      //   done: 'false'
      // }
    ],
    selProject: "",
    showDatePicker: 0, // 1开始，2结束
    showPicker: 0, // 1施工人员,2质检项目
    datePickerTime: Number, // 3个时间戳
    startTimestamp:Number,
    endTimestamp:Number,
    startTime:"", // 格式化，提交
    endTime: "", // 格式化，提交
    minDate: Number
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projId: getApp().globalData.projectId
    })
    wx.cloud.callFunction({
      name: "UserServices",
      data: {
        action: "getUsers",
        params: {
          userType: "worker"
        }
      }
    }).then(res => {
      console.log(res.result.data)
      let arr = res.result.data
      let cols=[]
      arr.forEach(item => {
        cols.push(item.userName)
      });
      this.setData({
        workerArr: res.result.data,
        workers: cols
      })
    })
    this.getProcedure()
  },
  getProcedure(){
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "getProcedure",
        params: {
          projId: this.data.projId,
        }
      }
    }).then(res => {
      console.log("getProcedure",res)
      this.setData({
        procedure: res.result.data
      })
    })
  },
  formater(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let temp = year + '.' + (month < 10 ? '0' + month : month) + '.' + (day < 10 ? '0' + day : day);
    return temp;
  },
  goEdit(e){
    console.log(e);
    let i = e.currentTarget.dataset.i
    let temp = this.data.boxs
    wx.setNavigationBarTitle({
      title: temp[i].name,
    })
    this.setData({
      edit: true,
      index: i,
      workerIndex: [],
      workerName: "",
      startTime:"",
      endTime: "",
      projectsNow: [],
    })
    this.data.procedure.forEach(item => {
      if(item.name == this.data.boxs[i].name) {
        console.log("finded");
        let indexs = [];
        let workerNameTemp = "";
        item.worker.forEach(it =>{
          this.data.workerArr.forEach((it2,i) => {
            if(it == it2.phoneNumber) {
              indexs.push(i)
              if(workerNameTemp!="")workerNameTemp += ', ';
              workerNameTemp += it2.userName;
              return
            }
          })
        })
        console.log('indexs', indexs);
        console.log('workerName', workerNameTemp);
        this.setData({
          projectsNow: item.check,
          startTime: this.formater(item.startTime),
          startTimestamp: item.startTime,
          endTime: this.formater(item.endTime),
          endTimestamp: item.endTime,
          workerName: workerNameTemp,
          workerIndex: indexs,
          minDate: item.startTime
        })
      }
    });
  },
  selStartTime(){
    this.setData({
      showDatePicker: 1
    })
  },
  selEndTime(){
    this.setData({
      showDatePicker: 2
    })
  },
  onInputDatePicker(e){
    console.log(e);
    this.setData({
      datePickerTime: e.detail
    })
  },
  cancelDate(){
    this.setData({
      showDatePicker: 0
    })
  },
  comfirmDate(){
    console.log("this", this.data.datePickerTime, this.data.endTimestamp);
    if(this.data.showDatePicker == 1){
      if(this.data.endTimestamp!=-1 && this.data.datePickerTime > this.data.endTimestamp) {
        wx.showToast({
          title: '开始晚于结束',
          icon: 'error'
        })
        return;
      }
      this.setData({
        startTimestamp: this.data.datePickerTime,
        startTime: this.formater(this.data.datePickerTime),
        minDate: this.data.datePickerTime
      })
    }else {
      if(this.data.startTimestamp!=-1 && this.data.datePickerTime < this.data.startTimestamp) {
        wx.showToast({
          title: '开始晚于结束',
          icon: 'error'
        })
        return;
      }
      this.setData({
        endTimestamp: this.data.datePickerTime,
        endTime: this.formater(this.data.datePickerTime)
      })
    }
    this.setData({
      showDatePicker: 0
    })
  },
  selectWorker(){
    this.setData({
      showPicker: 1,
      selWorker: this.data.workers[0],
      selWorkerIndex: 0
    })
  },
  onChangePicker(e){
    console.log(e);
    if(this.data.showPicker==1){
      this.setData({
        selWorker: e.detail.value,
        selWorkerIndex: e.detail.index
      })
    }else {
      this.setData({
        selProject: e.detail.value
      })
    }
  },
  addProject(){
    this.setData({
      showPicker: 2,
      selProject: this.data.projects[0]
    })
  },
  cancel(){
    if(this.data.showDatePicker==0 && this.data.showPicker==0){
      this.setData({
        edit: false
      })
      wx.setNavigationBarTitle({
        title: '施工过程',
      })
      this.getProcedure();
      return;
    }
    this.setData({
      showPicker: 0,
      showDatePicker: 0,
    })
  },
  affirm(){
    if(this.data.showPicker==1){
      let tempIndex = this.data.workerIndex
      for(let i=0;i<tempIndex.length;i++){ // 判重
        if(this.data.selWorkerIndex==tempIndex[i]) {
          this.setData({
            showPicker: 0
          })
          return;
        }
      }
      tempIndex.push(this.data.selWorkerIndex)
      let tempName = this.data.workerName
      if(tempName!='') tempName+=', '
      tempName+=this.data.selWorker
      this.setData({
        workerName: tempName,
        workerIndex: tempIndex,
        showPicker: 0
      })
      return;
    } else if(this.data.showPicker==2) {
      let temp = this.data.projectsNow
      if(temp.includes(this.data.selProject)==false) temp.push({
        name: this.data.selProject,
        done: false
      });
      this.setData({
        projectsNow: temp,
        showPicker: 0
      })
      console.log(this.data.projectsNow, this.data.selProject);
      return;
    }
    console.log(this.data.workerName, this.data.workerIndex);
    if(this.data.startTime==0 || this.data.endTime==0 || this.data.workerName=='') return;
    let worker=[];
    let that = this
    this.data.workerIndex.forEach(i => {
      worker.push(that.data.workerArr[i].phoneNumber)
    });
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "updateProcedure",
        params: { 
          projId: this.data.projId,
          data: {
            name: this.data.boxs[this.data.index].name,
            url: this.data.boxs[this.data.index].url, 
            worker: worker,
            startTime: this.data.startTimestamp,
            endTime: this.data.endTimestamp,
            // check: this.data.projectsNow
          }
        }
      }
    }).then(res => {
      console.log("res", res)
      this.setData({
        edit: false,
        startTimestamp: -1,
        endTimestamp: -1,
        minDate: 0
      })
      that.updateChecks()  // 更新checks
      this.getProcedure()
    })
  },
  doneBtn(e){
    let temp = this.data.projectsNow
    temp[e.currentTarget.dataset.i].done = !temp[e.currentTarget.dataset.i].done
    this.setData({
      projectsNow: temp
    })
  },
  updateChecks(check){
    wx.cloud.callFunction({
      name: "OrderServices",
      data: {
        action: "updateChecks",
        params: { 
          projId: this.data.projId,
          procName: this.data.boxs[this.data.index].name,
          checks: this.data.projectsNow
        }
      }
    }).then(res => {
      console.log("updateCheck", res)
    })
  }
})