Page({
  data: {
    userInfo: "",
    ageSort: 'desc', //默认降序排序。
    animalLikeList: []
  },

  /* 切换排序规则 */
  changeSort(){
    const { ageSort } = this.data
    this.setData({
      ageSort: ageSort === 'desc' ? 'asc' : 'desc'
    })
    this.getLikeList()
  },

  /* 获取我的关注列表。*/
  async getLikeList(){
    const { userInfo, ageSort } = this.data

    const { result: { data }} = await wx.cloud.callFunction({ //格式是{errMsg, result, requestID}。result下包含data，data的属性值是数组形式。
      name: 'getLikeList',
      data: {
        userId: userInfo._id,
        sort: ageSort
      }
    })

    this.setData({
      animalLikeList: data
    })
  },

  onShow(){ /* 放在onShow中，更新我的关注列表。能在关注、取关之后及时获取最新信息。 */
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if(userInfo){
      this.getLikeList()
    }
  }
})