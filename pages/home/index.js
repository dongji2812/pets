// index.js
Page({
  data: {
  },

  onLoad () {
    this.getTabBar().setData({ //修改 tabBar组件中data中的 active属性。
      active: 'home'
    })
  }
})
