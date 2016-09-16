/* 柱状图组件对象 */

var H5ComponentBar = function(name,cfg){
	var cfg = cfg ||{};
	var component = new H5ComponentBase(name,cfg);
	
	$.each(cfg.data,function(idx,item){
		var line = $('<div class="line"></div>');
		var name = $('<div class="name"></div>');
		var rate = $('<div class="rate"></div>');
		var per = $('<div class="per"></div>');

		var percent = item[1]*100+'%';
		rate.width(percent);

		var rateBg = '';
		if(item[2]){
			rateBg = 'style="background-color:'+item[2]+'"';
		}
		
		rate.html('<div class="bg" '+rateBg+'></div>');
		//per.css('color',item[2]);
		
		name.text(item[0]);
		per.text(percent);

		line.append(name).append(rate).append(per);;
		component.append(line);
	});
	
	return component;
}