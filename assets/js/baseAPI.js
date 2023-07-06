// 注意：每次调用$.get(),$.post(),$.ajax()之前都会预先调用ajaxPrefilter这个函数，
// 在这个函数中，可以拿到我们给Ajax提供的配置对象，所以可以利用其进行url地址的拼接，实现简化的目的
$.ajaxPrefilter(function(options){
  // 在真正的Ajax请求之前，同意拼接请求的url地址
  options.url = 'http://127.0.0.1:8080' + options.url
  // 统一为有权限的接口设置请求头
  // indexOf有两种用法：
  // 1、查找数组中指定元素的位置，有则返回第一次出现的位置，如果没有找到就返回-1
  // 2、查找某个特定的字符串在字符串中的位置，找到则返回第一次出现该字符串的位置，否则返回-1，区分大小写 
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  

  // 全局挂载complete函数，无论成功或失败都执行
  // 当浏览器向服务器发出请求后，服务器会向给客户端信息，当相应成功，调用成功的回调函数，当失败时会调用失败的回调
  // 但是无论是成功还是失败都会调用complete回调函数
  // 所以再所有的接口中都要使用complete来指明成功或则失败
  options.complete = function(res){
    // console.log('执行了complete回调')
    // console.log(res)
    // 在complete回调函数中，可以使用res.responseJSON来的到服务器相应过来的数据
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败'){
      // 强制清除token
      localStorage.removeItem('token')
      // 强制跳转到登陆
      location.href = '/big_event/login.html'
    }
  }

  
})