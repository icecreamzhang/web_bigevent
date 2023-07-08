$(function(){
  const layer = layui.layer
  // 获取裁剪区域的DOM元素
  const $image = $('#image')
  // 配置选项
  const options = {
    // 纵横比
    // 代表是一个正方形的裁剪区域 代表1：1
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 创建裁剪区域
  $image.cropper(options)

  // 上传
  $('#btnChooseImg').on('click', function(){
    $('#file').click()
  })

  // 为文件选择绑定change事件
  $('#file').on('change', function(e){
    // 获取用户选择的文件
    const filelist = e.target.files
    if(filelist.length === 0) {
      return layer.msg('请选择图片！')
    }
    const file = filelist[0]
    // 利用URL中的createObjectURL()方法来为文件常见一个url地址
    const newImgURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域，在重新设置图片路径，之后再创建新的裁剪区域
    $image.cropper('destroy').attr('src', newImgURL).cropper(options)
  })
  // 为确定按钮绑定点击事件
  $('#btnUpload').on('click', function(){
    // 拿到用户裁剪后的头像
    // 将裁剪后的图片输出为base64格式的字符串
    // base64和直接用url地址指明图片的位置这两者效果是一样的，不过base64是一个长的字符串直接编码图片，浏览器不用再次发起请求，，而用url需要再次请求图片
    // 经过base64编码收的文件体积一般比原文件大30%左右
    // 所以在实际应用中，不适合将所有的图片都转为base64格式，对于一些小图片比较合适，但是对于一些大图片就不行了
    const dataURL = $image.cropper('getCroppedCanvas', {
      // 创建一个Canvas画布
      width: 100,
      height: 100
    }).toDataURL('image/png')//将Canvas画布上的内容转化为base64格式的字符串
    // 调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar:dataURL
      },
      success: function(res) {
        if(res.status !== 0){
          return layer.msg('用户头像更新失败！')
        }
        layer.msg('用户头像更新成功！')
        window.parent.getUserInfo()
      }
    }) 
  })


}) 