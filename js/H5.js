//H5对象
var H5 = function(){

	this.id = ('H5_'+Math.random()).replace('.','_');
	this.el = $('<div class="H5" id="'+this.id+'"></div>').hide();
	this.page = [];
	$('body').append(this.el);

	/*
	 *@param {string} name 页的名称，用来添加class
	 *@param {string} text 页内的默认文本
	 *return {H5} H5对象，可以重复使用H5对象支持的方法
	 */
	this.addPage = function(name,text){
		var page = $('<div class="H5_page section"></div>');
		if(name != undefined){
			page.addClass('H5_page_'+name);
		}
		if(text != undefined){
			page.text(text);
		}
		this.el.append(page);
		this.page.push(page);
		return this;
	};

	//新增一个组件
	this.addComponent = function(name,cfg){
		var cfg = cfg || {};
		cfg = $.extend({
			type:'base'
		},cfg);

		var component;
		var page = this.page.slice(-1)[0];

		switch(cfg.type){
			case 'base':
				component = new H5ComponentBase(name,cfg);
			break;
			default:
		}
			//console.log(page);
		page.append(component);

		return this;
	};

	//H5对象初始化呈现
	this.loader = function(){
		this.el.fullpage({

			//触发组件动画
			onLeave:function(index,nextIndex,direction){
				$(this).find('.H5_component').trigger('onLeave');
			},
			afterLoad:function(anchorLink,index){
				$(this).find('.H5_component').trigger('onLoad');
			}
		});

		this.page[0].find('.H5_component').trigger('onLoad');
		
		//页面加载完成之后显示
		this.el.show();
	}
	return this;
}