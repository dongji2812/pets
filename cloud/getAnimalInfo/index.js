// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
exports.main = async (event) => {
  const { animalId, userId } = event

  const animalInfo = await db.collection('animal').doc(animalId).get() //在animal集合中获取该宠物信息的JSON对象数据。注意await。
  const userInfo = await db.collection('userInfo').doc(userId).get() //在userInfo集合中获取该用户信息的JSON对象数据。注意await。
 
  return {
    data: {
      ...animalInfo.data, //animalInfo.data是对象的形式，这里解构对象。
      like: userInfo.data.likeAnimalIds && userInfo.data.likeAnimalIds.includes(animalInfo.data._id) //like的属性值为true或false。
    }
  }
}