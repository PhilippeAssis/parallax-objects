/**
 * Parallax Objects
 * */
(function ($) {
    $.fn.pxoCreatorObjects = function(objects,options){
        function isNotUndefined(obj){
            if(typeof obj == 'undefined')
                return false;
            return true;
        }

        var target = $(this);

        if(!target.hasClass('parallaxObjects-StageParallax'))
            target.addClass('parallaxObjects-StageParallax');
        else
            $('.parallaxObjects-WrapAbsolute',target).remove();

        var baseRelative = jQuery('<div>');
        $(baseRelative).addClass('parallaxObjects-WrapRelative');

        var baseAbsolute = jQuery('<div>');
        $(baseAbsolute).addClass('parallaxObjects-WrapAbsolute');
        $(baseAbsolute).html($(baseRelative));

        if(!$('.parallaxObjects-WrapContent',target).is('div'))
            target.wrapInner("<div class='parallaxObjects-WrapContent'></div>");

        target.prepend($(baseAbsolute));

        for(i in objects){
            var obj = objects[i];

            if(options.mobileMode && obj.mobile)
                obj = obj.mobile;

            if(obj['speedRandom'] || options['speedRandom'])
                obj['speed'] = Math.floor((Math.random() * 100) + 1) * 0.1;

            var span = jQuery('<span>',{
                'class' : isNotUndefined(obj['class']) ? 'parallaxObjects parallaxObjects-Object'+i+' '+obj['class'] : 'parallaxObjects parallaxObjects-Object'+i,
                'pxoY' : isNotUndefined(obj.y) ? obj.y : null,
                'pxoX' : isNotUndefined(obj.x) ? obj.x : null,
                'pxoZ' : isNotUndefined(obj.zoom) ? obj.zoom : null,
                'pxoO' : isNotUndefined(obj.opacity) ? obj.opacity : null,
                'pxoOs' : isNotUndefined(obj.speedOpacity) ? obj.speedOpacity : null,
                'pxoSpeed' : isNotUndefined(obj['speed']) ? obj['speed'] : null,
                'pxoLimit' : isNotUndefined(obj.limit) ? obj.limit : null
            });

            if(obj.style)
                $(span).css(obj.style);

            if(!(options.mobileMode && !options.mobileAnimate))
                if(obj.opacity == 1)
                    $(span).css('opacity','0');
                else if(obj.opacity == -1)
                    $(span).css('opacity','1');

            $('.parallaxObjects-WrapRelative',target).append(span);
        }
    };

    $.fn.pxoUpdateObjects = function(object,options){
        if(object === 0)
            object = '0'

        obj = $('.parallaxObjects-Object'+object, this);


        if(options.speed)
            obj.attr('pxoSpeed',options.speed)

        if(options.limit)
            obj.attr('pxoLimit',options.limit)

        if(options.y)
            obj.attr('pxoY',options.y)

        if(options.x)
            obj.attr('pxoX',options.x)

        if(options.zoom)
            obj.attr('pxoZ',options.zoom)

        if(options.opacity)
            obj.attr('pxoO',options.opacity)
    };

    $.fn.parallaxObjects = function(data,custom){

        var target = $(this);

        var options = {
            y : -1, // Direção vertical
            x : 0, // Direção horizontal,
            opacity: -1, //Opacity css no elemento (1 diminui, 0 inativo, 1 aumenta).
            speedOpacity: 0.5, //Velocidade da opacidade relativa a rolagem
            zoom : 0, //Zoom css no elemento (-1 diminui, 0 inativo, 1 aumenta).
            speed : 0.5, // velocidade do speed, baseado no scroll
            speedRandom : false, // Velocidade de elementos aleatorias
            viewport : 200,// Determina quando a animação inicia
            viewportBottom : true, //Usa a base para determinar a distancia do viewport
            noEnd : false, //AnimaÃ§Ã£o nÃ£o tem fim, mesmo que o viewport ultrapasse ou seja limitado,
            limit : false, //limita o movimento do elemento
            mobile : false, //customiza os elementos em modo mobile
            mobileAnimate : true, //ativa ou desativa a animação em modo mobile
            mobileMode : false, //ativa ou desativa o modo mobile
            'class' : false
        };

        if(typeof(custom) == 'object')
            options = $.extend(options, custom);

        target.pxoCreatorObjects(data,options);

        var objects = $('.parallaxObjects-WrapRelative', target).find('.parallaxObjects');

        function empty(obj){
            if(typeof obj == 'undefined')
                return null;
            return obj;
        }

        function convert(obj,value,axis){
            if(value.indexOf('%') > -1){
                value = '0.' + value.replace('%','');
                value = eval(value);

                if(axis == 'y')
                    return obj.height() * value;
                else if(axis == 'x')
                    return obj.width() * value;
            }
            else if(value.indexOf('px') > -1)
                return eval(value.replace('px',''));
            else
                return eval(value);
        }

        if(options.viewportBottom)
            options.viewport = $(window).height() - options.viewport;

        /*
         * Parallax
         * */
        var parallax = function(){
            var top = $(window).scrollTop();

            if(!target.is(':in-viewport('+options.viewport+')')){
                if(!options.noEnd)
                    return;
                else if(PTS >= top)
                    return;
            }

            for(i=0; objects.length > i;i++){
                var obj = $(objects[i]);

                var speed = empty(obj.attr('pxoSpeed')) || options.speed;
                var limit = empty(obj.attr('pxoLimit')) || options.limit;

                var y = empty(obj.attr('pxoY')) || options.y;
                var x = empty(obj.attr('pxoX')) || options.x;
                var z = empty(obj.attr('pxoZ')) || options.zoom;
                var o = empty(obj.attr('pxoO')) || options.opacity;


                //Vertical
                if(y != undefined && y !== 0 ){
                    var topObj = convert(target,obj.css('top') ? obj.css('top') : '0','y');

                    if(!obj.attr('pxoTop'))
                        obj.attr('pxoTop',topObj);

                    topObj = eval(obj.attr('pxoTop'));

                    if(y > 0){
                        calc = topObj - (top * speed);
                        if(limit && calc < limit)
                            calc = limit;

                        obj.css('top',calc + 'px');

                    }
                    else if(y < 0){
                        calc = topObj + (top * speed);
                        if(limit && calc > limit)
                            calc = limit;

                        obj.css('top',calc + 'px');
                    }

                }

                //Horizontal
                if(x != undefined && x !== 0 ){
                    var leftObj = convert(target,obj.css('left') ? obj.css('left') : '0','x');

                    if(!obj.attr('pxoLeft'))
                        obj.attr('pxoLeft',leftObj);

                    leftObj = eval(obj.attr('pxoLeft'));

                    if(x < 0)
                        obj.css('left',(leftObj - (top * speed)) + 'px');
                    else if(x > 0)
                        obj.css('left',(leftObj + (top * speed)) + 'px');
                }

                //Zoom
                if(z != undefined && z !== 0 ){
                    var zoomObj = '100';
                    if(!obj.attr('pxoZoom'))
                        obj.attr('pxoZoom',zoomObj);
                    zoomObj = eval(obj.attr('pxoZoom'));

                    if(z > 0)
                        obj.css('zoom',(zoomObj + (top * speed))+'%');
                    else if(z < 0)
                        obj.css('zoom',(zoomObj - (top * speed))+'%');
                }

                //Fade
                if(o != undefined && o !== 0 ){
                    if(!obj.attr('pxoOpacity'))
                        obj.attr('pxoOpacity',obj.css('opacity'));

                    var opacityObj = empty(eval(obj.attr('pxoOpacity')));
                    var speedOpacity = empty(eval(obj.attr('pxoOs'))) || options.speedOpacity;

                    var calc = (top * 0.5) * (speedOpacity * 0.01);

                    if(o > 0)
                        obj.css('opacity',opacityObj + calc);
                    else if(o < 0)
                        obj.css('opacity',opacityObj - calc);
                }
            }

        };

        parallax();

        $(window).on('touchmove scroll',function(){
            parallax();
        });

    }
})(jQuery);