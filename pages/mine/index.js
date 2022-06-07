// pages/mine/index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getTabBar().setData({
      active: 'mine'
    })
  },

  async onChooseAvatar (e) {
    //console.log(e)
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })

    const { result: { data } } = await wx.cloud.callFunction({
    //const res = await wx.cloud.callFunction({
      name: 'login',
      data: {
        avatarUrl
      }
    })
    //console.log(res)

    wx.setStorageSync('userInfo', data)
    this.setData({
      userInfo: data
    })
  },

  async getUserInfo() {
    const data = wx.getStorageSync('userInfo')
    if (data) {
      const userInfo = await wx.cloud.database().collection('userInfo').doc(data._id).get()
      this.setData({
        userInfo: userInfo.data
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})