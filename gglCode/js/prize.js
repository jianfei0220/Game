//main.js
new Vue({
  el: '#app',
  data: {
  	adminName:'管理员姓名',
  	adminPhone:'管理员手机号',
  	
    prizeName:'奖品名',
    status:'审核状态',
    userPhone:'获奖号码',
    userName:'获奖姓名',
    
    takePartTotal:'0',
    prizeTotal:'0',
    acceptPrize:'0',
    tokenVerify:''
    
  },
  created(){
		if(localStorage.tokenStr != undefined){
	  	// 判断是否存在token
			this.searchToken();
		}else{
			window.location.href="login.html";
		}
		
		this.getData();
  	this.adminName = localStorage.userName;
  	this.adminPhone = localStorage.userPhone;
  },
  methods:{
  	// 验证token
  	searchToken:function(){
			AjaxGet("user/get/verificationcode/token",function(data){
				console.log('验证token!',data);
				if(data.code != 200){
					window.location.href="login.html";
				}
			})
  	},
  	// 获取参与人数/中奖人数/领取人数
  	getData:function(){
  		var self = this;
			AjaxGet('user/get/prize/participation/received',function(data){
				console.log('获取参于人数/中奖人数/领取人数！',data);
				self.takePartTotal = data.data.participationCount;
				self.prizeTotal = data.data.winningCount;
				self.acceptPrize = data.data.acquireCount;
			})
  	},
  	// 刷新数据
		refresh:function(){
			this.getData();
			layer.msg('刷新成功！',{time:1000});
		},
		logout:function(){
			window.location.href="login.html";
			layer.msg('退出成功！',{time:1000});
		},
		// 设置奖项
		setPrize:function(){
			window.location.href="setPrize.html";
		},
  	// 查询获奖号码
  	searchClick:function(){
  		var self = this;
  		if($('.searchCode').val() == ''){
  			layer.msg('兑奖码不能为空！',{time:1000})
  		}else{
				AjaxGet("/user/get/phone/" + $('.searchCode').val().replace(/0*(\d*)/,"$1"),
				function(data){
			  	console.log('查询兑奖码',data);
			  	if(data.code == 10001){
			  		layer.msg('未查询到该兑奖码，请重新核实后输入！',{time:1000});
			  	}else if(data.code == 200){
						$('.searchContentBox').show();
						// 如果奖品名为thanks,显示未中将.否则,显示奖品名
						if(data.data.prizeName == 'thanks'){
							self.prizeName = '未中奖';
							self.status = data.data.status = '未中奖';
							$('.destroy').css('visibility','hidden');
						}else{
							self.prizeName = data.data.prizeName;
							self.status = data.data.status == 0 ? '未核销' : '已核销';
							$('.destroy').css('visibility','visible');
						}
					
				  	self.userPhone = data.data.userPhone;
				  	self.userName = data.data.userName;
				  	
				  	// 判断是否核销,决定核销按钮显示隐藏
				  	if(data.data.status == 0){
				  		$('.destroy').show();
				  	}else if(data.data.status == 1){
				  		$('.destroy').hide();
				  	}
				  	$('.searchCode').val(''); 	// 查询兑奖码后清空表单
			  	}
				})
  		}
  	},
  	// 核销事件
  	destroyClick:function(){
  		self = this;
			AjaxGet("/user/set/prize/status/" + this.userPhone.replace(/0*(\d*)/,"$1"),
			function(data){
				console.log('核销奖品',data);
		  	layer.msg('核销成功！');
		  	self.status = '已核销';
		  	$('.destroy').hide(); 	// 隐藏核销按钮
		  	self.getData();		  		// 刷新已领奖人数
			});
  	}
  	
  }
})