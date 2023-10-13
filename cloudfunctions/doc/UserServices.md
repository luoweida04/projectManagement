# 用户管理部分：

***

## 云函数：UserServices(action, params)
用户type有: customer, sales, worker, designer, budgeter, manager   
数据库中user的结构：   

```
    "userName":
    "userType": []
    "openId":          //这个不用管
    "phoneNumber":
    "_createTime":     //这个不用管
    "_updateTime":     //这个不用管
```

备注：userType是数组是因为一个用户可以有多个角色   

***

### login
参数：无   
返回：
```
result: {requireRegister: 0, detail: { data: { ... }}}   
或result: {requireRegister: 1, detail: {}}
```
描述：应该用不上，其中data中含有openId。RequireRegister为0即已注册，为1则需要注册   

***

### register
参数: `params: {data: { userName: "xxx", userType: ["xxx"], phoneNumber: "123"}}`   
返回：数据库操作返回的promise   
描述：注册新用户   
备注：userType必须为数组，customer, sales, worker, designer, budgeter, manager   

***

### update
参数：`params: { phoneNumber: "123", data: { ... } }`   
返回：数据库操作返回的promise   
描述：传入phoneNumber，更新对应用户信息   
备注：增量更新，可以只传入要更新的参数。参数结构与内容与get返回的一样.   

***

### getUsers
参数：`params: {userType: "xxx"}`   
返回：该类型的所有用户的数组   
描述：根据用户类型获取所有用户   

***

### getUser
参数：`params: { phoneNumber: "123" }`   
返回：单个用户   
描述：根据phoneNumber返回单个用户   
