/* 饼图组件对象 */

var H5ComponentRadar = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);

	//加入画布 canvas 饼图  背景层
	var w = cfg.width;
	var h = cfg.height;

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
		ctx.arc(r_x,r_y,r+1,sAngle,angle,true);
		ctx.fillStyle = '#fff';
		ctx.fill();
	}
	pieAnimate(1);
	
	//加数据 用DOM添加
	
	for(var i=0;i<data_l;i++){
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);
		component.append(text);

		var per = $('<div class="per"></div>');
		text.append(per);
		per.text((cfg.data[i][1]*100>>0)+'%');
		r = r+5;
		var x = r_x - r*Math.sin(-r_deg[i]-0.5*Math.PI);
		var y = r_y - r*Math.cos(-r_deg[i]-0.5*Math.PI);
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
	
	//动画
	
	component.on('onLoad',function(){
		var s = 1;
		for(var i=0;i<=100;i++){
			setTimeout(function(){
				pieAnimate(s);
				s -= 0.01;
			},i*10+500);
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