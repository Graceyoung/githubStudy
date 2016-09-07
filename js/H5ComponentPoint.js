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
		

		if(item[2]){

			point.css('background-color',item[2]);

		}
		if(item[3]!=undefined && item[4]!=undefined){

			point.css('left',item[3]).css('top',item[4]);
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
	

	return component;
}