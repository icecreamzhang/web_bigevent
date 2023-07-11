$(function(){
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage;

  // 定义一个过滤时间的过滤器
  template.defaults.imports.dataFormat = function(date){
    const dt = new Date(date)

    const y = dt.getFullYear()
    const m = padZero(dt.getMonth() + 1)
    const d = padZero(dt.getDate())
    

    const hh = padZero(dt.getHours())
    const mm = padZero(dt.getMinutes())
    const ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  // 补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }


  // 定义一个查询的参数对象,将来请求数据的时候需要将该对象提交给服务器 
  let q = {
    pageNum : 1, //默认请求第一页的数据
    pageSize: 2, //默认每页两条数据
    cate_id: '', //文章分类默认为空
    state: '', //文章状态默认为空
  }
  initTable()
  initCate()

  // 获取文章列表信息
  function initTable(){
    $.ajax({
      mehtod: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res){
        if(res.status !== 0) return layer.msg(res.message)
        // 获取数据后对其进行渲染
        const htmlStr = template('init-table', res.data)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法，获取第几页的信息然后进行渲染
        renderPage(res.total)

      }
    })
  }

  // 获取文章分类
  function initCate(){
    $.ajax({
      mehtod: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        const htmlStr = template('tpl-cate', res.data)
        $('.layui-form [name=cate_id]').html(htmlStr)
        // 由于layui的渲染机制造成数据没有被填充，（加载layui.js文件对select选择框进行渲染，但是此时没有选择项所以没有选项，然后又加载自己的js文件，对select选择框使用模板字符串进行渲染，但是此时layui的渲染已经执行完毕，所以选择项不会显示到页面上）
        // 可以使用form.render()进行重新渲染
        form.render()
      } 
    })
  }

  // 实现筛选功能
  $('#form-search').on('submit', function(e){
    // 阻止默认提交行为
    e.preventDefault()
    // 获取表单中选中的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()
    // 为查询参数对性进行赋值
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total){
    // 调用laypage.render()方法来渲染分页结构
    laypage.render({
      elem: 'pageBox',  //分页容器的id
      count: total,  //总数据条数
      limit: q.pageSize,   //每页有多少条数据
      curr: q.pageNum,   //默认起始页
      // 在页面上显示的数据取决于数组中的数据
      layout: ['count', 'limit','prev', 'page', 'next', 'skip'],
      limits: [1,2,3,5,10],
      // 分页发生切换的时候触发
      // 触发jump 回调的方式有两种
      // 1、点击页码的时候会触发jump回调
      // 2、只要调用了laupage.render()方法就会触发jump回调
      jump: function(obj, first){
        // 可以通过first值来潘通是通过哪种方式来触发的回调
        // 如果为true则为方式二触发的，此时不能进行涉及laypage.render()的回调函数的操作，否则会导致死循环
        // 否则为第一种方式触发
        // console.log(first)
        // console.log(obj.curr)
        // 将最新的页码值赋值给q的当前页
        q.pageNum = obj.curr
        // 把最新的条目数赋值到q上
        q.pageSize = obj.limit
        // 根据最新的q进行渲染
        // 不能直接回调，否则会发生死循环
        // initTable()
        if(!first){
          initTable()
        }
      }

    })
  }

  // 根据id删除
  $('tbody').on('click', '#btn-delete', function(){
    let len = $('tbody #btn-delete').length
    // console.log($(this).attr('data-id'))
    const id  = +$(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        mehtod: 'GET',
        url: '/my/article/delete/'+id,
        success: function(res){
          if(res.status !== 0) return layer.msg(res.message)
          layer.msg('删除成功')  //此时页码值还没有改变，
          // 如果此时该页已经没有数据了，那么再进行渲染该页的数据就会发生bag,即就会导致页码值虽然变了，但是页面的内容是没有的
          // 所以要先对页码值进行减一的操作，这样就会渲染出对应页面的内容
          // 当数据删除完成后需要进行判断该页面是否还有数据，如果有数据则页码值不进行任何操作
          // 如果已经没有数据了，就需要对页码值进行减一的操作了
          // 再重新调用initTable（）方法
          if(len === 1){
            q.pageNum = q.pageNum === 1 ? 1 : q.pageNum - 1
          }
          initTable()
        }
      })
      
      layer.close(index);
    })
  })

  // 根据id修改文章信息
 $('tbody').on('click', '#btn-editor', function(){
  const id = $(this).attr('data-id')
  location.href = '/big_event/article/article_edit.html?id='+id
 })
})