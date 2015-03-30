/**
 * Parallax Objects
 *
 * Developed by Philippe Assis
 * Official repository https://github.com/PhilippeAssis/parallax-objects
 * www.philippeassis.com
 * */
(function ($) {
    /**
     * pxoCreatorObjects
     * Creates dynamic elements from their classes or parameters defined in the configuration
     * */
    $.fn.pxoCreatorObjects = function (objects) {
        "use strict";
        function isNotUndefined(obj) {
            if (typeof obj == 'undefined')
                return false;
            return true;
        }

        var target = $(this);

        if (!target.hasClass('parallaxObjects-StageParallax'))
            target.addClass('parallaxObjects-StageParallax');
        else
            $('.parallaxObjects-WrapAbsolute', target).remove();

        var baseRelative = jQuery('<div>');
        $(baseRelative).addClass('parallaxObjects-WrapRelative');

        var baseAbsolute = jQuery('<div>');
        $(baseAbsolute).addClass('parallaxObjects-WrapAbsolute');
        $(baseAbsolute).html($(baseRelative));

        if (!$('.parallaxObjects-WrapContent', target).is('div'))
            target.wrapInner("<div class='parallaxObjects-WrapContent'></div>");

        target.prepend($(baseAbsolute));

        for (var i in objects) {
            var obj = objects[i];

            if (obj['speedRandom'] || 1['speedRandom'])
                obj['speed'] = Math.floor((Math.random() * 100) + 1) * 0.1;

            obj['offset'] = (obj['offset']) ? 1 : 0;

            var span = jQuery('<span>', {
                'class': isNotUndefined(obj['class']) ? 'parallaxObjects parallaxObjects-Object' + i + ' ' + obj['class'] : 'parallaxObjects parallaxObjects-Object' + i
            });

            if (obj.style)
                $(span).css(obj.style);

            if (!(obj.mobileShow && !obj.mobileAnimate))
                if (obj.opacity == 1)
                    $(span).css('opacity', '0');
                else if (obj.opacity == -1)
                    $(span).css('opacity', '1');

            $('.parallaxObjects-WrapRelative', target).append(span);
        }
    };

    /**
     * pxoUpdateObjects
     * Updates the parameters of the element and can change their behavior.
     * */
    $.fn.parallaxUpdate = function (data, pointer, options) {
        "use strict";
        if (options.speed)
            data[pointer].speed = options.speed;

        if (options.y != undefined)
            data[pointer].y = options.y;

        if (options.x != undefined)
            data[pointer].x = options.x;

        if (options.zoom != undefined)
            data[pointer].zoom = options.zoom;

        if (options.fade != undefined)
            data[pointer].fade = options.fade;

        if (options.limit.x != undefined)
            data[pointer].limit.x = options.limit.x;

        if (options.limit.y != undefined)
            data[pointer].limit.y = options.limit.y;

        if (options.limit != undefined && (options.limit.x == undefined && options.limit.y == undefined))
            data[pointer].limit = options.limit;


        $(this).trigger('parallaxUpdate', data);
    };

    /**
     * parallaxObjects
     * Engine responsible for the behavior of the elements.
     * */
    $.fn.parallaxObjects = function (data, custom) {
        "use strict";

        var animateAxis = function (stage, opt, top, axis, posi) {
            if (opt[axis] != undefined && opt[axis] !== 0) {
                var pxoAttr = 'pxo' + posi;

                var position = convert(target, stage.css(posi) ? stage.css(posi) : '0', 'y');

                if (!stage.attr(pxoAttr))
                    stage.attr(pxoAttr, position);
                else
                    position = eval(stage.attr(pxoAttr));

                if (opt[axis] > 0) {
                    var calc = position - (top * opt.speed);
                    if (opt.limit[axis] && calc < opt.limit[axis])
                        calc = opt.limit[axis];

                    stage.css(posi, calc + 'px');
                }
                else if (opt[axis] < 0) {
                    var calc = (top * opt.speed);

                    if (opt.limit[axis] && calc > opt.limit[axis])
                        calc = opt.limit[axis];

                    stage.css(posi, (position + calc) + 'px');
                }
            }
        }

        var parallax = function () {
            var objects = $('.parallaxObjects-WrapRelative', target).find('.parallaxObjects');

            for (var i = 0; objects.length > i; i++) {
                target.pxoData[i].pointer = i;
                var objOptions = target.pxoData[i];
                var objTarget = $(objects[i]);
                var top = target.pxoData[i].top = (!objOptions.limit) ? $(window).scrollTop() : $(window).scrollTop() - target.offset().top;

                if (!objOptions.mobileAnimate && mobile() || (!target.is(':in-viewport(' + objOptions.viewport + ')') && !objOptions.limit))
                    return;

                //Vertical
                animateAxis(objTarget, objOptions, top, 'y', 'top');

                //Horizontal
                animateAxis(objTarget, objOptions, top, 'x', 'left');

                //Zoom
                if (objOptions.zoom != undefined && objOptions.zoom !== 0) {
                    var zoomObj = objTarget.css('zoom') != undefined ? objTarget.css('zoom') : '1';

                    if (!target.pxoData[i].zoom)
                        target.pxoData[i].zoom = zoomObj;

                    zoomObj = target.pxoData[i].zoom * 100;

                    if (objOptions.zoom > 0)
                        objTarget.css('zoom', (zoomObj + (top * objOptions.speed)) + '%');
                    else if (objOptions.zoom < 0)
                        objTarget.css('zoom', (zoomObj - (top * objOptions.speed)) + '%');
                }

                //Fade
                if (objOptions.fade != undefined && objOptions.fade !== 0) {
                    if (!target.pxoData[i].opacity)
                        target.pxoData[i].opacity = objTarget.css('opacity');

                    var fadeObj = empty(eval(target.pxoData[i].opacity));

                    var calc = (top * 0.5) * (objOptions.speedOpacity * 0.01);

                    if (objOptions.fade > 0)
                        objTarget.css('opacity', fadeObj + calc);
                    else if (objOptions.fade < 0)
                        objTarget.css('opacity', fadeObj - calc);
                }

            }

            var pxoData = target.pxoData;
            target.trigger('parallaxUpgrade', [pxoData]);
        };

        var merge = function (object, target) {
            var newObject = {}
            for (var key in object)
                if (target[key] != undefined)
                    newObject[key] = target[key];
                else
                    newObject[key] = object[key];

            return newObject;
        }

        var mobile = function () {
            if (navigator.userAgent.indexOf('Mobile') > -1)
                return true;
            return false;
        }

        var empty = function (obj) {
            if (typeof obj == 'undefined')
                return null;
            return obj;
        }

        var convert = function (obj, value, axis) {
            if (value.indexOf('%') > -1) {
                value = '0.' + value.replace('%', '');
                value = eval(value);

                if (axis == 'y')
                    return objTarget.height() * value;
                else if (axis == 'x')
                    return objTarget.width() * value;
            }
            else if (value.indexOf('px') > -1)
                return eval(value.replace('px', ''));
            else
                return eval(value);
        }

        var target = $(this);

        var optDefault = {
            y: -1, // vertical direction.
            x: 0, // horizontal direction.
            fade: 0, //Fade In(1), Out(-1) or none(0)
            zoom: 0, //Zoom css (-1 decreases, 0 inactive, 1 increases).
            speedOpacity: 0.5, //Opacity speed on rolling.
            speed: 0.5, // Speed based on scroll.
            speedRandom: false, // Random velocity.
            limit: {'y': null, 'x': null, 'opacity': null}, //limits the movement of the element.
            viewport: 0,// Determines when the animation starts in viewport.
            viewportBase: 'bottom', //Use the bottom to determine the distance from the viewport.
            mobileAnimate: false, //Enables or disables the animation in mobile mode.
            mobileShow: true, //Shows or hides the element in mobile mode.
            class: null
        };

        var options = (typeof custom == 'object') ? merge(optDefault, custom) : optDefault;

        if (!options.mobileShow && mobile())
            return;

        for (var key in data) {
            data[key] = merge(optDefault, data[key]);
            data[key].x = data[key].x * -1;
        }


        target.pxoData = data;

        $(this).pxoCreatorObjects(target.pxoData);

        $(window).on('touchmove scroll load resize', function () {
            parallax();
        });

        target.on('parallaxUpdate', function () {
            console.log('asdasdasdasdasd');
        })

    }
})(jQuery);