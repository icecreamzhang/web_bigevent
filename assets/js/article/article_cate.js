$(function(){
  const layer = layui.layer
  const form = layui.form
  let index = null
  initArticleCateList()

  

  // 发起ajax请求，获取文章分类信息
  function initArticleCateList(){
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res){
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        console.log(res)
        const htmlStr = template('tpl-table', res.data)
        $('tbody').html(htmlStr)
      }
    }) 
  }
  // 点击添加按钮弹出弹出层并填充信息
  $('#btnAddCate').on('click', function(e){
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      // 在此处设置弹出框的内容，但是直接在JS中写太麻烦，所以可以用模板字符串
      // 拿到其标签内的html结构然后再复制给content
      content: $('#dialog-add').html()
    })   
  })
  // 点击添加按钮添加文章分类信息
  // 由于这个表单时与添加的，所以直接将事件监听添加到该表单上这样是不会成功的
  // 可以使用事件委托的方式
  $('body').on('submit','#form-add', function(e){
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0) return layer.msg(res.message)
        layer.msg('添加文章类别成功')
        initArticleCateList()
        // 关闭弹出层
        layer.close(index)
      }
    })

  })
  // 点击编辑按钮，弹出编辑文章分类的弹出层，并发起ajax请求，向弹出层的输入框中添加文章分类信息
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function(e){
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '编辑文章分类',
      // 在此处设置弹出框的内容，但是直接在JS中写太麻烦，所以可以用模板字符串
      // 拿到其标签内的html结构然后再复制给content
      content: $('#dialog-edit').html()
    })
    
    const id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res){
        if(res.status !== 0) return layer.msg(res.message)
        // 快速为表单添加数据
        form.val('form-edit', res.data)
      }
    })
    
  })

  // 更新文章分类信息
  $('body').on('submit', '#form-edit', function(e){
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg('更新分类信息成功')
        initArticleCateList()
        layer.close(indexEdit)
      } 
    })
  })

  // 删除文章分类信息
  $('tbody').on('click', '.btn-delete', function(e){
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res){
          if(res.status !== 0){
            return layer.msg(res.message)
          }
          layer.msg('删除文章分类信息成功')
          initArticleCateList()
        }
      })
      
      layer.close(index);
    })
  })
})