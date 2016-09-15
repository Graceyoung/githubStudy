/* 饼图组件对象 */

var H5ComponentPie = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);

	// 加入画布 canvas 饼图  背景层
	var w = cfg.width;
	var h = cfg.height;
	
	// 底层
	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;
	component.append(can);
	
	// 设置圆心角
	var r = ((w<h||w==h) ? w/2 : h/2)*0.8;
	var r_x = w/2;
	var r_y = h/2;

	ctx.beginPath();
	ctx.arc(r_x,r_y,r,0,2*Math.PI);
	ctx.fillStyle = '#fff';
	ctx.fill();
	$(ctx).css('z-index',1);

	// 数据层
	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;
	component.append(can);
	$(ctx).css('z-index',2);

	var data_l = cfg.data.length;
	var r_deg = [];
	var deg = -0.5*Math.PI;

	for(var i=0;i<data_l;i++){
		r_deg.push(deg);

		deg -= (2*Math.PI)*cfg.data[i][1];
	}
	
	for(i=0;i<data_l;i++){
		var deg_end = (i+1) < data_l ? r_deg[i+1] : -2.5*Math.PI;
		ctx.beginPath();
		ctx.moveTo(r_x,r_y);
		ctx.arc(r_x,r_y,r,r_deg[i],deg_end,true);
		
		if(cfg.data[i][2]){
			ctx.fillStyle = cfg.data[i][2];
		}else{
			ctx.fillStyle = '#99c0ff';
		}
		
		ctx.fill();
	}
	
	// 加数据 用DOM添加
	var text_r;
	for(var i=0;i<data_l;i++){
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);
		component.append(text);

		var per = $('<div class="per"></div>');
		text.append(per);
		per.text((cfg.data[i][1]*100>>0)+'%');
		text_r = r+35;

		// 让数据显示在每段弧的中间点 +2*Math.PI*cfg.data[i][1]/2
		var x = r_x - text_r*Math.sin(-r_deg[i]-0.5*Math.PI+2*Math.PI*cfg.data[i][1]/2);
		var y = r_y - text_r*Math.cos(-r_deg[i]-0.5*Math.PI+2*Math.PI*cfg.data[i][1]/2);
		if(x>w/2){
			text.css('left', x/2);
		}else{
			text.css('right',(w-x)/2);
		}
		if(y>h/2){
			text.css('top',y/2);
		}else{
			text.css('bottom',(h-y)/2);
		}
		text.css('transition-delay',(1.5+i*0.3+'s'));
		
		component.append(text);
	}
	

	//加一个蒙板层
	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;
	component.append(can);
	$('can').css('z-index',3);

	/** 把要做动画的部分封装成一个函数
	 **  @param perc 0~1 从0~360度逐渐向外展开
	 **  没有return
	 **/
	function pieAnimate(per){
		ctx.clearRect(0,0,w,h);
		var sAngle = -0.5*Math.PI;
		var eAngle = - 2*Math.PI*per;
		var angle = sAngle + eAngle;
		
		ctx.beginPath();
		ctx.moveTo(r_x,r_y);
		ctx.arc(r_x,r_y,r+0.1,sAngle,angle,true);
		ctx.fillStyle = '#EAEAEA';
		ctx.fill();

		
		
	}
	pieAnimate(1);
	
	
	// 动画
	component.on('onLoad',function(){

		var s = 1;
		for(var i=0;i<=100;i++){
			setTimeout(function(){
				pieAnimate(s);
				s -= 0.01;
			},i*10+500);
		}
		
		var id = this.id;
		var text = $('.text','#'+id);
		compare(text);

		// 检测相交
		function compare(text){
			var willResort = [];
			for(var i=0;i<text.length;i++){
				var leftA = text[i].offsetLeft;
				if(text[i+1]){
					var shadowA_x = [text[i].offsetLeft,text[i].offsetLeft+text[i].offsetWidth];
					var shadowB_x = [text[i+1].offsetLeft,text[i+1].offsetLeft+text[i+1].offsetWidth];
					
					var shadowA_y = [text[i].offsetTop,text[i].offsetTop+text[i].offsetHeight];
					var shadowB_y = [text[i+1].offsetTop,text[i+1].offsetTop+text[i+1].offsetHeight];

					var intersect_x = (shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1])||
									  (shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1]);

					var intersect_y = (shadowA_y[0]>shadowB_y[0] && shadowA_y[0]<shadowB_y[1])||
									  (shadowA_y[1]>shadowB_y[0] && shadowA_y[1]<shadowB_y[1]);
					
					var result = intersect_x && intersect_y;
					if(result){
						if(willResort.length===0){
							willResort.push(i);
							willResort.push(i+1);
						}else{
							if(text[i+1]){
								willResort.push(i+1);
							}
						}
					}
				}
			}
			reset(willResort);
		}

		// 重排
		function reset(willResort){
			if(willResort.length>1){
				for(var i=0;i<willResort.length;i++){
					var element = text[willResort[i]];
					var step = 0;
					var height = text[willResort[1]].offsetHeight;
					var H5_width = $('.H5_component').width()/2;

					// 三个以内元素相交的重排
					if(i===0){
						step =(text[willResort[0]].offsetLeft>H5_width)?height:-height;
					}else if(i===2){
						step =(text[willResort[0]].offsetLeft>H5_width)?-height:height;
					}
					if($(element).css('top')!='auto'){
						$(element).css('top',element.offsetTop+step);
					}
					if($(element).css('bottom')!='auto'){
						$(element).css('bottom',element.offsetTop+step);
					}
				}
			}
		}

		


		
	});
	component.on('onLeave',function(){
		var s = 0;
		for(var i=0;i<=100;i++){
			setTimeout(function(){
				pieAnimate(s);
				s += 0.01;
			},i*10+500);
		}
	}); 

	return component;
}

// 重排项目文本元素
/*
H5ComponentPie.resort = function(list){
	// 相交检测
	var compare = function(domA,domB){
		//var offsetA = $(domA).offset();
		//var offsetB = $(domB).offset();

		//var shadowA_x = [offsetA.left,offsetA.left+$(domA).width()];
		//var shadowB_x = [offsetB.left,offsetB.left+$(domB).width()];
		
		//var shadowA_y = [offsetA.top,offsetA.top+$(domA).height()];
		//var shadowB_y = [offsetB.top,offsetB.top+$(domB).height()];

		var shadowA_x = [domA.offsetLeft,domA.offsetLeft+domA.offsetWidth];
		var shadowB_x = [domB.offsetLeft,domB.offsetLeft+domB.offsetWidth];
		
		var shadowA_y = [domA.offsetTop,domA.offsetTop+domA.offsetHeight];
		var shadowB_y = [domB.offsetTop,domB.offsetTop+domB.offsetHeight];

		var intersect_x = (shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1])||
						  (shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1]);

		var intersect_y = (shadowA_y[0]>shadowB_y[0] && shadowA_y[0]<shadowB_y[1])||
						  (shadowA_y[1]>shadowB_y[0] && shadowA_y[1]<shadowB_y[1]);
		console.log(intersect_x+':'+intersect_y);
		return intersect_x && intersect_y;
	}

	// 错开重排
	var reset = function(domA,domB){
		if($(domA).css('top')!='auto'){
			$(domA).css('top',$(domA).offset().top+$(domA).height());
		}
		if($(domA).css('bottom')!='auto'){
			$(domA).css('bottom',$(domA).offset().top+$(domA).height());
		}
	}

	// 定义要重排的元素
	var waitReset = [list[0]];

	// 重排检定
	for(var i=0;i<list.length;i++){
		if(compare(waitReset[waitReset.length-1],list[i])){
			waitReset.push(list[i]);
		}
	}
	console.log(waitReset);
	//$.each(list,function(i,dom){
	//	if(compare(waitReset[waitReset.length-1],dom)){
	//		waitReset.push(dom);
	//	}
	//});
	
	if(waitReset.length>1){
		$.each(waitReset,function(i,domA){
			if(waitReset[i+1]){
				reset(domA,waitReset[i+1]);
			}
		});
		H5ComponentPie.resort();
	}
}
*/