const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userInfo = db.collection('userInfo')
const goods = db.collection('goods')

exports.main = async (event) => {
  const { userId, animalId, payData, totalPrice } = event

  const user = await userInfo.doc(userId).get()

  const ids = payData.map(item => item._id) //ids数组为用户想要购买商品的id。
  const { data } = await goods.where({ //从商品集合中找出符合ids数组 的所有数据，即用户选择想要购买商品们的数组。
    _id: db.command.in(ids) 
  }).get()

  
  /* 以下包含 两次判断。 */
  /* 1、获取商品余量与用户购买数量进行对比。后端动态筛选出 购买数量 > 余量的数据，即不满足要求的数据。
      从后端数组data中，找到前端数组payData中的元素，判断该元素的前端购买数量大于后端剩余余量的数据。
  */
  const noGoods = data.filter(item => {
    const find = payData.find(v => v._id === item._id) //find方法返回第一个符合条件的数据，对象的形式。
    return find && find.value > item.amount  //return布尔值。
  })

  if(noGoods.length > 0){
    return {
      message: '支付失败，商品不足！',
      code: 0
    }
  }


  /* 2、判断余额。其实微信端会帮助我们判断。 */
  const total = data.reduce((pre, item) => {
    const find = payData.find(v => v._id === item._id) //find方法返回第一个符合条件的数据，对象的形式。
    return pre += (item.price * find.value)
  }, 0)

  if(totalPrice !== total){ //判断前端总价totalPrice和后端总价total是否相等。数据库价格是否动态变化。 
    return {
      message: '商品信息发生变化请重新支付',
      code: 0
    }
  }

  if(user.data.money < total){
    return {
      message: '支付失败，余额不足！',
      code: 0
    } 
  }


  /* 3、更新用户数据库 */
  await userInfo.doc(userId).update({ //await后是一个promise对象。
    data: {
      money: db.command.inc(-total), //余额。inc()实现自增、自减。
      loveValue: db.command.inc(total), //爱心值。
    }
  })

  /* 3、更新商品数据库 */
  // 商品购买数量可能不一样，所以需要对每一个商品单独操作。
  const updataArray = payData.map(item => goods.doc(item._id).update({ //map方法中每个元素返回一个promise对象，最后得到promise数组updataArray。
    data: {
      amount: db.command.inc(-item.value)
    }
  }))
  await Promise.allSettled(updataArray) //await后是一个promise数组。Promise.allSettled比Promise.all更好用，防止异步任务失败后有报错。
  //操作完毕后再返回支付成功。

  /* 4、提交订单后应该 生成云养数据 */
  await cloud.callFunction({
    name: 'patchRalse', //云函数中调用 另一个云函数。
    data: {
      userId,
      animalId
    }
  })
  
  return { //上面都没有return，则在这里执行return。省略了支付步骤，直接返回支付成功，返回值是静态数据。
    message: '支付成功',
    code: 200 //自己指定的状态码，上面为0，这里为20。可在前端通过状态码判断是否支付成功。
  }
}