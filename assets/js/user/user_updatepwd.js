$(function(){
  const form = layui.form
  const layer = layui.layer
  // 定义验证规则
  form.verify({
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd: function(value){
      if(value === $('[name=oldPwd]').val()){
        return '新旧密码不能一致'
      }
    },
    resamePwd: function(value){
      if(value !== $('[name=newPwd]').val()){
        return '确认密码与新密码不一致'
      }
    }
  })
  // 监听表单的提交行为
  $('#updatePwd_form').on('submit', function(e){
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 将表单的jquery元素转换为dom元素
        // 这样的话就可以使用原生的reseet方法，重置表单
        $('#updatePwd_form')[0].reset()
      }
    })
  })
  
})