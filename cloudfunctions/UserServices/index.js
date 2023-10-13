// 云函数入口文件
const cloud = require('wx-server-sdk')
const service = require('./makeService.js')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userDB = db.collection('users')
const _ = db.command

// 云函数入口函数
exports.main = service.make(cloud, {
  // 登录 应该用不到
  login: async () => {
    const users = (await userDB.where({
      openId: cloud.getWXContext().OPENID
    }).get()).data
    let result = {
      requireRegister: users.length === 0
    }
    if (users) {
      result.detail = users
    }
    return result
  },
  // 注册 params: {data: {userName: "", userType: "", phoneNumber: ""}}
  register: async (params) => {
    const { data } = params

    let template = {
      "userName": data.userName || "",
      "userType": data.userType || [],
      "openId": cloud.getWXContext().OPENID,
      "phoneNumber": data.phoneNumber || "",
      "isManager": data.userType.indexOf("manager") != -1,
      "isSales": data.userType.indexOf("sales") != -1,
      "isCustomer": data.userType.indexOf("customer") != -1,
      "isDesigner": data.userType.indexOf("designer") != -1,
      "isBudgeter": data.userType.indexOf("budgeter") != -1,
      "isWorker": data.userType.indexOf("worker") != -1,
      "_createTime": new Date(),
      "_updateTime": new Date()
    }

    return await userDB.add({ data: template })
  },
  // 更新用户 params: {phoneNumber: "xxx", data: {userName:"", "userType": "", "phoneNumber": ""}}
  update: async (params) => {
    const { phoneNumber, data } = params
    if(!phoneNumber){
      throw new Error('phoneNumber不能为空')
    }

    const _dbres = await userDB.where({"phoneNumber": phoneNumber}).get()
    const _dat = _dbres && _dbres.data
    const user = _dat && _dat[0]

    let template = {
      "userName": data.userName || user.userName,
      "userType": data.userType || user.userType,
      "openId": user.openId,
      "phoneNumber": data.phoneNumber || user.phoneNumber,
      "isManager": (data.userType && data.userType.indexOf("manager") != -1) || user.isManager,
      "isSales": (data.userType && data.userType.indexOf("sales") != -1) || user.isSales,
      "isCustomer": (data.userType && data.userType.indexOf("customer") != -1) || user.isCustomer,
      "isDesigner": (data.userType && data.userType.indexOf("designer") != -1) || user.isDesigner,
      "isBudgeter": (data.userType && data.userType.indexOf("budgeter") != -1) || user.isBudgeter,
      "isWorker": (data.userType && data.userType.indexOf("worker") != -1) || user.isWorker,
      "_createTime": user._createTime,
      "_updateTime": new Date()
    }
    
    return await userDB.doc(user._id).update({ data: template })
  },
  // 按类型获取用户， params: {userType: "xxx"}
  getUsers: async (params) => {
    const { userType } = params

    const _dbres = await userDB.where({
      "userType": userType
    }).get()
    const _dat = _dbres && _dbres.data
    return _dat || []
  },
  // 按phoenNumber获取单个用户 params: { phoneNumber: "xxx" }
  getUser: async (params) => {
    const { phoneNumber } = params

    const _dbres = await userDB.where({
      "phoneNumber": phoneNumber
    }).get()
    const _dat = _dbres && _dbres.data
    const _res = _dat && _dat[0]
    return _res
  }
})