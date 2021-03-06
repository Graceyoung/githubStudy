/* 雷达图组件对象 */

var H5ComponentRadar = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);

	//加入画布 canvas 雷达图背景层
	var w = cfg.width;
	var h = cfg.height;

	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;
	
	
	//雷达图背景层
	var data_l = cfg.data.length;
	
	//设置圆心角
	var r = max_r = (w<h||w==h) ? w/2 : h/2;
	var min_r = max_r/data_l;
	var r_x = w/2;
	var r_y = h/2;
	
	var all_x = [];
	var all_y = [];
	for(var j=0;j<data_l;j++){
		var x = [];
		var y = [];
		for(var i=0;i<data_l;i++){
			var r_deg = (2*Math.PI/360)*(360/data_l)*i;
			x.push(r_x - r*Math.sin(r_deg));
			y.push(r_y - r*Math.cos(r_deg));
		}

		//all_x[[x1,x2,x3,x4,x5],[x1,x2,x3,x4,x5],[x1,x2,x3,x4,x5],[x1,x2,x3,x4,x5],[x1,x2,x3,x4,x5]]
		all_x.push(x);
		all_y.push(y);
		r -= min_r;
		
		ctx.beginPath();
		ctx.moveTo(all_x[j][0],all_y[j][0]);
		for(var k=1;k<data_l;k++){
			ctx.lineTo(all_x[j][k],all_y[j][k]);
		}
		ctx.lineWidth = 4;

		//填充背景色
		if(j%2==0){
			ctx.fillStyle = '#99c0ff';
		}else{
			ctx.fillStyle = '#f1f9ff';
		}
		ctx.fill();
	}

	
	for(j=0;j<data_l;j++){
		//骨架
		ctx.beginPath();
		ctx.moveTo(r_x,r_y);
		ctx.lineTo(all_x[0][j],all_y[0][j]);
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#e0e0e0';
		ctx.stroke();
	}
	component.append(can);

	//圆圈 连线 做动画 创建了一个单独的画布
	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;

	
	

	/** 把要做动画的部分封装成一个函数
	 **  @param perc 0~1 从圆心点逐渐向外展开
	 **  没有return
	 **/
	function radarAnimate(perc){
		var per_x = [],per_y = [];

		ctx.clearRect(0,0,w,h);

		//圆圈
		for(j=0;j<data_l;j++){
			var per_r = max_r * cfg.data[j][1] *perc;
			r_deg = (2*Math.PI/360)*(360/data_l)*j;
			x = r_x - per_r*Math.sin(r_deg);
			y = r_y - per_r*Math.cos(r_deg);
			per_x.push(x);
			per_y.push(y);
			ctx.beginPath();
			ctx.arc(x,y,6,0,360);
			ctx.fillStyle = '#ff7676';
			ctx.fill();
		}
		
		// 连线
		ctx.beginPath();
		ctx.moveTo(per_x[0],per_y[0]);
		for(i=1;i<data_l;i++){
			ctx.lineTo(per_x[i],per_y[i]);
		}
		ctx.lineTo(per_x[0],per_y[0]);
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ff7676';
		ctx.stroke();

		// 添加百分数 显示
		for(i=0;i<data_l;i++){
			var gap;
			if(r_deg<(2*Math.PI/360)*180){
				gap = -10;
			}else{
				gap = 10;
			}
			
			ctx.fillStyle = '#000';
			ctx.font = '20px Arial';
			ctx.fillText(cfg.data[i][1]*100+'%',per_x[i]+gap,per_y[i]+gap);
		}
	}
	component.append(can);

	// 加数据 用DOM添加
	for(var i=0;i<data_l;i++){
		var text = $('<div class="text"></div>');
		//text_w = lattice_w/2;
		text.text(cfg.data[i][0]);
		
		var text_r = max_r + 40;
		r_deg = (2*Math.PI/360)*(360/data_l)*i;
		x = r_x - text_r*Math.sin(r_deg);
		y = r_y - text_r*Math.cos(r_deg);
		text.css('left',x/2+'px').css('top',y/2+'px').css('transition-delay',(1.5+i*0.3+'s'));
		
		component.append(text);
	}
	
	

	//动画
	component.on('onLoad',function(){
		var s = 0;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s += 0.01;
				radarAnimate(s);
			},i*10+500);
		}
	});
	component.on('onLeave',function(){
		var s = 1;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s -= 0.01;
				radarAnimate(s);
			},i*10+500);
		}
	}); 
	
	
	

	return component;
}