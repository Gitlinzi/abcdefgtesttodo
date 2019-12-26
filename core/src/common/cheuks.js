/*
 * 轮播图
 */
// (function() {
//     var $inner = $('.carousel-inner'),
//         $btn = $('.carousel-btn'),
//         inter;

//     function aniRunning() {
//         return $('.carousel-inner a').filter(':animated').length;
//     }

//     function switchPic(curr, next) {
//         if (aniRunning() === 0) {
//             $('.carousel-inner a').eq(next).fadeIn(500, function() {
//                 $(this).addClass('active');
//                 $('.carousel-paging li').eq(next).addClass('active');
//             });
//             $('.carousel-inner a').eq(curr).fadeOut(500, function() {
//                 $(this).removeClass('active');
//                 $('.carousel-paging li').eq(curr).removeClass('active');
//             });
//         }
//     }

//     function autoPlay() {
//         var liIndex = $('.carousel-paging li').filter('.active').index();
//         liIndex++;
//         if (liIndex === $('.carousel-paging li').length) {
//             liIndex = 0;
//         }
//         $('.carousel-paging li').eq(liIndex).click();
//     }

//     $inner.mouseover(function() {
//         $btn.show();
//     }).mouseout(function() {
//         $btn.hide();
//     });
//     $btn.mouseover(function() {
//         $btn.show();
//     }).mouseout(function() {
//         $btn.hide();
//     }).click(function() {
//         var curr = $('.carousel-inner a').filter('.active').index();
//         var next = 0;
//         if ($(this).hasClass('prev')) {
//             if (curr === 0) {
//                 next = $('.carousel-inner a').length - 1;
//             } else {
//                 next = curr - 1;
//             }
//         } else if ($(this).hasClass('next')) {
//             if (curr === ($('.carousel-inner a').length - 1)) {
//                 next = 0;
//             } else {
//                 next = curr + 1;
//             }
//         }
//         switchPic(curr, next);
//         clearInterval(inter);
//         inter = setInterval(autoPlay, 5000);
//     });
//     $(document).on('click', '.carousel-paging li', function (e) {
//         var event = e || window.event;
//         var acLi = $('.carousel-paging li').filter('.active');
//         if (event.originalEvent) {
//             clearInterval(inter);
//             inter = setInterval(autoPlay, 5000);
//         }
//         if (acLi[0] === this) {
//             return false;
//         }
//         var activeIndex = acLi.index();
//         var currIndex = $(this).index();
//         switchPic(activeIndex, currIndex);
//     });
//     inter = setInterval(autoPlay, 5000);
// })();

 /*
 * 侧边菜单
 */
(function() {
    var hi = 0;
    $(document).on({
        mouseover: function() {
            var index = $(this).index();
            $(this).addClass('active');
            $('.nav-items').hide();
            $('.nav-items').eq(index).show();

            hi = index;
        },
        mouseleave: function(){
            var index = $(this).index();
            $(this).removeClass('active');
            $('.nav-items').hide();
        }

    }, '.side-ul>li').on({
        mouseover: function() {
            $('.side-nav .side-ul').addClass('active');
            $('.side-ul>li').eq(hi).addClass('active');
            $(this).show();
        },
        mouseleave: function(){
            $('.side-nav .side-ul').removeClass('active');
            $('.side-ul>li').eq(hi).removeClass('active');
            $(this).hide();
        }

    }, '.nav-items');
})();

/**
 * 数字微调
 */
(function($) {
    $.fn.NumSpinner = function(options) {
        var opts = $.extend({}, {
            min: 1,
            max: 9999,
            onChange: function(target) {}
        }, options);
        return this.each(function() {
            var $this = $(this);
            var addBtn = $(this).parent().find('.add');
            var subBtn = $(this).parent().find('.sub');
            if ($this.attr('data-min')) {
                opts.min = $this.attr('data-min') * 1;
            }
            if ($this.attr('data-max')) {
                opts.max = $this.attr('data-max') * 1;
            }

            $this.keydown(function(e) {
                var currKey = e.keyCode || e.which;
                var codeArr = '8,37,38,39,40,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,115,187,189';

                if (codeArr.indexOf(currKey) < 0) {
                    return false;
                }
                if (currKey === 40 || currKey === 189) {
                    subBtn.click();
                    return false;
                }
                if (currKey === 38 || currKey === 187) {
                    addBtn.click();
                    return false;
                }
                if (currKey === 8) {
                    if (this.value.length === 1) {
                        return false;
                    }
                }
            }).keyup(function() {
                if (this.value > opts.max) {
                    this.value = opts.max;
                    opts.onChange(this);
                }
                if (this.value < opts.min) {
                    this.value = opts.min;
                    opts.onChange(this);
                }
            });
            subBtn.click(function() {
                var value = $this.val() * 1;
                if (value > opts.min) {
                    $this.val(--value);
                    opts.onChange($this[0]);
                }
            });
            addBtn.click(function() {
                var value = $this.val() * 1;
                if (value < opts.max) {
                    $this.val(++value);
                    opts.onChange($this[0]);
                }
            });
        });
    };
})(jQuery);

/**
 * 弹出框
 */
(function($) {
    function open(container) {
        var opts = $.data(container, 'artDialog').options;
        var $this = $(container);
        var winHeight = $(window).height();
        var sctop = $(document).scrollTop();
        $this.css({
            "top": winHeight / 2 + sctop - $this.height() / 2,
            "margin-left": -($this.width() / 2)
        }).fadeIn('fast', function () {
            if(opts.autoOff) {
                opts.inter = setTimeout(function () {
                    close(container);
                }, opts.delay);
            }
        });
    }
    function close(container) {
        var opts = $.data(container, 'artDialog').options;
        $(container).hide();
        clearInterval(opts.inter);
    }
    function init(container) {
        var opts = $.data(container, 'artDialog').options;
        var $this = $(container);
        $this.find('.dialog-close').click(function () {
            close(container);
        });
        var cancel = $this.find('.dialog-footer .cancel').click(function () {
            close(container);
        });
        $this.find('.dialog-footer .ok').click(function () {
            $(container).hide();
        });
        if(opts.header) {
            $this.find('.dialog-header').show();
            //$this.find('.dialog-close').show();
        }
        if(opts.footer) {
            $this.find('.dialog-footer').show();
        }
    }
    $.fn.artDialog = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.artDialog.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'artDialog');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'artDialog', {
                    options: $.extend({}, $.fn.artDialog.defaults, options)
                });
                init(this);
            }
        });
    };
    $.fn.artDialog.methods = {
        options: function(jq) {
            return $.data(jq[0], 'artDialog').options;
        },
        open: function(jq) {
            return open(jq[0]);
        },
        close: function (jq) {
            return close(jq[0]);
        }
    }
    $.fn.artDialog.defaults = {
        autoOff: true, //自动关闭
        delay: 5000, //自动关闭时间
        header: false, //是否显示头部
        footer: false //是否显示底部
    };
})(jQuery);

$(function() {
    //图片延迟加载
    //$('img.lazy').lazyload();
    //下拉菜单
    $('.dropdown .dt').hover(function() {
        var dt = $(this);
        var dd = dt.next('.dd');
        dt.addClass('active');
        dd.show();

        $(this).find('.mask').hover(function() {
            dt.addClass('active');
            dd.show();
        });

        dd.hover(function() {
            dt.addClass('active');
            dd.show();
        }, function() {
            dt.removeClass('active');
            dd.hide();
        });
    }, function() {
        $(this).removeClass('active').next('.dd').hide();
    });
    //数字微调初始化
    $('.buy .count .num').NumSpinner();
});
