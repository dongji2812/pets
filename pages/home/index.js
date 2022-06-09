// index.js
Page({
  data: {
    windowHeight: 0,
    swiper: ['../../assets/image/swiper1.jpg', '../../assets/image/swiper2.jpg', '../../assets/image/swiper3.jpg'], //初始值是静态路径。
    active: 3, //选中的宠物类型，默认为3。
    tabList: [{ //自己创建的静态数组，不会变化。
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

    this.getAnimalList()
  },

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

    this.setData({
      animalList: [...animalList, ...data]
    })
  },

  scrolltolower () {

  },

  refresherrefresh () {

  },

  setActive () {

  },
})
