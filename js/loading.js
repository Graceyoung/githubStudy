var Loading = function(images){
	
	var id = this.id;
	if(this._images === undefined){  // 第一次进入
		
		this._images = (images||[]).length;
		this._loaded = 0;

		// 把当前对象存储在全局对象 window中，用来进行某个图片加载完成后的回调
		window[id] = this;		

		for(var i=0;i<images.length;i++){
			var url = images[i];
			var img = new Image();
			img.onload = function(){
				window[id].loader();
			}
			img.src = url;
		}
		$('#rate').text('0%');
		return this;
	}else{
		this._loaded++;
		$('#rate').text((((this._loaded)/(this._images)*100)>>0)+'%');
		
		// 判断图片是否加载完，未加载完则继续加载
		if(this._loaded<this._images){
			return this;
		}
	}
	$('.loading').css('display','none');
	this.el.fullpage({
		// 触发组件动画
		onLeave:function(index,nextIndex,direction){
			$(this).find('.H5_component').trigger('onLeave');
		},
		afterLoad:function(anchorLink,index){
			$(this).find('.H5_component').trigger('onLoad');
		}
	});

	this.page[0].find('.H5_component').trigger('onLoad');
	
	// 页面加载完成之后显示
	this.el.show();
}
