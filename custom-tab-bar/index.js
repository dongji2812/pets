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
    onChange({ detail }){  
      wx.switchTab({
        url: `/pages/${detail}/index`,
      })
    }  
  }
})
