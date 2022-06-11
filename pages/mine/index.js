/* 未登录时显示的头像。 */
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    userInfo: null
  },

  onLoad () {
    this.getTabBar().setData({
      active: 'mine'
    })
  },

  /* 用户选择头像登陆时，触发的函数。 */
  async onChooseAvatar (event) { //event是形参，写成e、event都可以。下面用形参的时候保持一致就行。
    //console.log(e)
    const { avatarUrl } = event.detail 
    this.setData({
      avatarUrl,
    })

    /* 调用login云函数，传入data参数，并得到返回结果{ result: { data } }。 */
    const { result: { data } } = await wx.cloud.callFunction({ 
    //const res = await wx.cloud.callFunction({
    //函数的返回值是对象的形式，对象中包含result属性；result对象中包含data属性；data对象是服务器返回的满足查询方法的某条数据。
      name: 'login',
      data: {
        avatarUrl
      }
    })
    //console.log(res) 返回的对象中确实需要两层解构，才能得到data。data对象是服务器返回的满足查询方法的某条数据。

    wx.setStorageSync('userInfo', data)

    this.setData({
      userInfo: data
    })
  },

  /* 获取用户信息。 */
  async getUserInfo() {
    const data = wx.getStorageSync('userInfo')
    if (data) {
      const userInfo = await wx.cloud.database().collection('userInfo').doc(data._id).get() //去数据库中取最新数据。
      this.setData({
        userInfo: userInfo.data //返回结果是对象的形式，包含data属性，.的形式得到data。
      })
    }
  },

  /* 跳转页面。 */
  navigateTo(event) {
    wx.navigateTo({
      url: `/pages/${event.currentTarget.dataset.url}/index`
    })
  },

  /* 退出登录。 */
  logout() {
    wx.clearStorage() //清空浏览器本地存储，删除data中数据，但不会影响数据库。
    this.setData({
      userInfo: null
    })    
  },

  onShow() {
    this.getUserInfo() //每次显示个人中心页，都需要获取最新的用户信息。
  },
  
})