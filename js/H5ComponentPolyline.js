/* 折线图组件对象 */

var H5ComponentPolyline = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);

	//加入画布 canvas 画网格
	var w = cfg.width;
	var h = cfg.height;

	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;
	
	//水平网格线
	var step = cfg.step || 10;
	for(var i=0;i<step+1;i++){
		var y = h/step * i;
		var lattice_h = h/step;
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#c0c8d7';
		ctx.stroke();

		//画布背景颜色设置
		if(i%2==0){
			ctx.beginPath();
			ctx.moveTo(0,lattice_h*i);
			ctx.lineTo(w,lattice_h*i);
			ctx.lineTo(w,lattice_h*(i+1));
			ctx.lineTo(0,lattice_h*(i+1));
			ctx.fillStyle = '#d2e2ff';
			ctx.fill();
		}
	}
	
	//垂直网格线
	var data_l = cfg.data.length;
	for(var i=0;i<data_l+2;i++){
		var x = w/(data_l+1) *i;
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#c0c8d7';
		ctx.stroke();
	}
	component.append(can);

	//折线填充阴影单独一个画布
	var can = document.createElement('canvas');
	var ctx = can.getContext('2d');
	can.width = ctx.width = w;
	can.height = ctx.height = h;

	var lattice_w = w/(data_l+1);

	//画圆点 加圆点上面显示的百分数
	function polyAnimate(perc){
		ctx.clearRect(0,0,can.width,can.height);
		for(var i=0;i<data_l;i++){
			var per = cfg.data[i][1]*100>>0;
			x = lattice_w *i + lattice_w;
			y = h - h * cfg.data[i][1]*perc *(10/step);

			ctx.beginPath();
			ctx.arc(x,y,5,0,360);
			ctx.lineWidth = 4;
			ctx.fillStyle = '#ff725f';
			ctx.fill();
			
			//文字
			ctx.beginPath();
			ctx.fillStyle = '#000';
			ctx.fillText(per+'%',x-6,y-25);
			ctx.fill();
		}

		//画折线 填充阴影
		ctx.beginPath();
		ctx.moveTo(lattice_w,h - h * cfg.data[0][1]*perc *(10/step));
		for(var i=0;i<data_l;i++){
			var per = cfg.data[i][1]*100>>0;
			x = lattice_w *i + lattice_w;
			y = h - h * cfg.data[i][1]*perc *(10/step);
			ctx.lineTo(x,y);
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#ff725f';
		}
		ctx.stroke();
		ctx.lineTo(w-lattice_w,h);
		ctx.lineTo(lattice_w,h);
		ctx.lineWidth = 0;
		ctx.fillStyle = "rgba(233, 174, 178, 0.4)" ;
		ctx.fill();
	}

	//加数据 用DOM添加
	for(var i=0;i<data_l;i++){
		var text = $('<div class="text"></div>');
		text_w = lattice_w/2;
		text.text(cfg.data[i][0]);
		text.css('width',text_w).css('left',text_w*i + text_w - text_w/2).css('transition-delay',(1.5+i*0.3+'s'));

		component.append(text);
	}
	
	component.on('onLoad',function(){
		var s = 0;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s += 0.01;
				polyAnimate(s);
			},i*10+500);
		}
	});
	component.on('onLeave',function(){
		var s = 1;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s -= 0.01;
				polyAnimate(s);
			},i*10+500);
		}
	}); 

	component.append(can);
	
	

	return component;
}