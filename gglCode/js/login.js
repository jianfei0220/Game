$(function(){
	//	去注册
	$('.goRegister').click(function(){
		$('.login').hide();
		$('.register').show();
	})
	
	// 返回登录
	$('.goBack').click(function(){
		$('.login').show();
		$('.register').hide();
	})
	
	// 登录
	$('.loginBtn').click(function(){
		var userName = $('.loginPhone').val().replace(/0*(\d*)/,"$1");;
		var userPsd  = $('.loginPsd').val();
		
		AjaxPost('login',
			JSON.stringify({
		    userPhone:$('.loginPhone').val(),
		    userPassword:$('.loginPsd').val()
	    }),function(data){
	    	console.log('登录',data);
				if(data.code == 200){
	    		layer.msg('登录成功！',{time:1000});
	    		localStorage.setItem('tokenStr',data.data.tokenStr);
	    		localStorage.setItem('userkey',data.data._id);
	    		localStorage.setItem('userName',data.data.userName);
	    		localStorage.setItem('userPhone',data.data.userPhone);
	    		window.location.href="prize.html";  // 正确登录后页面跳转
	    	}else if(data.code == 20018){
	    		layer.msg('该号码未激活，请联系管理员激活！',{time:1000});
	    	}else if(data.code == 20006){
	    		layer.msg('该号码未注册！',{time:1000})
	    	}else if(data.code == 30028){
	    		layer.msg('密码错误，请重新输入！',{time:1000})
	    	}
	    }
		)
		
	})
	
	// 注册
	$('.registerBtn').click(function(){
		if($('.regName').val() == '' || $('.regPhone').val() == '' || $('.regPsd').val() == '' || $('.regPsdTwo').val() == '' || $('.regCode').val() == ''){
			layer.msg('不能为空！',{time:1000});
		}else if(!isRightPhoneNumber($('.regPhone').val())){
			layer.msg('电话号码格式不正确！',{time:1000});
		}else if($('.regPsd').val() != $('.regPsdTwo').val()){
			layer.msg('两次密码不相同，请重新输入！',{time:1000});
		}else if($('.regPsd').val().length < 6 || $('.regPsdTwo').val().length < 6){
			layer.msg('密码至少设置6位！',{time:1000});
		}else if($('.regCode').val().length != 6){
			layer.msg('验证码格式不正确！',{time:1000});
		}else if(!codeStatus){
			layer.msg('请获取验证码！',{time:1000});
		}else{
			AjaxPost('register',
				JSON.stringify({
		    	userName:$('.regName').val(),
		    	userPhone:$('.regPhone').val().replace(/0*(\d+)/,"$1"),
		    	userPassword:$('.regPsd').val(),
		    	verificationCode:$('.regCode').val()
		    }),
				function(data){
					console.log('注册',data);
		    	if(data.code == 20005){
		    		layer.msg('该账号已注册！',{time:1000});
		    	}else if(data.code === 200){
		    		layer.msg('注册成功！',{time:1000});
		    		$('.login').show();
						$('.register').hide();
		    	}else if(data.code == 30015){
		    		layer.msg('验证码错误！',{time:1000});
		    	}
				}
			);
		}
	})

})
