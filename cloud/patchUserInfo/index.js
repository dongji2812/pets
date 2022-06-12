const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/* 更新该用户信息。 */
exports.main = async (event) => {
  const { userId, nickName, bufferAvatarUrl } = event

  let userData = { //创建一个对象userData。
    nickName
  }

  //如果用户修改了头像。
  if(bufferAvatarUrl){ 
    const userInfo = await cloud.database().collection('userInfo').doc(userId).get()

    // 修改头像。
    const { fileID } = await cloud.uploadFile({
      cloudPath: `avatarUrl/头像_${userId}_${Number(new Date())}.jpg`, //路径为用户id和时间戳，永远不会重复。
      //如果不存在该路径的话，会在云存储中自动生成该文件夹。
      fileContent: Buffer.from(bufferAvatarUrl), //arrayBuffer流转换为普通buffer流。
    })

    // 删除上一张头像。
    await cloud.deleteFile({
      fileList: [userInfo.data.avatarUrl]
    })

    userData.avatarUrl = fileID 
  }
  
  /* 更新用户信息中的头像和昵称。 */
  const data = await cloud.database().collection('userInfo').doc(userId).update({
    data: {
      ...userData
    }
  })

  return {
    data
  }
}