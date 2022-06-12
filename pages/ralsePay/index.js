Page({
  data: {
    userId: '',
    animalId: '',
    animalInfo: {}, //一条数据。
    goodsList: [], //多条数据。
    checked: false, //全选按钮是否被选中。
    totalPrice: 0
  },

  onLoad(options){ //在onLoad中拿到宠物详细信息animalInfo页面跳转到该页面时，路由传过来的宠物id。
    const id = options.id
    const userInfo = wx.getStorageSync("userInfo")

    this.setData({
      animalId: id,
      userId: userInfo._id
    })

    this.getAnimalInfo()
    this.getGoodsList()
  },

  /* 获取该宠物信息。 */
  async getAnimalInfo(){
    const { animalId, userId } = this.data

    const { result: { data } } = await wx.cloud.callFunction({ //得到getAnimalInfo函数的返回值。包含like属性。
      name: 'getAnimalInfo',
      data: {
        animalId,
        userId
      }
    })
    //格式是{data, errMsg}，data是对象的形式，包含众多属性和属性值。

    //console.log(data)
    this.setData({
      animalInfo: data
    })
  },

  /* 获取商品列表 */
  async getGoodsList(){
    const { result: { data } } = await wx.cloud.callFunction({//格式是{errMsg, result, requestID}。result下包含data，data的属性值是数组形式。
      name: 'getGoodsList'
    })

    /* 二次加工 后端返回的数据。 */
    data.forEach(item => {
      item.checked = false; //为goodsList数组中每一项元素item设置checked属性。
      item.value = 1;
    })

    this.setData({
      goodsList: data
    })
  },
  
  /* 点击全选按钮的回调。 */
  changeChecked(){
    const { checked, goodsList } = this.data 
    
    goodsList.forEach((item) => { //对goodsList数组中每一项元素item设置是否选中。
      if(item.amount > 0){ 
        //有数量可以购买时才进行选中和不选中的操作，这样计算价格才对。否则没有数量的商品checked设置为true，计算价格时会包含在内。
        item.checked = !checked //每个元素和全选按钮的属性保持一致。
      }
    })

    this.setData({
      checked: !checked, //取出全选按钮的状态，对状态取反。
      goodsList
    })

    this.countTotal() //全选时需要计算价格。
  },

  /* 在子组件中触发该函数。子组件点击单选按钮和改变商品购买数量时，触发该事件，重新计算价格。*/
  setCheckedNum(event){ /* e.detail接收到子组件向父组件传递的参数。 */
    const { checked, value, _id } = event.detail
    const { goodsList } = this.data
    goodsList.forEach(item => { /* 更新整个goodsList的数据。 */
      if(item._id === _id){
        item.checked = checked
        item.value = value
      }
    })
    this.countTotal() //某个商品改变时需要计算价格。
  },

  /* 计算价格 */
  countTotal(){
    let { totalPrice, goodsList } = this.data //totalPrice需要写，所以用let。

    totalPrice = 0
    goodsList.forEach(item => {
      if(item.checked){ //选中了当前商品。
        totalPrice += (item.value * item.price)
      }
    })

    this.setData({
      totalPrice: totalPrice * 100 //van-submit-bar展示时默认带两位小数，这里乘以100。
    })
  },

  /* 提交订单，进行支付。 */
  async pay(){
    const { goodsList, userId, totalPrice, animalId } = this.data

    /* 用户选择想要购买的数据。 */
    const payData = goodsList.filter(item => item.checked).map(item => ({ 
    //先对商品数组进行筛选，然后根据筛选后的每个数组元素变形为一个对象，返回新数组payData。
      _id: item._id, //购买商品id。
      value: item.value //购买商品数量。
    }))

    if(payData.length > 0){
      const { result } = await wx.cloud.callFunction({
        name: 'postPay',
        data: {
          payData,
          totalPrice: totalPrice / 100, //上面乘以100，这里还原回来。
          userId,
          animalId
        }
      })

      wx.showToast({
        icon: 'none',
        title: result.message,
      })

      result.code && wx.redirectTo({ //关闭支付pay页面，打开云养页面。回退时是宠物详情页面。
        url: '/pages/myCloudRalse/index',
      })
    }
  }

})