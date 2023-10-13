# 工单管理部分：

***

## 云函数：OrderServices(action, params)

数据库中project（工单）的结构：   

```
    "projID": projDB.count(),
    "name": "",
    "price": "",
    "customer": "",
    "address": "",
    "area": "",
    "designer": "",
    "sales": "", //自动设置为工单创建者的手机号码
    "budgeter": "",
    "manager": "",
    "status": Status.None,
    "photos”: {"construct": [], "effect": [], "design": [], "vr": []}
    "budget": undefined, // 预算信息
    "procedure": undefined, // 施工过程、进度
    "material": undefined, //材料、质保信息
    "contacts": [], // 联系客户的消息
    "projOwner": cloud.getWXContext().OPENID,
```   

procedure字段比较特殊，具体请看下面的updateProcedure接口备注   
status字段为枚举值，枚举如下，更新时可以自己定义同样的枚举，也可直接用对应字符串
```
const Status = Object.freeze({
  None: "-",
  Init: "立项中",
  Communicate: "方案预算沟通",
  Construct: "施工中",
  End: "已结束工单"
})
```   

***

### create
参数：`params: {phoneNumber: "123", data: { ... }}`   
返回：工单id   
描述：新建工单。   
备注：可以传入customer, designer, budgeter, manager, address, area. 就是把以前data里的内容拿了出来。这里所有与用户有关的字段都是手机号码（包括客户），需要客户名字请使用getUser.   

***

### update
参数：`params: { data: { ... } }`   
返回：数据库set操作返回的result，包含数据库索引和errMsg（应该没用）   
描述：根据data中的工单id，更新整个工单，data中的内容与数据库中结构一致，即getProject返回的结果（请务必使用get得到的结果进行更新，这个接口依赖其中的_id来确定工单）。   
备注：注意，update是全量更新，没有增量更新，请get并作修改之后原封不动地按照原来的结构传参。另外，图片，联系客户的消息，材料质保，施工工序建议使用专门的接口。   

***

### end
参数：`params: {projId: 123, endMsg: "xxx"}`   
返回：工单id   
描述：结束工单（不删除，将status字段置为"ended"），请传入工单结束原因。   
备注：其他工单状态可用update更新，结束工单因为要传结束原因/留言之类的就用这个接口。
***

### addBudget
参数：`params: {projId: 123, files: [{"fileName": "文件名1", "fileId": "文件id1"}, ...]}`   
返回：成功添加的文件的列表，格式为：[{"fileName": "文件名", "fileId": "文件id"}, ...]   
描述：添加预算表文件，files为文件对象数组，其中元素（对象）包含fileName和fileId字段   

***

### removeBudget
参数：`params: {projId: 123, files: ["文件id1", "文件id2", "文件id3", ...]}`   
返回：成功删除的文件的列表，格式为：["文件id1", "文件id2", "文件id3", ...]   
描述：删除预算表文件，files为**文件id**的列表   

***

### updateProcedure
参数：`params: {projId: 123, data: { ... }}`   
返回：数据库操作返回的promise   
描述：更新施工进度   
备注：施工过程，是一个数组，包含每个工序的施工人员，工期，质检项目。其中每个元素都是一个json,格式为：{name: "xxx施工过程名称", "worker": [], "time": xxx, "check": [], "files": []}。其中的name和worker字段是必须要有的。同样的，worker也要用手机号码存储。传参时data里放的是procedure数组的元素，即 data: {name: xxx, worker: [], files: [], check: []}。**注意：质检项目checks和工人施工图files必须使用下面的接口单独更新！**   
这个是数据库里面procedure的结构，其中除了worker和name其他可以自行增删：   

```
{
    "procedure": [
        {"name": "xxxprocedure1",
            "worker": ["workerphonenumber1"],
            "time": "before xxx time",
            "files": [
              {"fileName": "xxx", "fileId": xxx, "data": { ... }}
            ],
            "check": [
                {"name": "xxxcheck1", "done": false},
                {"name": "xxxcheck2", "done": false},
                {"name": "xxxcheck3", "done": false}
            ]
        }
    ]
}
```   

***

### getProcedure
参数：`params: {projId: 123}`   
返回：对应工单的procedure数组   
描述：获取施工进度，施工图和质检项目自动联表查询。   

***

### removeProcedure
参数： `params: {projId: 123, name: "xxx"}`   
返回：数据库操作返回的promise   
描述：删除一个施工工序，传入施工工序的名字name   

***

### addChecks
参数： `params: {projId: 123, procName: "施工工序名称", name: "质检项目名称", done: bool}`   
返回：数据库添加操作的结果   
描述：给指定的工单的施工工序添加一个质检项目   

***

### removeChecks
参数： `params: {projId: 123, procName: "施工工序名称", name: "质检项目名称"}`   
返回：数据库删除操作的结果   
描述：给指定的工单的施工工序删除一个质检项目   

***

### getChecks
参数： `params: {projId: 123, procName: "施工工序名称"}`   
返回：对象数组，其中元素为： { name: "施工工序名称", done: bool }   
描述：按照工单号和施工工序名称，返回该施工工序的质检项目   

***

### updateChecks
参数： `params: {projId: 123, procName: "施工工序名称", checks: [{name: "质检项目名称1", done: bool}, {name: "质检项目名称2", done: bool}, ...]}`   
返回：对象数组，其中元素为传入的并且成功更新的质检项目。   
描述：更新指定工单的指定施工工序的一个或多个质检项目   

***

### addConstructPhotos
参数： `params: { projId: 123, procName: "施工工序名称", fileId: "文件id", fileName: "文件名", data: { ... } }`   
返回：数据库添加操作的结果   
描述：添加工人施工图   

***

### removeConstructPhotos
参数： `params: { projId: 123, procName: "施工工序名称", fileId: "文件id" }`   
返回：数据库删除操作的结果   
描述：删除工人施工图   

***

### getConstructPhotos
参数： `params: { projId: 123, procName: "施工工序名称" }`   
返回：对象数组   
描述：根据施工工序名称返回对应的工人施工图。getProcedure接口已经自动联表查询，不用额外调用此接口。   

***

### updateMaterial
参数：`params: {projId: 123, data: { ... }}`   
返回：数据库操作返回的promise   
描述：更新主材信息，data中的内容请自行确定，请把主材相关文件的文件id也包含在内   

***

### getMaterial
参数：`params: {projId: 123}`   
返回：主材信息数组或对象（update怎么存的就返回什么）
描述：获取主材信息

***

### addUploadedFiles
参数：`params: {projId: 123, fileType: "xxx", fileId: 文件id, fileName: 文件名}`   
返回：数据库操作返回的promise   
描述：更新上传的图片id，一次一个文件id，fileType取值只能是surface, effect, effectvr, vr, construct之一，分别对应图片类型：平面图，效果图，vr效果图，vr，施工图（设计师）   

***

### removeUploadedFiles
参数：`params: {projId: 123, fileType: "xxx", fileId: 文件id}`   
返回：数据库操作返回的promise   
描述：删除上传的图片id，一次一个文件id，fileType取值只能是surface, effect, effectvr, vr, construct之一，分别对应图片类型：平面图，效果图，vr效果图，vr，施工图（设计师）   
备注：只需传入文件id，不用传入文件名

***

### getUploadedFiles
参数：`params: {projId: 123, fileType: "xxx" }`   
返回：数组   
描述：获取所有上传的图片id，fileType取值只能是surface, effect, effectvr, vr, construct之一，分别对应图片类型：平面图，效果图，vr效果图，vr，施工图（设计师）   

***

### contact
参数：`params: {projId: 123, msg: "xxx"}`   
返回：数据库操作返回的promise   
描述：沟通客户，传入工单id以及沟通信息   
备注：contact字段用于存放这些联系信息，这是一个对象数组，其中元素为： `{ _updateTime: "xxx", text: "xxxxxx"}`   

***

### getCustomerProjects
参数：`params: {phoneNumber: "123"}`   
返回：手机号码对应的客户的所有工单的数组   
描述：根据手机号码，返回对应客户的所有工单   

***

### getProject
参数：`params: {projId: 123}`   
返回：一个工单   
描述：根据工单号返回对应工单，可用于获取施工进度，预算信息等……   

***

### getAllProjects
参数：无   
返回：所有工单的数组   
描述：返回所有工单   

***

### getProjectByRole
参数：`params: { phoneNumber: "123"}`   
返回：phoneNumber所对应用户负责的工单   
描述：根据phoneNumber所对应用户的手机号码，返回他在其中担任有职位的所有工单。   
备注：由于一个用户可能有多个用户类型，因而这个接口返回的是一个json，有5个键，分别为：sales, worker, designer, budgeter, manager，键对应的值都为一个数组，元素即为这个用户作为当前角色时负责的所用工单的projID。   
简短的示例如下：   

```
{
    "sales":
    [
        {
            "_id":"7246251b64ad912100002d2e4d2aed7d",
            "projID":14,
            "customer":"12306test",
            "address":"scut",
            "area":1000,
            "designer":"",
            "sales":"12306test",
            "budgeter":"",
            "manager":"",
            "status":"before",
            "photos":{"surface":["fileidxxx1"],"effect":[],"vr":[]},"budget":["fileid1"],
            "procedure":[
                {
                    "check":[{"done":false,"name":"xxxcheck"}],
                    "name":"testprocedure",
                    "worker":["12306test"]
                }
            ],
            "material":[],
            "contacts":[{"text":"ddddd","time":"7.12 1:50"}],
            "projowner":"oyxsb5f4a-kg_bepaj2i0gwty8iw"
        }
    ],
    "designer":[],
    "budgeter":[],
    "worker":[],
    "manager":[]
}
```
