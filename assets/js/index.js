

$(function(){
  // 调用获取用户的基本信息
  getUserInfo()
  const layer = layui.layer
  $('#btnLogout').on('click', function(){
    // 弹出提示消息框，提示用户是否退出
    layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
      //do something
      // 清除本地存储的token
      localStorage.removeItem('token')
      // 跳到登录页面
      location.href = '/big_event/login.html'

      
      layer.close(index);
    })
  })
})

// 获取元素的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers就是请求头
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function(res){
      if(res.status !== 0){
        return layui.layer.msg('获取用户信息失败')
      }
      // 利用renderAvatar来渲染用户的头像
      renderAvatar(res.data)
    },
    // // 当浏览器向服务器发出请求后，服务器会向给客户端信息，当相应成功，调用成功的回调函数，当失败时会调用失败的回调
    // // 但是无论是成功还是失败都会调用complete回调函数
    // // 所以再所有的接口中都要使用complete来指明成功或则失败
    // complete: function(res){
    //   // console.log('执行了complete回调')
    //   // console.log(res)
    //   // 在complete回调函数中，可以使用res.responseJSON来的到服务器相应过来的数据
    //   if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败'){
    //     // 强制清除token
    //     localStorage.removeItem('token')
    //     // 强制跳转到登陆
    //     location.href = '/big_event/login.html'
    //   }
    // }

  })
}
// 渲染用户的头像
function renderAvatar(user){
  // 获取用户的名称
  const name = user.nickname || user.username
  // 设置欢迎的文本
  $('#welcome').html(`欢迎&nbsp&nbsp${name}`)
  // 按需渲染头像
  if(user.user_pic !== null){
    // 渲染图片头像
    $('.text-avatar').hide()
    $('.layui-nav-img').attr('src', user.user_pic).show()
  }else{
    // 渲染文本头像
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}