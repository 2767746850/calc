//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    express:'', //记录字符串 
    tempStr:'', //临时记录字符串
    strList:[]   //记录字符数组
  },

  calc2:{
    str:'',   //临时字符串
    strList:[], //中缀表达式存储（队列先进先出）
    strListP:[],  //后缀表达式（队列先进先出）
    list:[],  //存放运算符的堆栈 （先进后出）
    count:[],     //计算表达式堆栈（先进后出）
    flag:0       //表示字符串最后一位是否是运算符号位
  }

})