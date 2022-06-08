// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g2qc47qc4e54e25' //写成cloud.DYNAMIC_CURRENT_ENV变量的形式可以自动获取当前环境。为何报错？
})

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext() //OPENID是用户的唯一标识。
  const {avatarUrl} = event

  const db = cloud.database()
  const userInfo = db.collection('userInfo')
  const {data} = await userInfo.where({ //where和doc都是查询，where的参数是对象的形式；再get；返回结果是对象的形式，包含data属性，解构出data。
    _openid: OPENID
  }).get()
  //console.log(data) 控制台并不显示。

  if (data.length === 0) { //数据库中没有用户信息，则为该用户进行注册。
    const { _id } = await userInfo.add({ //返回结果是对象的形式，包含data属性，解构出data。
      data: { //还会自动添加_id属性。
        _openid: OPENID,
        avatarUrl,
        money: 0,
        loveValue: 0,
        message: 0
      }
    })
    const {data} = await userInfo.doc(_id).get() //where和doc都是查询，doc的参数是单个变量的形式；再get；返回结果是对象的形式，包含data属性，解构出data。
    //console.log(data) 控制台并不显示。
    return {
      data
    }
  } else { //用户之前登陆过，数据库存在该用户的信息。
      return {
        data: data[0] //返回第一个用户的信息。逻辑对？
    }
  }
}