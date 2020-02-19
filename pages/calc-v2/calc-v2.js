// pages/calc/calc.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    express: '', //第一行的表达式
    result: '' //第二行的结果
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //给所有text或view绑定此事件，同时增加对应的自定义属性值
  click(e) {
    //console.log(e.target.dataset.con)

    let input = e.target.dataset.con //获取每次输入的内容
    if (input == "c") {
      this.handleClear();
    } else if (input == "←") {
      this.handleDelete();
    } else {
      //调用处理字符串
      this.handleInfo(input);
    }


  },

  //处理本地用户的输入操作
  handleInfo(input) {
    if (app.calc2.str.length == 0) { //第一次点击
      if (input == "-" || this.checkShuZi(input)) { //为减号
        this.addStr(input);
      } else {
        return;
      }
    } else {
      if (app.calc2.flag == 1) { //说明最后一位是符号
        if (this.checkFuHao(input)) {
          app.calc2.str = app.calc2.str.substring(0, app.calc2.str.length - 1); //去掉最后一位符号，添加最新的符号进去
          this.addStr(input);
        } else {
          this.addStr(input);
        }
      } else {
        this.addStr(input);
      }
    }
  },

  //客户点击等号了
  result() {
    //每次点击等号重新把列表给空
    app.calc2.strList.length = 0;
    app.calc2.strListP.length = 0;
    app.calc2.list.length = 0;
    app.calc2.count.length = 0;

    //将表达式变成中缀表达式队列
    this.expressToStrList(this.data.express);
    console.log(app.calc2.strList);

    //将中缀表达式集合赋值给临时变量
    let tempList = app.calc2.strList;
    this.expressToStrListP(tempList);
    console.log(app.calc2.strListP);

    //最终的计算
    let tempP = app.calc2.strListP
    for (let m in tempP){
      if (this.checkFuHao2(tempP[m])) {//不含点号的符号方法判断
        let m1 = app.calc2.count[0];  //取出第一个数据
        app.calc2.count.shift();      //取出后删除该数据
        let m2 = app.calc2.count[0];  
        app.calc2.count.shift();
        // console.log('m1是' +m1);
        // console.log('m2是' + m2);
        // console.log('运算符是' + tempP[m]);
        // console.log('计算结果是：' + this.countDetail(m2, tempP[m], m1));
        app.calc2.count.unshift(this.countDetail(m2, tempP[m], m1));  //将计算结果放到count中
      }else{
        app.calc2.count.unshift(tempP[m])  //将数字压进去
      }
    }
    console.log('最终的计算结果是' + app.calc2.count[0]);
    this.setData({
      result: app.calc2.count[0]
    });
  },

  //实际具体计算
  countDetail(e1, e2, e3) {
    let result = 0.0;
    console.log(e2);
    try {
      if (e2 == "×") {
        result = parseFloat(e1) * parseFloat(e3);
      } else if (e2 == "÷") {
        result = parseFloat(e1) / parseFloat(e3);
      } else if (e2 == "%") {
        result = parseFloat(e1) % parseFloat(e3);
      } else if (e2 == "+") {
        result = parseFloat(e1) + parseFloat(e3);
      } else {
        result = parseFloat(e1) - parseFloat(e3);
      }
    } catch (error) {

    }
    return result;
  },
  
  //将中缀表达式集合转变为后缀表达式集合
  expressToStrListP(tempList){
    for (let item in tempList) {
      if (this.checkFuHao2(tempList[item])) { //不含点号的符号方法判断
        if (app.calc2.list.length == 0) {
          app.calc2.list.unshift(tempList[item]); //直接添加添加运算符
        } else {
          if (this.checkFuHaoDX(app.calc2.list[0], tempList[item])) {
            for (let x in app.calc2.list) {
              app.calc2.strListP.push(app.calc2.list[x]);   //将运算符都放到listP中
            }
            app.calc2.list.length = 0; //循环完把list置空
            app.calc2.list.unshift(tempList[item]);//加新元素进去
          } else {
            app.calc2.list.unshift(tempList[item]); //直接添加添加运算符
          }
        }
      } else {
        app.calc2.strListP.push(tempList[item]); //数字直接加到后缀集合中
      }
    }
    //循环完有可能最后一个是数字了，取到的不是字符，那么运算符里剩余的还的加到listP中
    if (app.calc2.list.length > 0) {
      for (let x in app.calc2.list) {
        app.calc2.strListP.push(app.calc2.list[x]);   //将运算符都放到listP中
      }
      app.calc2.list.length = 0; //循环完把list置空
    }
  },

  //判断两个运算符的优先级(m1是list集合中最后加进去的那个元素比较将要进来的元素，如果m1比m2大，弹出list集合到listp中，再把m2加到list中，否则直接将m2加入list)
  checkFuHaoDX(m1, m2) {
    if ((m1 == "%" || m1 == "×" || m1 == "÷") && (m2 == "-" || m2 == "+")) {
      return true;
    } else {
      return false;
    }
  },

  //将字符串表达式变成中缀队列
  expressToStrList(express) {
    let temp = ''; //定义临时变量
    //将表达式改为中缀队列
    for (let i = 0; i < express.length; i++) {
      if (i == 0 && express[i] == "-") {
        temp = temp + express[i];
      } else {
        if (this.checkShuZi2(express[i])) { //如果i是数字
          temp = temp + express[i];
        } else {
          if (temp.length > 0) {
            if (express[i] == ".") {
              temp = temp + express[i];
            } else {
              app.calc2.strList.push(parseFloat(temp));
              temp = '';
              app.calc2.strList.push(express[i]);
            }
          } else {
            temp = temp + express[i];
          }
        }
      }
    }
    //循环到最后再看temp中有没有数字了，如果有加进来
    if (temp.length > 0 && this.checkShuZi(temp.substring(temp.length - 1))) {
      app.calc2.strList.push(parseFloat(temp));
      temp = '';
    }
  },

  //处理客户输入清除键
  handleClear() {
    app.calc2.str = '';
    app.calc2.strList.length = 0;
    app.calc2.strListP.length = 0;
    app.calc2.list.length = 0;
    app.calc2.count.length = 0;
    app.calc2.minusFlag = 0;
    this.setData({
      express: '',
      result: ''
    });
  },
  //处理客户输入回退键
  handleDelete() {
    let str = app.calc2.str;
    if (str.length > 0) {
      str = str.substring(0, str.length - 1);
      app.calc2.str = str;
      this.setData({
        express: str,
      });
    } else {
      return;
    }
  },

  //判断是否是运算符（含点号，用在组织表达式时 .不能重复输入）
  checkFuHao(input) {
    if (input == "-" || input == "+" || input == "÷" || input == "%" || input == "×" || input == ".") {
      return true;
    } else {
      return false;
    }
  },

  //判断是否是运算符（不含点号）
  checkFuHao2(input) {
    if (input == "-" || input == "+" || input == "÷" || input == "%" || input == "×") {
      return true;
    } else {
      return false;
    }
  },

  //判断是否是数字
  checkShuZi(input) {
    if (input == "0" || input == "1" || input == "2" ||
      input == "3" || input == "4" || input == "5" ||
      input == "6" || input == "7" || input == "8" || input == "9") {
      return true;
    } else {
      return false;
    }
  },

  //判断是否是数字(包含.号，用在表达式转中缀方法中)
  checkShuZi2(input) {
    if (input == "0" || input == "1" || input == "2" ||
      input == "3" || input == "4" || input == "5" ||
      input == "6" || input == "7" || input == "8" || input == "9" || input == ".") {
      return true;
    } else {
      return false;
    }
  },

  //给字符串添加新字符(直接追加 在判断是否要改变变量flag)
  addStr(input) {
    app.calc2.str = app.calc2.str + input;
    if (this.checkFuHao(input)) {
      app.calc2.flag = 1; //设置标记位位1
    } else {
      app.calc2.flag = 0;
    }
    this.setData({
      express: app.calc2.str
    });
  }

})