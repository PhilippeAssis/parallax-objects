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
    $.fn.pxoCreatorObjects = function (objects, options) {
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

            if (options.mobileShow && obj.mobile)
                obj = obj.mobile;

            if (obj['speedRandom'] || options['speedRandom'])
                obj['speed'] = Math.floor((Math.random() * 100) + 1) * 0.1;

            var span = jQuery('<span>', {
                'class': isNotUndefined(obj['class']) ? 'parallaxObjects parallaxObjects-Object' + i + ' ' + obj['class'] : 'parallaxObjects parallaxObjects-Object' + i,
                'pxoY': isNotUndefined(obj.y) ? obj.y : null,
                'pxoX': isNotUndefined(obj.x) ? obj.x : null,
                'pxoZ': isNotUndefined(obj.zoom) ? obj.zoom : null,
                'pxoO': isNotUndefined(obj.opacity) ? obj.opacity : null,
                'pxoOs': isNotUndefined(obj.speedOpacity) ? obj.speedOpacity : null,
                'pxoSpeed': isNotUndefined(obj['speed']) ? obj['speed'] : null,
                'pxoLimit': isNotUndefined(obj.limit) ? obj.limit : null
            });

            if (obj.style)
                $(span).css(obj.style);

            if (!(options.mobileShow && !options.mobileAnimate))
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
    $.fn.pxoUpdateObjects = function (object, options) {
        "use strict";
        if (object === 0)
            object = '0';

        var obj = $('.parallaxObjects-Object' + object, this);


        if (options.speed)
            obj.attr('pxoSpeed', options.speed);

        if (options.limit)
            obj.attr('pxoLimit', options.limit);

        if (options.y)
            obj.attr('pxoY', options.y);

        if (options.x)
            obj.attr('pxoX', options.x);

        if (options.zoom)
            obj.attr('pxoZ', options.zoom);

        if (options.opacity)
            obj.attr('pxoO', options.opacity);
    };

    /**
     * parallaxObjects
     * Engine responsible for the behavior of the elements.
     * */
    $.fn.parallaxObjects = function (data, custom) {
        "use strict";

        var target = $(this);

        var options = {
            y: -1, // vertical direction.
            x: 0, // horizontal direction.
            opacity: -1, //Opacity CSS (-1 decreases, 0 inactive, 1 increases).
            zoom: 0, //Zoom css (-1 decreases, 0 inactive, 1 increases).
            speedOpacity: 0.5, //Opacity speed on rolling.
            speed: 0.5, // Speed based on scroll.
            speedRandom: false, // Random velocity.
            viewport: 200,// Determines when the animation starts in viewport.
            viewportBottom: true, //Use the bottom to determine the distance from the viewport.
            noEnd: false, //Cancels the end of the animation, even exceeding the viewport or there is a limit.
            limit: false, //limits the movement of the element.
            mobile: false, //Customizes the elements in Mobile mode.
            mobileAnimate: true, //Enables or disables the animation in mobile mode.
            mobileShow: false, //Shows or hides the element in mobile mode.
            class: false //Class element.
        };

        if (typeof(custom) == 'object')
            options = $.extend(options, custom);

        target.pxoCreatorObjects(data, options);

        var objects = $('.parallaxObjects-WrapRelative', target).find('.parallaxObjects');

        function empty(obj) {
            if (typeof obj == 'undefined')
                return null;
            return obj;
        }

        function convert(obj, value, axis) {
            if (value.indexOf('%') > -1) {
                value = '0.' + value.replace('%', '');
                value = eval(value);

                if (axis == 'y')
                    return obj.height() * value;
                else if (axis == 'x')
                    return obj.width() * value;
            }
            else if (value.indexOf('px') > -1)
                return eval(value.replace('px', ''));
            else
                return eval(value);
        }

        if (options.viewportBottom)
            options.viewport = $(window).height() - options.viewport;

        /*
         * Engine
         * */
        var parallax = function () {
            var top = $(window).scrollTop();

            if (!target.is(':in-viewport(' + options.viewport + ')')) {
                if (!options.noEnd)
                    return;
            }

            for (var i = 0; objects.length > i; i++) {
                var obj = $(objects[i]);

                var speed = empty(obj.attr('pxoSpeed')) || options.speed;
                var limit = empty(obj.attr('pxoLimit')) || options.limit;

                var y = empty(obj.attr('pxoY')) || options.y;
                var x = empty(obj.attr('pxoX')) || options.x;
                var z = empty(obj.attr('pxoZ')) || options.zoom;
                var o = empty(obj.attr('pxoO')) || options.opacity;


                //Vertical
                if (y != undefined && y !== 0) {
                    var topObj = convert(target, obj.css('top') ? obj.css('top') : '0', 'y');

                    if (!obj.attr('pxoTop'))
                        obj.attr('pxoTop', topObj);

                    topObj = eval(obj.attr('pxoTop'));

                    if (y > 0) {
                        calc = topObj - (top * speed);
                        if (limit && calc < limit)
                            calc = limit;

                        obj.css('top', calc + 'px');

                    }
                    else if (y < 0) {
                        calc = topObj + (top * speed);
                        if (limit && calc > limit)
                            calc = limit;

                        obj.css('top', calc + 'px');
                    }

                }

                //Horizontal
                if (x != undefined && x !== 0) {
                    var leftObj = convert(target, obj.css('left') ? obj.css('left') : '0', 'x');

                    if (!obj.attr('pxoLeft'))
                        obj.attr('pxoLeft', leftObj);

                    leftObj = eval(obj.attr('pxoLeft'));

                    if (x < 0)
                        obj.css('left', (leftObj - (top * speed)) + 'px');
                    else if (x > 0)
                        obj.css('left', (leftObj + (top * speed)) + 'px');
                }

                //Zoom
                if (z != undefined && z !== 0) {
                    var zoomObj = '100';
                    if (!obj.attr('pxoZoom'))
                        obj.attr('pxoZoom', zoomObj);
                    zoomObj = eval(obj.attr('pxoZoom'));

                    if (z > 0)
                        obj.css('zoom', (zoomObj + (top * speed)) + '%');
                    else if (z < 0)
                        obj.css('zoom', (zoomObj - (top * speed)) + '%');
                }

                //Fade
                if (o != undefined && o !== 0) {
                    if (!obj.attr('pxoOpacity'))
                        obj.attr('pxoOpacity', obj.css('opacity'));

                    var opacityObj = empty(eval(obj.attr('pxoOpacity')));
                    var speedOpacity = empty(eval(obj.attr('pxoOs'))) || options.speedOpacity;

                    var calc = (top * 0.5) * (speedOpacity * 0.01);

                    if (o > 0)
                        obj.css('opacity', opacityObj + calc);
                    else if (o < 0)
                        obj.css('opacity', opacityObj - calc);
                }
            }

        };

        $(window).on('touchmove scroll load', function () {
            parallax();
        });

    }
})(jQuery);