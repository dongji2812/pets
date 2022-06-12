Page({
  data: {
    userId: '',
    nickName: '',
    showAvatarUrl: '', //当前页面展示头像的地址，可能变化。
    fileID: '', //数据库中头像的地址，一直不变。
  },

  onLoad(){
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userId: userInfo._id
      })

      this.getUserInfo()
    }
  },

  /* 获取用户信息 */
  async getUserInfo(){
    //在后端数据库中获取最新信息，不要在本地存储中获取，因为本地存储中的信息不一定是最新。
    const { data } = await wx.cloud.database().collection('userInfo').doc(this.data.userId).get() 
  
    this.setData({
      showAvatarUrl: data.avatarUrl,
      fileID: data.avatarUrl,
      nickName: data.nickName
    })
  },

  /* 选择头像 */
  async chooseMedia(){
    const { tempFiles } = await wx.chooseMedia({ 
    //wx.chooseMedia()表示可以从手机相册中或拍摄选择图片或视频。
    //返回格式为{errMsg, type, tempFilse}，其中tempFilse的属性值是数组形式，数组中是对象，包含fileType、size、tempFilePath图片临时地址。
    //tempFilePath图片临时地址为图片生成的buffer流，上传时找到临时地址，转换为文件流。
      count: 1, //允许上传一张。
      mediaType: ['image'],
      sourceType: ['album', 'camera'] //图片来源可以是手机相册album，也可以是相机camera。
    })

    this.setData({
      showAvatarUrl: tempFiles[0].tempFilePath
    })

    /* 小程序端上传头像。 不过删除上一张头像怎么办？*/ 
    /*await wx.cloud.uploadFile({
      cloudPatch: 'Xxx/头像.jpg', //在数据库的存储中，生成Xxx文件夹，文件夹下生成头像.jpg。
      filePath: tempFiles[0].tempFilePath
    }) */
  },

  /* 修改信息，包括修改头像和修改昵称。 */
  async submit(){
    const { userId, nickName, showAvatarUrl, fileID } = this.data; 
    let bufferAvatarUrl = ''

    wx.showLoading({
      title: '修改中...',
    })

    if(fileID !== showAvatarUrl){ //数据库中头像和页面展示头像做对此，判断用户是否修改了头像。
      bufferAvatarUrl = wx.getFileSystemManager().readFileSync(showAvatarUrl) 
      //wx.getFileSystemManager().readFileSync()读取本地文件路径，生成arrayBuffer流，作为上传头像的数据。
    }

    await wx.cloud.callFunction({
      name: 'patchUserInfo',
      data: {
        userId,
        nickName,
        bufferAvatarUrl
      }
    })

    wx.hideLoading()

    wx.navigateBack({ //返回上一页，也就是mine页面。
      delta: 1,
    })
  }

})