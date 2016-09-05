/* 基本图文组件对象 */

var H5ComponentBase = function(name,cfg){
	var cfg = cfg ||{};
	var id = ('h5_c_'+Math.random()).replace('.','_');

	//给组件添加class
	var cls = ' h5_component_'+cfg.type;
	var component = $('<div class="H5_component h5_component_name_'+name+cls+'" id="'+id+'"></div>');

	cfg.text && component.text(cfg.text);
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
	cfg.css && component.css(cfg.css);
	cfg.bg && component.css('backgroundImage','url(../imgs/'+cfg.bg+')');
	if(cfg.center == true){
		component.css({
			marginLeft:(cfg.width/4 * -1) +'px',
			left:'50%'
		});
	}

	//载入 移出的动画
	component.on('onLeave',function(){
		$(this).removeClass(cls+'_load').addClass(cls+'_leave');
		cfg.animateIn && component.animate(cfg.animateOut);
		return false;
	});
	component.on('onLoad',function(){
		$(this).removeClass(cls+'_leave').addClass(cls+'_load');
		cfg.animateIn && component.animate(cfg.animateIn);
		return false;
	});


	// 很多自定义的参数

	return component;
}