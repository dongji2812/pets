const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  const { userId, sort } = event;

  const userInfo = await db.collection('userInfo').doc(userId).get()  /* 获取当前用户信息 */
  const animal = db.collection('animal');

  /* 得到用户关注宠物的集合。 */
  const animalList = await animal.where({
    _id: db.command.in(userInfo.data.likeAnimalIds) //userInfo.data.likeAnimalIds是宠物id的数组。
    //command.in表示得到 符合数组userInfo.data.likeAnimalIds 的所有数据。
  })
  .orderBy('age', sort) //第一个参数是排序的字段，第二个参数是字符串"desc"或"asc"。
  .get()

  return {
    data: animalList.data
  }
}