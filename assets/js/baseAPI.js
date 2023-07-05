// 注意：每次调用$.get(),$.post(),$.ajax()之前都会预先调用ajaxPrefilter这个函数，
// 在这个函数中，可以拿到我们给Ajax提供的配置对象，所以可以利用其进行url地址的拼接，实现简化的目的
$.ajaxPrefilter(function(options){
  // 在真正的Ajax请求之前，同意拼接请求的url地址
  options.url = 'http://127.0.0.1:8080' + options.url
  console.log(options.url)

})