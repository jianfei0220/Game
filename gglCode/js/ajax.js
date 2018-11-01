//封装ajax
function AjaxRequest(url,type,data,success,error){
//	var Aurl = 'http://192.168.1.239:7010/game/' + url;
	var Aurl = 'http://www.fortune-sun.com:7010/game/' + url;
	var type = type || 'post';									// 请求类型
	var headers = {tokenstring:localStorage.tokenStr,userid:localStorage.userkey} || null;
	var success = success || function(data){		// 请求成功
		console.log('请求成功！',data);
	}
	
	var error = error || function(data){				// 	请求失败
		console.log('请求失败！',data);
		setTimeout(function () {
      if(data.code == 404){
        layer.msg('请求失败，请求未找到');
      }else if(data.code == 503){
        layer.msg('请求失败，服务器内部错误');
      }else {
        layer.msg('请求失败,网络连接超时');
      }
  	},500);
	}

	$.ajax({
		type:type,
		url:Aurl,
		data:data,
		headers:headers,
		contentType: 'application/json',
		success:success,
		error:error
	});
}

// ajax提交(get方式提交)
function AjaxGet(url,success) {
  AjaxRequest(url,'get',{},success);
}

// ajax提交(post方式提交)
function AjaxPost(url,data,success) {
  AjaxRequest(url,'post',data,success);
}
