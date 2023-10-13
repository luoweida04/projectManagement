// 云函数入口文件
const cloud = require('wx-server-sdk')
const service = require('./makeService.js')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userDB = db.collection('users')
const projDB = db.collection('projects')
const checkDB = db.collection('checks')
const _ = db.command
const $ = db.command.aggregate

const Status = Object.freeze({
  None: "-",
  Init: "立项中",
  Communicate: "方案预算沟通",
  Construct: "施工中",
  End: "已结束工单"
})

// 云函数入口函数
exports.main = service.make(cloud, {
  // 创建工单 params: {data:{}}
  create: async (params) => {
    let { phoneNumber, data } = params
    
    const _get = await db.collection('configs').doc('project_counts').get()
    const _dat = _get && _get.data
    const count = _dat && _dat.total
    if(!count){
      throw new Error('数据库访问错误')
    }
    const _dbres = await userDB.where({ 'phoneNumber': phoneNumber }).get()
    const __dat = _dbres && _dbres.data
    const user = __dat && __dat[0]
    if(!user){
      throw new Error('用户不存在')
    }
    if(user.userType.indexOf("sales") == -1) {
      throw new Error('只有销售可以创建工单')
    }
    await db.collection('configs').doc('project_counts').update(
      {'data': {'total': _.inc(1)}}
    )
    const projData = {
        "projID": count,
        "name": data.name || "",
        "price": data.price || "",
        "customer": data.customer || "",
        "address": data.address || "",
        "area": data.area || 0,
        "designer": data.designer || "",
        "sales": user.phoneNumber,
        "budgeter": data.budgeter || "",
        "manager": data.manager || "",
        "status": Status.None,
        "photos": {
          'surface': [],
          'effect': [],
          'vr': []
        },
        "budget": [], // 预算表文件
        // 施工过程，包含每个工序的施工人员，工期，质检项目
        // 其中每个元素都是一个json,格式为：
        // {name: "xxx施工过程名称", "worker": [], "time": xxx, "check": [{"name": "xxx质检项目", "done": false}]}
        // 其中worker字段是必须要有的，其中元素为施工工人的手机号码
        "procedure": [], 
        "material": {}, //材料、质保信息
        "contacts": [], // 联系客户的消息
        "projOwner": cloud.getWXContext().OPENID,
    }

    await projDB.add({
      "data": projData
    }).catch(err=>{
      throw new Error("数据库访问错误")
    })
    return count
  },
  // 更新整个工单 params: {projId: 123, data:{}}
  update: async (params) => {
    const { data } = params

    id = data && data._id
    if(!id){
      throw new Error('请传入一个完整的工单（使用get获取）')
    }
    delete data._id
    return await projDB.doc(id).set({
      "data": data
    })
  },
  // 结束工单 params: {projId: 123, endMsg: ""}
  end: async (params) => {
    const { projId, endMsg} = params

    return await projDB.where({
      "projID": parseInt(projId)
    }).update({ "data": {
      "status": Status.End,
      "endMessage": endMsg,
    }})
  },
  // 添加预算表文件 params: { projId: "123", files: [{"fileName": "文件名1", "fileId": "文件id1"}, ...] }
  // files是对象数组，其中元素为{"fileName": "文件名", "fileId": "文件id"}
  // 返回成功添加的文件的列表
  addBudget: async (params) => {
    const { projId, files } = params

    const _db_proj = await projDB.where({
      "projID": parseInt(projId)
    })
    let added_files = []
    for(const _file of files){
      if((await _db_proj.update({ "data": {
        "budget": _.push(_file)
      }})).stats.updated === 1){
        added_files.push(_file)
      }
    }
    return added_files
  },
  // 删除预算表文件 params: { projId: "123", files: ["文件id1", "文件id2", "文件id3", ...] }
  // 返回成功删除的文件的列表
  removeBudget: async (params) => {
    const { projId, files } = params

    try{
      await cloud.deleteFile({
        fileList: files
      })
    } catch(err){
      console.log(err)
    }
    let _deleted_files = []
    const _db_proj = await projDB.where({
      "projID": parseInt(projId)
    })
    for(const _file of files){
      if((await _db_proj.update({ "data": {
        "budget": _.pull({
          "fileId": _.eq(_file)
        })
      }})).stats.updated === 1){
        _deleted_files.push(_file)
      }
    }

    return _deleted_files
  },
  // 更新工单施工过程
  // params: {projId: 123, data: {}}
  // data内容前端定，不能轻易改变
  updateProcedure: async (params) => {
    const { projId, data } = params

    const _dbres = await projDB.where({
      "projID": parseInt(projId)
    }).get()
    const _dat = _dbres && _dbres.data
    const _arr = _dat && _dat[0]
    const _procd = _arr && _arr.procedure
    let index = -1
    for(var _pprocd in _procd){
      if(_procd[_pprocd].name === data.name){
        index = _pprocd
      }
    }
    if(index === -1) {
      // 添加
      return await projDB.where({
        "projID": parseInt(projId),
      }).update({ "data": {
        "procedure": _.push(data)
      }})
    } else {
      // 更新
      return await projDB.where({
      "projID": parseInt(projId),
      }).update({ "data": {
        [`procedure.${index}`]: data
      }})
    }
  },
  getProcedure: async (params) => {
    const {projId} = params

    const _dbres = await projDB.where({
      "projID": parseInt(projId)
    }).get()
    const _dat = _dbres && _dbres.data
    const _arr = _dat && _dat[0]
    const _res = _arr && _arr.procedure
    
    if(_res === undefined || _res.length === 0){
      return []
    } else {
      // 联表查询质检项目
      const checks = (await checkDB.aggregate().match({
        'projId': projId
      }).group({
        '_id': '$procName',
        'checks': $.push({name: '$name', done: '$done'}),
      }).end()).list
      // 联表查询施工图
      const files = (await db.collection('worker-photos').aggregate().match({
        "projId": parseInt(projId)
      }).group({
        '_id': '$procName',
        'files': $.push({ fileId: '$fileId', fileName: '$fileName', data: '$data' })
      }).end()).list
      console.log(checks)
      console.log(files)
      for(var _proc of _res){
        const _tmp = checks.find(x => x._id === _proc.name)
        const _files = files.find(x => x._id === _proc.name)
        console.log(_proc.name)
        console.log(_tmp)
        console.log(_files)
        _proc.check = (_tmp && _tmp.checks) || []
        _proc.files = (_files && _files.files) || []
      }
      return _res
    }
  },
  removeProcedure: async (params) => {
    const {projId, name} = params

    const _dbq = await projDB.where({
      "projID": parseInt(projId)
    })
    const _dbres = await _dbq.get()
    const _dat = _dbres && _dbres.data
    const _arr = _dat && _dat[0]
    const _procd = _arr && _arr.procedure
    let index = -1
    console.log(_procd)
    console.log(_dbres)
    for(var _pprocd in _procd){
      if(_procd[_pprocd].name === name){
        index = _pprocd
      }
    }

    if(index === -1){
      throw new Error('找不到此施工工序')
    } else {
      await checkDB.where({
        "projId": parseInt(projId),
        "procName": name
      }).remove()
      const dbres = await db.collection('worker-photos').where({
        "projId": parseInt(projId),
        "procName": name
      })
      const files = (await dbres.get()).data.map(x => x.fileId)
      await dbres.remove()
      try{
        await cloud.deleteFile({
          "fileList": files
        })
      }catch(err){
        console.log(err)
      }
      const _del = _procd[index]
      return await _dbq.update({"data": {
        "procedure": _.pull(_del)
      }})
    }
  },
  // 添加质检项目
  // params: { projId: 123, procName: "施工工序名称", name: "质检项目名称", done: bool }
  // 给指定的工单的施工工序添加一个质检项目
  addChecks: async (params) => {
    const { projId, procName, name, done } = params
    return await checkDB.add({ "data": {
      'projId': parseInt(projId),
      'procName': procName,
      'name': name,
      'done': done
    }})
  },
  // 删除质检项目
  // params: { projId: 123, procName: "施工工序名称", name: "质检项目名称" }
  // 给指定的工单的施工工序删除一个质检项目
  removeChecks: async (params) => {
    const { projId, procName, name } = params
    return await checkDB.where({
      'projId': parseInt(projId),
      'procName': procName,
      'name': name
    }).remove()
  },
  // 更新质检项目
  // params: { projId: 123, procName: "施工工序名称", name: "质检项目名称", done: bool }
  // 更新指定工单的指定施工工序的指定质检项目
  updateChecks: async (params) => {
    const { projId, procName, checks } = params
    let updated = []
    for(const _check of checks){
      if((await checkDB.where({
        'projId': parseInt(projId),
        'procName': procName,
        'name': _check.name
      }).update({"data": {
        'done': _check.done
      }})).stats.updated === 1){
        updated.push(_check)
      }
    }
    return { updated }
  },
  // 获取质检项目
  // params: { projId: 123, procName: "施工工序名称"}
  // 按照工单号和施工工序名称，返回该施工工序的质检项目
  // 返回值为对象数组，元素格式为： { name: "质检项目名称", done: bool }
  getChecks: async (params) => {
    const { projId, procName } = params

    const _res = (await checkDB.aggregate().match({
      'projId': parseInt(projId)
    }).group({
      '_id': '$procName',
      'checks': $.push({name: '$name', done: '$done'}),
    }).end()).list.find(x => x._id === procName)
    return (_res && _res.checks) || []
  },
  // 添加施工图
  addConstructPhotos: async (params) => {
    const { projId, procName, fileId, fileName, data } = params
    return await db.collection('worker-photos').add({ "data": {
      "projId": parseInt(projId),
      procName,
      fileId,
      fileName,
      data
    }})
  },
  // 删除施工图
  removeConstructPhotos: async (params) => {
    const { projId, procName, fileId } = params
    const dbres = await db.collection('worker-photos').where({
      "projId": parseInt(projId),
      procName,
      fileId
    })
    try{
      const files = (await dbres.get()).data.map(x => x.fileId)
      console.log(files)
      if(files.length !== 0){
        await cloud.deleteFile({
          "fileList": files
        })
      }
    }catch(err){
      console.log(err)
    }
    return await dbres.remove()
  },
  // 获取施工图
  getConstructPhotos: async (params) => {
    const { projId, procName } = params
    const _res = (await db.collection('worker-photos').where({
      "projId": parseInt(projId),
      procName
    }).get()).data
    console.log(_res)
    return _res || []
  },
  // 更新工单主材信息（材料质保）
  // params: {projId: 123, data: {}}
  // data内容前端定，不能轻易改变
  // 上传的文件id也放data里
  updateMaterial: async (params) => {
    const { projId, data} = params

    try{
      let _del_files = []
      let _old_files = []
      let _new_files = []
      for(const _mat of data.material){
        for(const _file_arr of _mat.files){
          for(const _file of _file_arr){
            _new_files.push(_file.fileId)
          }
        }
      }
      const _old_obj = (await projDB.where({projID: parseInt(projId)}).get()).data[0]
      for(const _mat of _old_obj.material){
        for(const _file_arr of _mat.files){
          for(const _file of _file_arr){
            _old_files.push(_file.fileId)
          }
        }
      }
      _del_files = _old_files.filter(x => !_new_files.includes(x))
      _del_files = _del_files.filter(x => x !== undefined)
      console.log(_del_files)
      await cloud.deleteFile({
        fileList: _del_files
      })
    }catch(err){
      console.log(err)
    }

    return await projDB.where({
      "projID": parseInt(projId)
    }).update({"data": {
      "material": data
    }})
  },
  // 获取工单主材信息（材料质保）
  // params: { projId: 123 }
  getMaterial: async (params) => {
    const { projId } = params
    
    const _dbres = await projDB.where({
      "projID": parseInt(projId)
    }).get()
    const _dat = _dbres && _dbres.data
    const _arr = _dat && _dat[0]
    const _res = _arr && _arr.material
    return _res || []
  },
  // 添加上传的图片id
  // params: {projId, fileType: "xxx", file: 文件id}
  // 一次一个文件id，fileType取值只能是surface, effect, vr, construct之一
  //分别对应图片类型：平面图，效果图，vr，施工图
  addUploadedFiles: async (params) => {
    const { projId, fileType, fileId, fileName } = params

    const DB = db.collection("designer-photos")
    return await DB.add({ "data": {
      "projId": parseInt(projId),
      fileType,
      fileId,
      fileName
    }})
  },
  // 删除上传的图片id
  // params: {projId, fileType: "xxx", file: 文件id}
  // 一次一个文件id，fileType取值只能是surface, effect, vr, construct之一
  //分别对应图片类型：平面图，效果图，vr，施工图
  removeUploadedFiles: async (params) => {
    const { projId, fileType, fileId } = params

    const DB = db.collection("designer-photos")
    try{
      const files = (await DB.where({
        "projId": parseInt(projId),
        fileType
      }).get()).data.map(x => x.fileId)
      console.log(files)
      await cloud.deleteFile({
        "fileList": files
      })
    }catch(err){
      console.log(err)
    }
    return await DB.where({
      "projId": parseInt(projId),
      fileType,
      fileId
    }).remove()
  },
  // 获取上传的图片id
  // params: {projId, fileType: "xxx"}
  // 一次一个文件id，fileType取值只能是surface, effect, vr, construct之一
  //分别对应图片类型：平面图，效果图，vr，施工图
  getUploadedFiles: async (params) => {
    const { projId, fileType } = params

    const DB = db.collection("designer-photos")
    const _res = (await DB.aggregate().match({
      "projId": parseInt(projId)
    }).group({
      "_id": "$fileType",
      "files": $.push({ fileId: "$fileId", fileName: "fileName" })
    }).end()).list

    console.log(_res)
    const _photo = _res && _res.find(x => x._id === fileType)
    return _photo || []
  },
  contact: async (params) => {
    const { projId, msg } = params

    return await projDB.where({
      "projID": parseInt(projId)
    }).update({ "data": {
      "contacts": _.push({"_updateTime": (new Date()).toLocaleString('zh-CN'), "text": msg})
    }})
  },
  // 获取当前用户拥有的所有工单 无参数
  // 貌似没用，考虑废除
  getProjectsByOwner: async (params) => {
    return await projDB.where({
      "projOwner":  cloud.getWXContext().OPENID,
    }).get()
  },
  // 获取客户的所有工单 params { name: "xxx" }
  getCustomerProjects: async (params) => {
    let { phoneNumber } = params

    const _dbres = (await projDB.where({
      "customer": phoneNumber,
    }).get())
    const _dat = _dbres && _dbres.data
    return _dat || []
  },
  // 获取某人负责的项目 params: { "phoneNumber": "123" }
  getProjectByRole: async (params) => {
    let { phoneNumber } = params
    const __dbres = await userDB.where({ "phoneNumber": phoneNumber}).get()
    const _dat = __dbres && __dbres.data
    const _arr = _dat && _dat[0]
    if(!_arr){
      throw new Error('此用户不存在')
    }
    const roles = _arr && _arr.userType
    let res = {sales: [], designer: [], budgeter: [], worker: [], manager: []}
    for(var _role of roles) {
      switch(_role){
        case 'manager':
          const _dbres1 = await projDB.where({
            'manager': phoneNumber
          }).get()
          res.manager = (_dbres1 && _dbres1.data) || []
          break
        case 'sales':
          const _dbres2 = await projDB.where({
            'sales': phoneNumber
          }).get()
          res.sales = (_dbres2 && _dbres2.data) || []
          break
        case 'designer':
          const _dbres3 = await projDB.where({
            'designer': phoneNumber
          }).get()
          res.designer = (_dbres3 && _dbres3.data) || []
          break
        case 'budgeter':
          const _dbres4 = await projDB.where({
            'budgeter': phoneNumber
          }).get()
          res.budgeter = (_dbres4 && _dbres4.data) || []
          break
        case 'worker':
          res.worker = []
          const ___dbres = await projDB.get()
          const projs = ___dbres && ___dbres.data
          for(var proj of projs){
            for(var procedure of proj.procedure){
              if(procedure.worker.indexOf(phoneNumber) != -1) {
                res.worker.push(proj)
                break
              }
            }
          }
          break
      }
    }
    return res
  },
  // 获取单个项目 params: {projId: 123}
  getProject: async (params) => {
    const { projId } = params
    return (await projDB.where({
      "projID": parseInt(projId)
    }).get()).data[0]
  },
  // 获取所有项目 无参数
  getAllProjects: async (params) => {
    const _dbres = await projDB.get()
    return (_dbres && _dbres.data) || []
  }
})
