$(function(){
  const form = layui.form
  const layer = layui.layer

  form.verify({
    nickname: function(value){
      if(value.length > 6){
        return '昵称必须在1 ~ 6个字符之间'
      }
    }
  })

  initUserInfo()
  // 初始化用户的基本信息
  function initUserInfo(){
    $.ajax({
      method: 'GET',
      url: '/my/userinfo', 
      success: function(res){
        if(res.status !== 0){
          return layer.mag(res.message)
        }
        // 利用form.val给表单快速赋值
        // 第一个参数是字符串，指明是哪一个表单，在表单中利用lay-filter进行指明
        // 第二个参数是要复制的对象
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click', function(e){
    // 阻止该按钮对表单的默认重置行为
    e.preventDefault()
    initUserInfo()
  })

  // 表单数据的提交
  // 监听表单的提交行为
  // serialize可以快速拿到表单的数据
  $('.layui-form').on('submit', function(e){
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg('更新用户信息成功')
        // 调用父页面中的方法重新渲染页面的头像和姓名
        // 这个在页面中的url地址中显示的还是index.html,所以index.html为父页面，但是中间隔了一个ifrem
        // 所以要想办法获取父页面的方法，就可以用下面的方法，其中parent就是代表的是父页面
        window.parent.getUserInfo()
      }
    })
  })
  
})