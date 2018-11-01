//common.js

if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
//	window.location.href = "index.html";
} else {
//	 window.location.href = "PC.html";
}

/*提交用户信息获取验证码*/
var flag = true;
var codeStatus = false;
function getCode(obj) {
	if($('.phoneInput').val() == ''){
		layer.open({type:'msg',skin: 'msg',content: '请填写手机号码！',time: 1});
	}else if($('.phoneInput').val().replace(/0*(\d*)/,"$1") == ''){
		layer.open({type:'msg',skin: 'msg',content: '电话号码格式不正确！',time: 1});
	}else if(!isRightPhoneNumber($('.phoneInput').val())){
		layer.open({type:'msg',skin: 'msg',content: '电话号码格式不正确！',time: 1});
	}else if(flag){
		flag = false;
    //loading层
		var loading = layer.open({type: 2});
		// 验证码请求
		AjaxGet("user/get/verificationcode/" + $('.phoneInput').val().replace(/0*(\d*)/,"$1"),
			function(data){
				console.log('获取验证码',data);
	    	codeStatus = true;
	    	if(data.code == 20019){
	    		layer.close(loading);	// 关闭loading加载
	    		layer.open({type:'msg',skin:'msg',content:'今日已达上限！',time: 1});
	    		flag = true;
	    	}else if(data.code == 200){
					console.log('已中奖',data.data);
					layer.close(loading);	// 关闭loading加载
					layer.closeAll(); 		// 如果已中奖 关闭信息提交弹窗
					layer.open({type:'msg',skin:'msg',content:'您已中奖！',time: 1});
					localStorage.prizePhone = data.data.userPhone;
					localStorage.prizeName = data.data.prizeName;
					viewDetails.getlocal();		// 刷新查看详情页面
					$('.viewDetails').show();
					flag = true;
	    	}else if(data.code == 20021){
	    		settime(obj); // 倒计时
	    		flag = true;
	    		layer.close(loading);		// 关闭loading加载
	    	}
	    }
		)
	}
}

//注册获取验证码
function getCodeRegister(obj){
	if($('.regPhone').val() == ''){
		layer.msg('手机号码未填写！',{time:1000});
	}else if(!isRightPhoneNumber($('.regPhone').val())){
		layer.msg('电话号码格式不正确！',{time:1000});
	}else if(flag){
		settime(obj); // 倒计时
		flag = false;
		// 验证码请求
		AjaxGet("user/get/verificationcode/" + $('.regPhone').val().replace(/0*(\d*)/,"$1"),
			function(data){
	    	console.log('获取注册验证码',data);
	    	codeStatus = true;
	    	if(data.code == 20019){
	    		layer.msg('今日已达上限！',{time:1000});
	    	}else if(data.code == 30015){
	    		layer.msg('验证码错误！',{time:1000});
	    	}else if(data.code == 200){flag = true;}
	    }
		)
	}
}

// 获取验证码倒计时
var countdown = 60;
var setTime;
function settime(obj) {
  if (countdown == 0) {
    $(obj).removeAttr("disabled");
    $(obj).text("获取验证码");
    countdown = 60;
    return;
  } else {
    $(obj).attr("disabled", true);
    $(obj).text(countdown +'s'+'后重发');
    countdown--;
  }
  setTime = setTimeout(function () {
    settime(obj);
  }, 1000)
}

// 去除左边空格
function space(v){
	$(v).val($(v).val().replace(/^\s+/,''));
}

// 手机号码验证
function isRightPhoneNumber(str) {
	if(str.length == 8 || str.length == 9 || str.length == 10){
		return true;
	}else{
		return false;
	}
}
