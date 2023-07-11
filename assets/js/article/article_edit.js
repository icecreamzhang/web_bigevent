$(function(){
  const layer = layui.layer
  const form = layui.form
   // 获取上一个页面传递过来的查询数据
   const id = window.location.search.substring(4)
   console.log(id)
  initCate()
  // 获取文章分类信息
  function initCate(){
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res){
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        // 模板引擎
        const htmlStr = template('tpl-addArticle', res.data)
        $('[name=cate_id]').html(htmlStr)
        // 由于layui的渲染机制造成数据没有被填充，（加载layui.js文件对select选择框进行渲染，但是此时没有选择项所以没有选项，然后又加载自己的js文件，对select选择框使用模板字符串进行渲染，但是此时layui的渲染已经执行完毕，所以选择项不会显示到页面上）
        // 可以使用form.render()进行重新渲染
        form.render()
      }
    })
  }

  initEditor()

  // 初始化图片裁剪器
  const $image = $('#image')
  // 裁剪选项
  const options = {
    // 指定宽高比例
    aspectRatio: 400 / 280,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 初始化裁剪区域
  $image.cropper(options)
  
  // 更换裁剪图片
  // 在页面中添加了一个文件选择框，可以通过点击更换按钮来模拟点击文件选择框狂
  $('#checkImg').on('click', function(){
    $('#coverfile').click()
  })
  // 由于选择文件之后，图片会发生改变，所以监听文件选择框中的change 事件，
  $('#coverfile').on('change', function(e){
    // 拿到用户选择的文件
    const file = e.target.files[0]
    // 根据选择的文件船舰一个url地址
    const newImageURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区，在重新设置图片路径，之后再创建新的裁剪区域
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImageURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义发布状态
  let article_state = '已发布'
  $('#btnSave2').on('click', function(e){
    article_state = '草稿'
  })

  // 为表单初始化数据
  $.ajax({
    method: 'GET',
    url: '/my/article/'+id,
    success: function(res){
      if(res.status !== 0) return layer.msg('获取文章信息失败')
      layer.msg('获取文章信息成功')
      console.log(res)
      form.val('form-edit', res.data[0])
    }
  })

  // 为表单绑定submit事件
  $('#form-pub').on('submit', function(e){
    e.preventDefault()
    // 基于form表单快速创建一个formData对象
    const fd = new FormData($(this)[0])
    fd.append('state', article_state)
    // 将裁剪后的图片输出为文件
    $image.cropper('getCroppedCanvas',{  //创建一个Canvas画布
      width: 400,
      height: 280
    }).toBlob(function(blob){//将画布上的内容转化为文件对象
      // 得到文件对象后进行后续的操作
      // 调用toBlob就可以将图片输出为文件，其中blob就是该文件
      console.log(blob)
      fd.append('cover_img',blob)
      fd.append('id', id)
      
      // 发起ajax请求
      publishArticle(fd)
    })
  })
  function publishArticle(fdata){
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fdata,
      // 注意：如果向服务器提交的是formData格式的数据
      // 必须要添加一下两个配置项
      contentType : false, 
			processData : false,
      success: function(res){
        if(res.status !== 0) return layer.msg(res.message)
        layer.msg('文章跟新成功')
        // 发布文章成功后跳转
        location.href = '/big_event/article/article_list.html'
      }
    })
  }

  
})