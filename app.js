// app.js
App({
  onLaunch(){
    wx.cloud.init({
      env: 'cloud1-7g2qc47qc4e54e25', //手动指定环境。
      traceUser: true,
    })
  }
})
