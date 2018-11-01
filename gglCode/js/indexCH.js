$(function() {
  	var $canvas = $("#canvas"),//canvas
    clientWidth = document.documentElement.clientWidth,
		// canvasWidth = Math.floor(clientWidth * 562 / 750),//canvas宽 = 屏幕宽 * 设计稿里canvas宽 / 750
		// canvasHeight = Math.floor(clientWidth * 308 / 750),//canvas高 = 屏幕宽 * 设计稿里canvas高 / 750
    canvasWidth = Math.floor(clientWidth * 380 / 750),//canvas宽 = 屏幕宽 * 设计稿里canvas宽 / 750
    canvasHeight = Math.floor(clientWidth * 214 / 750),//canvas
        
    ctx = $canvas[0].getContext("2d"),// 获取canvas的2d绘制对象
    $canvasMask = $("#canvas-mask"),// canvas遮罩层
    $btn = $("#btn"),//刮奖按钮
    $change = $("#change"),//剩余次数
    data = {count: 3},//次数
    empty = false,
    bool = false;//判断是否按下去，true为按下，false未按下

    //canvas初始化
    init();

    function init() {
      $canvasMask.show();
      $change.html(data.count);//显示剩余次数
      //设置canvas宽高
      $canvas.attr('width', canvasWidth);
      $canvas.attr('height', canvasHeight);

      //canvas绘图
      ctx.beginPath();
      ctx.fillStyle = '#999';//刮刮乐图层的填充色
      ctx.lineCap = "round";//绘制的线结束时为圆形
      ctx.lineJoin = "round";//当两条线交汇时创建圆形边角
      ctx.lineWidth = 20;//单次刮开面积
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.closePath();

      ctx.globalCompositeOperation = 'destination-out';//新图像和原图像重合部分变透明
      //下面3行代码是为了修复部分手机浏览器不支持destination-out
      $canvas.css("display", "none");
      $canvas.outerHeight();
      $canvas.css("display", "inherit");
    }
    
    // 定义全局变量 便于提交获奖信息使用
    var phoneNumber='';
    var userName='';
    var prizeName='';
    var prizeId='';
    //点击开始刮奖按钮
    $btn.click(function () {
		  layer.open({
		    btn: ['提交', '关闭'],
		    time:0,
		    shadeClose:false,
		    content:
	    			 '<div class="userNameDiv">'
	  			+  '<label for="nameInput">用户名:</label>'
	  			+  '<input class="nameInput" name="nameInput" id="nameInput" type="text" value="" onkeyup="space(this)" placeholder="请输入用户名">'
	  			+  '</div>'
	  			+  '<div class="phoneDiv">'
	  			+  '<label for="phoneInput">手机号:</label>'
	  			+  '<input class="phoneInput" name="phoneInput" id="phoneInput" type="number" pattern="[0-9]*" value="" placeholder="请输入手机号号码">'
				  +  '</div>'
				  
	  			+  '<div class="verifyDiv" style="position:relative;">'
	  			+  '<label for="verifyCode">验证码:</label>'
	  			+  '<input class="verifyInput" name="verifyInput" id="verifyInput" maxlength="6" type="number" pattern="[0-9]*" placeholder="验证码">'
	  			+  '<button type="button" onclick="getCode(this)" class="codeBtn" style="position:absolute;right:24px;top:14px;z-index:99999;">获取验证码</button>'
				  +  '</div>',
				yes: function(index){
			    phoneNumber = $('.phoneInput').val().replace(/0*(\d*)/,"$1");
					userName = $('.nameInput').val();

					var authCode = $('.verifyInput').val();
					if($('.phoneInput').val() ==''||userName =='' || authCode == ''){
						layer.open({type:'msg',skin: 'msg',content: '信息不能为空！',time: 1});
					}else if(!isRightPhoneNumber(phoneNumber)){
						layer.open({type:'msg',skin: 'msg',content: '电话号码格式不正确！',time: 1});
					}else if(authCode.length != 6){
						layer.open({type:'msg',skin: 'msg',content: '验证码格式不正确！',time: 1});
					}else if(!codeStatus){
						layer.open({type:'msg',skin: 'msg',content: '请获取验证码！',time: 1});
					}
					else{
						
						AjaxPost('userinfo',
							JSON.stringify({
              	userName:userName, 
              	userPhone:phoneNumber,
              	verificationCode:authCode
              }),
              function(data){
								console.log('提交玩家信息',data);
								if(data.code == 20005){
									layer.open({type:'msg',skin: 'msg',content: '不能重复抽奖！',time: 1});
								}else if(data.code == 200){
									layer.open({type:'msg',skin: 'msg',content: '提交成功！',time: 1});
									layer.close(index);		// 关闭弹窗
									$canvasMask.hide();		// 隐藏刮奖按钮

	    						// 清除倒计时
			  					clearTimeout(setTime);
			  					countdown = 60;
			  					
									//随机发奖
									AjaxGet('user/award/0',
										function(data){
											console.log('随机发奖',data);
											if(data.code == 10001){
												$canvas.css("background-image", 'url(image/prize/thanks.jpg)');  // 设定中奖图片
												$('#card .win').css("background-image", 'url(image/prize/thanks.jpg)');
												// 全局变量赋值  便于提交获奖信息使用
										    prizeName = 'thanks';
//										    prizeId = data.data._id;												
											}else{
												$canvas.css("background-image", 'url(image/prize/' + data.data.prizeName +'.jpg)');  // 设定中奖图片
												$('#card .win').css("background-image", 'url(image/prize/' + data.data.prizeName +'.jpg)');
												
												// 全局变量赋值  便于提交获奖信息使用
										    prizeName = data.data.prizeName;
										    prizeId = data.data._id;
										    
										    //	存下奖品名/获奖手机号,方便查看详情页使用
										    localStorage.prizeName = data.data.prizeName;
										    localStorage.prizePhone = phoneNumber;
											}

								    // 如果未中奖返回首页不进入详情页
								    if(prizeName == 'thanks'){
								    	$('#viewDetailsBtn').hide();
								    	$('#viewDetailsAnNiu').show();
								    }else{
								    	$('#viewDetailsBtn').show();
								    	$('#viewDetailsAnNiu').hide();
								    }

									})
								}else if(data.code == 30015){
					    		layer.open({type:'msg',skin: 'msg',content: '验证码错误！',time: 1});
					    	}else if(data.code == 20014){
					    		console.log("code",data.code);
					    		layer.open({type:'msg',skin: 'msg',content: '未获取验证码！',time: 1});
					    	}
              }
						)

					}
			  },
			  no:function(){
			  	clearTimeout(setTime);
			  	countdown = 60;
			  }
			})
		})


    /*canvas事件*/
    //pc端
    $canvas.on({
        //鼠标按下
        mousedown: function (e) {
            e = e || window.event;
            e.preventDefault();
            bool = true;
            var x = e.pageX - $(this).offset().left,//鼠标距离该页面left的值 - 元素左侧距离文档的left
                y = e.pageY - $(this).offset().top;
            ctx.moveTo(x, y);

            //鼠标移动
            $canvas.on('mousemove', function (e) {
                if (bool) {
                    var x = e.pageX - $(this).offset().left;
                    var y = e.pageY - $(this).offset().top;
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    clear();
                }
            });
        },
        //鼠标按键抬起
        mouseup: function () {
            bool = false;
        }
    });

    //移动端
    $canvas.on("touchstart", function (e) {
        e = e || window.event;
        e.preventDefault();
        if (typeof e.touches !== 'undefined') {
            e = e.touches[0];//获取触点
        }
        var x = e.pageX - $(this).offset().left,
            y = e.pageY - $(this).offset().top;
        ctx.moveTo(x, y);
        //touchmove事件
        $canvas.on('touchmove', eventMove);
    });

    //移动事件
    function eventMove(e) {
      e = e || window.event;
      e.preventDefault();
      if (typeof e.touches !== 'undefined') {
        e = e.touches[0];
      }
      var x = e.pageX - $(this).offset().left,
          y = e.pageY - $(this).offset().top;
      ctx.lineTo(x, y);
      ctx.stroke();
      clear();
    }

    //清除画布
    function clear() {
      if (empty) return;
      var data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data,//得到canvas的全部数据
      half = 0;

      //length = canvasWidth * canvasHeight * 4，一个像素块是一个对象rgba四个值，a范围为0~255
      for (var i = 3, length = data.length; i < length; i += 4) {//因为有rgba四个值，下标0开始，所以初始i=3
        data[i] === 0 && half++;//存在imageData对象时half加1  PS:该像素区域透明即为不存在该对象
      }
      //当刮开的区域大于等于60%时，则可以开始处理结果
      if (half >= canvasWidth * canvasHeight * 0.5) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);//清空画布
        empty = true;
        win();//调用中奖信息
        
				// 提交获奖名单
				AjaxPost('user/award/1',
					JSON.stringify({
						prizeName:prizeName,
						prizeId:prizeId,
						userPhone:phoneNumber,
						userName:userName
	        }),
					function(data){
	        	console.log('提交获奖名单',data);
	        }
				)
      }
    }

    //中奖信息弹窗
    $("#close,.win,.btn").click(function () {
      empty = false;
      init();
    });
});




var $maskRule = $("#mask-rule"),			// 规则遮罩层
    $mask = $("#mask"),								// 红包遮罩层
    $winning = $(".winning"),					// 红包
    $card = $("#card"),
    $close = $("#close");
    
// 规则弹窗
$(".ruleIcon").click(function () {
    $maskRule.show();
});
// 关闭规则弹窗
$("#close-rule").click(function () {
    $maskRule.hide();
});

/*中奖信息提示*/
function win() {
    //遮罩层显示
    $mask.show();
    $winning.addClass("reback");
    setTimeout(function () {
      $card.addClass("pull");
    }, 500);

    //关闭弹出层
    $("#close,.win,.btn").click(function () {
      $mask.hide();
      $winning.removeClass("reback");
      $card.removeClass("pull");
    });

    $('#viewDetailsBtn').click(function(){
    	$('.viewDetails').show(); // 显示查看详情页
    	viewDetails.getlocal();
    })
}


	//ios加载后音乐不会自动播放问题
	//创建页面监听，等待微信端页面加载完毕 触发音频播放
	document.addEventListener('DOMContentLoaded', function () {
	    function audioAutoPlay() {
	        var audio = document.getElementById('myAudio');
	            audio.play();
	        document.addEventListener("WeixinJSBridgeReady", function () {
	            audio.play();
	        }, false);
	    }
	    audioAutoPlay();
	});
	
	
	// 音频 暂停/播放
	$(function(){
	 var oAudio=document.getElementById('myAudio');
	  	 oAudio.play();
		 $('.player-button').click(function(){
			 if(oAudio.paused){       //paused 属性返回音频/视频是否已暂停。true 指示音频/视频已暂停。否则为 false。
		  		 oAudio.play();
				 $('.player-button').addClass("Rotation");
				 $('.player-button').css('background-image','url(image/musicOn.png)')
			 }
			 else{
				 oAudio.pause();
				 $('.player-button').removeClass("Rotation");
				 $('.player-button').css('background-image','url(image/musicOff.png)')
			 }
		 })
	})