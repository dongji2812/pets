// components/animal-card/index.js
Component({
  options: {
    multipleSlots: true //开启多插槽。
  },
  /**
   * 组件的属性列表
   */
  properties: {
    animalData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toInfo(){ //跳转到宠物详细信息页面，把当前宠物id传过去。
      wx.navigateTo({
        url: `/pages/animalInfo/index?id=${this.data.animalData._id}`, 
      })
    }
  }
})
