# H5组件式开发web app
  相关技术——前端开发——JS对象规划——总结
  效果展示：https://graceyoung.github.io/h5WebApp/
  ![preview](https://raw.github.com/Graceyoung/h5WebApp/master/mark/3_spec.png)

## 相关技术
 
    FullPage.js插件
      fullPage.js是一个基于jQuery的插件，它能够很方便、很轻松的制作出全屏网站
      源码详见：https://github.com/alvarotrigo/fullPage.js
      
  	HTML5 CSS3
  	  该页面是为了手机端浏览设计的，所以用到了移动端页面适配。
  	  	<meta name = "viewport" content = "width =320px/device-width，
  	  					   user-scalable=yes,
  	  					   initial-scale = 1.0,
  	  					   minimum-scale = 1.0,
  	  					   maximum-scale=1.0,
  	  					   target-densitydpi = dpi_value"> 
	  	  	width [pixel_value | device-width(设备宽度)]
			height [pixel_value | device-height(设备高度)]
			user-scalable 是否允许手动缩放 （no||yes）
			initial-scale 初始比例
			minimum-scale 允许缩放的最小比例
			maximum-scale 允许缩放的最大比例 
			dpi_value
				device-dpi  设备默认的像素密度
				high-dpi    高像素密度
				medium-dpi  中等的像素密度
				low-dpi     低像素密度

  	  页面的动画用到了CSS3的动画animation等。
  	  图表组件中的柱图是用CSS3新增的属性等完成的。
  		
  	HTML5 Canvas
  		canvas元素用于在网页上绘制图形。
  		图表组件中的折线图、雷达图、饼图、散点图都是用canvas实现的，canvas中的重点是坐标的计算。
  		
## 前端开发
	
    设计稿标注&切图
	    标注工具MarkMan
	    
    编写静态页
	    验证fullPage.js插件的页面切换功能
	    验证利用fullPage.js 事件，实现组件的“入场、出场”动画
	    
    开发测试		
			“基本图文组件”类--H5ComponentBase					
			目的：实现 出场、 入场 动画提取			
			
    开发测试					
			内容组织类--H5				
			目的：实现内容页面与组件的组织功能，方便任意添加page、component内容
			
    开发图表组件	
			H5ComponentBar
			H5ComponentPolyline
			H5ComponentRadar				
			H5ComponentPie
			
    loading功能的开发	
		
    功能整合	
			实现设计稿
			
## JS对象规划		
		内容组织类：H5					
			作用: 组织H5报告的内容结构				
				    设置H5报告的切换效果（fullPage.js）
			方法: 添加一个页addPage	    
				    添加一个组件addComponent.js）
				    展现所有页面loader
				    
		图文组件类：H5ComponentBase		
		  作用: 输出一个DOM，内容可以是图片或者文字
		  事件: 当前页载入：onLoad
		        当前页移出：onLeave
		        
		图表组件类：H5Component...      
		  作用: 在H5ComponentBase的基础之上插入DOM结构或canvas图形
		  事件: 当前页载入移出：onLoad、onLeave
		        图表组件本身的生长动画
		        
## 总结
    该项目的核心是将页面的内容分成几个部分分别进行开发，也就是这里所说的图表组件对象，每个组件对象都是独立的，
    可以同时进行，并且在以后的工作中可以应用。
		首先分析页面，有的页面是由图文(图片和文字)组成，有的页面是由图表(柱图、散点图、折线图、雷达图等)组成。
    第一步创建一个基本的组件对象，图文组件和图表组件都是基于这个基本组件，图表组件要分别创建组件对象。
    第二步将所有的组件对象联系起来，新创建一个对象，拥有addPage、addComponent和loader方法，分别是添加一个页面，
    添加一个组件以及加载完要做的事。
					
