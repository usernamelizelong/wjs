/**
 * Created by Administrator on 2017/1/19.
 */
$(function(){
    /*设置轮播图的时间间隔*/
    $('.carousel').carousel({
        interval: 2000
    });
    /*初始化工具提示*/
    $('[data-toggle="tooltip"]').tooltip();


    /*1.发送ajax请求,获取数据*/
    var getData=function(callback){
        $.ajax({
            type:'get',
            url:'../js/imgData.json',
            success:function(result){
                console.log("我去请求数据啦");
                callback(result);
            }
        });
    }
    var isMobile=false;
    /*根据屏幕的宽度进行渲染*/
    function render(){
        var width=$(window).width();
        /*判断当前屏幕的类型*/
        if(width>=768){
            isMobile=false;
        }
        else{
            isMobile=true;
        }
        var data=getData(function(result){
            /*调用模板引擎生成可渲染的html代码*/
            var imgHTML=template("imgTEMP",{"items":result,"isMobile":isMobile});
            //console.log(imgHTML);
            /*渲染*/
            $(".carousel-inner").html(imgHTML);

            /*渲染点标记*/
            var indicatorHTML=template("indicatorTEMP",{"items":result});
            $(".carousel-indicators").html(indicatorHTML);
        });
    }

    render();

    $(window).on("resize",function(){
        /*不是任何的屏幕大小变换都需要重新的请求数据,只有两种情况需要这样处理
        * 1.从移动端切换到非移动端
        * 2.从非移动端切换到移动端*/
        var width=$(window).width();
        if(isMobile==true && width>=768  || isMobile==false && width<768){
            /*渲染：你得去发送ajax请求，只有当需要的数据改变的时候发起新的请求才会有意义*/
            render();
        }
    });

    /*实现轮播图的滑动*/
    var startX=0;
    var moveX=0;
    var distanceX=0;
    $(".carousel-inner").on("touchstart",function(e){
        console.log(123);
        startX= e.originalEvent.touches[0].clientX;
        /*在bootsrtap中，对事件源参数做了二次封装*/
        //console.log(e.originalEvent.touches[0].clientX);
    });
    $(".carousel-inner").on("touchmove",function(e){
        moveX=e.originalEvent.touches[0].clientX;
        distanceX=moveX-startX;
        /*清除过渡，设置偏移*/
    });
    /*手指离开时*/
    $(".carousel-inner").on("touchend",function(e){
        if(Math.abs(distanceX)>100){
            if(distanceX>0){
                /*上一张：之前index--,开启过渡，设置偏移*/
                $('.carousel').carousel('prev');
            }
            else{
                $('.carousel').carousel('next');
            }
        }
    });


    /*计算产品块标签页ul的宽度*/
    var allLis=$(".tabParent").find("li");
    var totalWidth=0;/*总宽度*/
    allLis.each(function(index,value){
        totalWidth=totalWidth+$(value).outerWidth(true);
        /*width:只能获取内容的宽度
        * innerWidth:获取内容+padding
        * outerWidth:获取内容+padding+border
        * outerWidth(true):获取内容+padding+border+margin*/
        //console.log($(value).outerWidth(true));
    });
    $(".tabParent > ul").width(totalWidth);
    /*实现滑动操作*/
    itcast.iScroll({
        /*只里只能使用dom元素*/
        swipeDom:$(".tabParent")[0],
        swipeType:"x",
        swipeDistance:100
    });
});