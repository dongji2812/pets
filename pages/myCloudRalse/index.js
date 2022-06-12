Page({
  data: {
    userInfo: "",
    text: '',
    animalList: [] 
  },

  /* 获取我的云养数据。 */
  async getRalseList(){
    const { userInfo, text } = this.data

    const { result: { data }} = await wx.cloud.callFunction({
      name: 'getRalseList',
      data: {
        userId: userInfo._id,
        text
      }
    })

    //console.log(data)

    this.setData({
      animalList: data
    })
  },

  onShow(){
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if(userInfo){
      this.getRalseList()
    }
  }
})