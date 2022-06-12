const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  const { userId, text } = event;

  const userInfo = await db.collection('userInfo').doc(userId).get()   /* 获取当前用户信息 */
  const animal = db.collection('animal');

  const animalList = await animal.where({ //找到 符合下面两个条件 的数据。
    _id: db.command.in(userInfo.data.cloudRalse),
    title: db.RegExp({
      regexp: '.*' + text, //.*表示匹配全部。text是搜索框内输入的值，输入值可能有时有，有时没有。
      options: 'i', //忽略大小写。
    })
  })
  .get()

  return {
    data: animalList.data
  }
}