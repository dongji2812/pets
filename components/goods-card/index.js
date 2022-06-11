// components/goods-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsData: Object
  },

  methods: {
    /* 以下两个函数都是商品改变时的回调函数。 */

    /* 点击 选择商品的单选框 的回调。*/
    changeChecked(){
      const { goodsData } = this.data
      goodsData.checked = !goodsData.checked
      this.setData({ //更改当下商品的数据。
        goodsData
      })

      this.triggerEvent('setCheckedNum', { //子组件调用/触发父组件传递的setCheckedNum事件，并向父组件传递参数。
        _id: goodsData._id,
        checked: goodsData.checked,
        value: goodsData.value
      })
    },

    /* 商品购买数量改变时 的回调。 */
    changeValue(e){
      const { goodsData } = this.data
      goodsData.value = e.detail //通过e.detail拿到当前商品的数量，赋值给goodsData.value。
      this.setData({
        goodsData
      })

      this.triggerEvent('setCheckedNum', { //子组件调用/触发父组件传递的setCheckedNum事件，并向父组件传递参数。
        _id: goodsData._id,
        checked: goodsData.checked,
        value: goodsData.value
      })
    }
  }
})