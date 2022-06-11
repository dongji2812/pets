const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
exports.main = async (event) => { //更新该用户数据，在用户对象中增加likeAnimalIds属性。
  const { animalId, userId } = event

  const { data } = await db.collection('userInfo').doc(userId).get()
  const likeAnimalIds = data.likeAnimalIds || [] //防止下面解构...likeAnimalIds时null报错。
  await db.collection('userInfo').doc(userId).update({ //更新userInfo集合中该用户的信息，无返回值。
    data: {
      likeAnimalIds: likeAnimalIds.includes(animalId) ? likeAnimalIds.filter(item => item !== animalId) : [...likeAnimalIds, animalId]
    }//likeAnimalIds是宠物id的数组。 如果likeAnimalIds列表里有该宠物id，则取关，筛选出不是该宠物id的宠物们。
    //如果ikeAnimalIds列表里没有该宠物id，则关注该宠物，数组中增加该元素。
  })

  return { //返回值是静态数据。
    data: {
      message: '操作成功',
      code: 200 
    }
  }
}