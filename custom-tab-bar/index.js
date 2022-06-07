// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 'home',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange({ detail }){  //detail是事件对象中的属性，属性值是van-tabbar-item标签中的name。
      wx.switchTab({
        url: `/pages/${detail}/index`, 
      })
    }  
  }
})
