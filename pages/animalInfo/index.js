Page({
  data: { //data中数据可以读写。
    animalId: null, //宠物id。
    userId: null,
    animalInfo: {}
  },

   onLoad(options){
    const id = options.id //在onLoad中拿到自定义组件animal-card跳转到该页面时，路由传过来的宠物id。

    const userInfo = wx.getStorageSync("userInfo")
    this.setData({
      animalId: id, //将页面跳转时路由传过来的id参数存入data中。
      userId: userInfo._id //将本地存储中的userInfo中_id存入data中。
    })

    this.getAnimalInfo()

    /* 设置当前页面的转发按钮。 */
    wx.showShareMenu({ //页面转发设置为发送给朋友，分享到朋友圈。
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  },

  /* 获取宠物详情 */
  async getAnimalInfo(){
    let { animalId, userId, animalInfo } = this.data //后面animalInfo需要写，所以用let。

    if(userId){ // 用户已登录，调用getAnimalInfo云函数，得到该animalId宠物的详细信息，包含like属性。
      const { result: { data } } = await wx.cloud.callFunction({
        name: 'getAnimalInfo',
        data: {
          animalId,
          userId
        }
      })
      animalInfo = data
    } else { // 用户未登录，获取该animalId宠物的详细信息。
      const { data } = await wx.cloud.database().collection('animal').doc(animalId).get()
      animalInfo = data
    }
    //console.log(animalInfo)

    this.setData({
      animalInfo //更新到data中。
    })
  },

  /* 返回首页 */
  backHome(){
    wx.switchTab({ //返回之前某个tabBar页面，即主页。
      url: '/pages/home/index',
    })
  },

  /* 用户点击关注 || 取消关注。 */
  async onLike(){
    const { userId, animalId } = this.data

    //用户未登录。
    if(!userId){ 
      wx.showToast({
        icon: 'none',
        title: '登录后，一键关注'
      })
      return;
    }

    //用户已登录，调用patchLike云函数，更改该用户信息，无返回值。
    wx.showLoading({
      title: '操作中...',
    })
    await wx.cloud.callFunction({
      name: 'patchLike',
      data:{
        userId,
        animalId
      }
    })
    this.getAnimalInfo() //关注更改后，重新获取宠物的详细信息。
    wx.hideLoading()
  },

  /* 进入云养支付页面 */
  toPay(){
    const { userId, animalId } = this.data
    if(userId){
      wx.navigateTo({
        url: `/pages/ralsePay/index?id=${animalId}` //宠物详情页面跳转到云养支付pay页面，把当前宠物id传过去。
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '登录后，开始云养',
      })
    }
  },

  /* 当用户用户点击按钮分享、用户点击页面右上角分享时，自定义分享内容。 */
  onShareAppMessage(){
    const { varieties, age } = this.data.animalInfo
    const { animalId } = this.data
    return {
      title: `${varieties} -- ${age}个月`,
      path: `/pages/animalInfo/index?id=${animalId}`
      //path是被分享者进入小程序时的页面。分享时传递宠物id。进入页面后onLoad执行，getAnimalInfo正常调用，才能获取到宠物信息。
    }
  }

})