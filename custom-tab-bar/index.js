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
    active: 'home', //设置默认选中的标签栏。
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){  
      wx.switchTab({
        url: `/pages/${event.detail}/index`, 
        //默认情况下，event.detail的值为当前选中项的索引；标签指定name的情况下，event.detail的值为当前选中项的name。
      })
    }  
  }
})
