// index.js
Page({
  data: {
    active: 'home'
  },

  onLoad () {
    this.getTabBar().setData({
      active: 'home'
    })
  }
})
