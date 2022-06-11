const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const goods = cloud.database()
exports.main = async () => {
  const { data } = await goods.collection('goods').where({}).get() /* 查询全部，所以是where({})。 */

  return {
    data
  }
}