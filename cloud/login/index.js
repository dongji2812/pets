// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g2qc47qc4e54e25'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {avatarUrl} = event

  const db = cloud.database()
  const userInfo = db.collection('userInfo')
  const {data} = await userInfo.where({
    _openid: OPENID
  }).get()
  if (data.length === 0) { //数据库中没有数据。
    const { _id } = await userInfo.add({
      data: {
        avatarUrl,
        money: 0,
        loveValue: 0,
        message: 0,
        _openid: OPENID
      }
    })
    const {data} = await userInfo.doc(_id).get()
    return {
      data
    }
  } else {
      console.log(data) //data是？
      return {
        data: data[0]
    }
  }
}