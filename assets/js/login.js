$(function(){
  // 点击注册账号的链接
  $('#link_reg').on('click', function(){
    $('#login_box').hide()
    $('#reg_box').show()
  })
  // 点击登录的链接
  $('#link_login').on('click', function(){
    $('#reg_box').hide()
    $('#login_box').show()
  })
  // 自定义规则
// 就像导入jQuery就可以使用$这个对象了一样，导入layui这个文件就可以使用layui这个对象了
const form = layui.form
// 就像自定义规则一样，想要使用特定的属性就必须要先引入
const layer = layui.layer
// 利用form.verify来自定义校验规则
form.verify({
  password: [
    // 自定义密码
    /^[\S]{6,12}$/,
    '密码必须6到12位，且不能出现空格'
  ],
  // 校验两次输入的密码是否一致
  repassword: function(value){
    // 通过形参拿到的是确认密码狂的内容
    // 还需要拿到密码框的内容
    // 然后再进行一次比较
    // 如果失败则返回一个错误的消息即可
    const pwdval = $('#reg_box [name=password]').val()
    if(pwdval !== value){
      return '两次密码不一致，请重新输入！'
    }
  }
})
// 监听表单的提交事件
$('#form_reg').on('submit', function(e){
  // 阻止默认的提交行为
  e.preventDefault()
  const userMessage = {
    username: $('#form_reg [name=username]').val(), 
    password: $('#form_reg [name=password]').val()
  }
  $.post('/api/reguser', userMessage, function(res) {
    if(res.status !== 0){
      return layer.msg(res.message)
    }
    layer.msg('注册成功请登录')
    $('#link_login').click()
  })
})
// 监听login事件的提交
$('#form_login').on('submit', function(e){
  // 先阻止默认行为
  e.preventDefault()
  // 快速获取表单数据
  const userMessage = $(this).serialize()
  // const userMessage = {
  //   username: $('#form_login [name=username]').val(),
  //   password: $('#form_login [name=password]').val()
  // }
  $.post('/api/login', userMessage, function(res) {
    if(res.status !== 0){
      return layer.msg(res.message)
    }
    layer.msg('登录成功')
    // console.log(res.token)
    // 可以将登录产生的token字符串保存到localStorage中
    localStorage.setItem('token', res.token)
    location.href = 'http://127.0.0.1:8080/index.html'
    
  })
})

})



