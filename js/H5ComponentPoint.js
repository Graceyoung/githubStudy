/* 散点图组件对象 */

var H5ComponentPoint = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);

	var base = cfg.data[0][1];//以第一个数据的比例为参考的 看作100%
	
	$.each(cfg.data,function(index,item){

		//创建散点
		var point = $('<div class="point point_'+index+'"></div>');
		
		//每个散点图宽高的比例，较第一个数据的比例而言
		var whper = (item[1]/base*100)+'%';

		point.width(whper).height(whper);//设置散点图的宽高
		point.css('z-index',cfg.data.length-index);//point的层次显示
		

		if(item[2]){

			point.css('background-color',item[2]);

		}

		// 将要做动画的point设置在中心点，从中心点向外运动
		if(item[3]!=undefined && item[4]!=undefined){
			point.css('margin',cfg.height*(1-item[1]/base)/4+'px '+cfg.width*(1-item[1]/base)/4+'px');
		}

		//放文字的框框，一个大框，一个小框
		var name = $('<div class="name"></div>');
		var per = $('<div class="per"></div>');
		name.text(item[0]);
		per.text(item[2]);

		name.append(per);
		point.append(name);
		component.append(point);
	});

	function pointAnimate(per){
		$.each(cfg.data,function(index,item){
			if(item[3]!=undefined && item[4]!=undefined){
				var left = item[3]*per +'%';
				var top = item[4]*per +'%';
				console.log();
				$('.point_'+index).css('left',left).css('top',top);
			}
		});
	}
	
	
	component.on('onLoad',function(){
		var s = 0 ;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s += 0.01;
				pointAnimate(s);
			},i*10+500);
		}
	});
	component.on('onLeave',function(){
		var s = 1 ;
		for(var i=0;i<100;i++){
			setTimeout(function(){
					s -= 0.01;
					pointAnimate(s);
			},i*10+500);
		}
	});
	
	return component;
}