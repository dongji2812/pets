// index.js
Page({
  data: {
    windowHeight: 0,
    swiper: ['../../assets/image/swiper1.jpg', '../../assets/image/swiper2.jpg', '../../assets/image/swiper3.jpg'], //静态数组。
    active: 3, //宠物类型，默认为3，选中3。
    tabList: [{ //静态数组。
      title: '猫猫',
      id: 3
    }, {
      title: '狗狗',
      id: 4
    }, {
      title: '其他',
      id: 0
    }],
    animalList: [],
    pageSize: 5, //每页展示数据的数量。
    pageIndex: 1, //当前页码，默认为第一页。
    triggered: false //true表示下拉刷新已经被触发，false表示下拉刷新未被触发。
  },

  onLoad () {
    this.getTabBar().setData({ //修改 tabBar组件中data中的 active属性。
      active: 'home'
    })

    const { windowHeight } = wx.getWindowInfo() 
    this.setData({
      windowHeight: windowHeight - 50 //每个手机的窗口高度减去tabBar的高度，50是看的调试器中的高度，单位是px。
    })

    this.getAnimalList()
  },

  /* 获取宠物列表。 */
  async getAnimalList () {
    const {active, pageSize, pageIndex, animalList} = this.data

    const { result: { data } } = await wx.cloud.callFunction({
      name: 'getAnimalList',
      data: {
        type: active, //对象属性未简写。
        pageIndex, //对象属性简写。
        pageSize
      }
    })
    //console.log(data) data是数组的形式，每个数组元素是对象的形式。

    this.setData({
      animalList: [...animalList, ...data],
      triggered: false //若刷新被开启，需要手动关闭刷新。
    })
  },

  /* 上拉触底加载。 */
  scrolltolower () {
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    this.getAnimalList()
  },

  /* 下拉刷新。 */
  refresherrefresh () {
    this.setData({
      pageIndex: 1,
      animalList: []
    })
    this.getAnimalList() //重新获取宠物列表。
  },

  /* 选择宠物类型。 */
  setActive (event) {
    this.setData({
      active: event.currentTarget.dataset.id,
      pageIndex: 1, 
      animalList: [] 
    })
    this.getAnimalList()
  },
})
