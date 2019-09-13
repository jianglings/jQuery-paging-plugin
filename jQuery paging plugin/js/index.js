(function ($) {

    var page = {
        init: function (dom, obj) {
            this.fillHtml(dom, obj);
            this.blindEvent(dom, obj);
        },

        // 生成DOM 结构
        fillHtml: function (dom, obj) {
            // 每次点击都情况原来的，重新生成
            dom.empty();
            // 简单容错处理
            if (obj.current < 1 || obj.pageCount < 1 || obj.pageCount < obj.current) return;

            // 插入上一页
            if (obj.current == 1) {
                dom.append('<span class="disabled"> <上一页 </span> ')
            } else {
                dom.append('<span class="prev"> <上一页 </span> ')
            }

            // 插入中间项
            // 页数小于7的情况下
            if (obj.pageCount <= 7) {
                for (var i = 1; i <= 7; i++) {
                    if (i == obj.current) {
                        dom.append('<a href="javascript:;" class="disabled">' + obj.current + '</a>')
                    } else {
                        dom.append('<a href="javascript:;" class="page">' + i + '</a>')
                    }
                }
                // 页数大于7的情况下
            } else if (obj.pageCount > 7) {
                if (obj.current > 4) {
                    dom.append('<a href="javascript:;" class="page">' + 1 + '</a>')
                    dom.append(' <span class="omit">...</span>');
                }
                var start = obj.current - 2,
                    end = obj.current + 2;

                if (obj.current <= 4) {
                    start = 1;
                    end = 6;
                } else if (obj.current >= obj.pageCount - 3) {
                    start = obj.pageCount - 5;
                    end = obj.pageCount;
                }
                for (start; start <= end; start++) {
                    if (start == obj.current) {
                        dom.append('<a href="javascript:;" class="disabled">' + obj.current + '</a>')
                    } else {
                        dom.append('<a href="javascript:;" class="page">' + start + '</a>')
                    }
                }

                if (obj.current < obj.pageCount - 3) {
                    dom.append(' <span class="omit">...</span>');
                    dom.append('<a href="javascript:;" class="page">' + obj.pageCount + '</a>')
                }
            }

            // 插入下一页
            if (obj.current == obj.pageCount) {
                dom.append('<a href="javascript:;" class="disabled">下一页></a>')
            } else {
                dom.append('<a href="javascript:;" class="next">下一页></a>')
            }

        },

        // 事件绑定
        blindEvent: function (dom, obj) {
            var _this = this;
            dom.on('click', '.page', function () {
                /* 绑定了点击事件 此时 this --> .page
                但是重新渲染页面之后需要     this  --> page 
                blindEvent 在init中被调用
                init 被 page 调用  
                this  --> page 
                在绑定事件之前，将this (指向 page时)用一个变量（_this）存储起来
                _this 则指向 page
                */
                obj.current = parseInt($(this).text());
                // 重新渲染dom结构
                _this.fillHtml(dom, obj);
                obj.cb();
            })

            dom.on('click', function (e) {
                target = e.target;
                if (target.className == 'prev') {
                    if (obj.current >= 1) {
                        obj.current--;
                    } else {
                        obj.current = 1;
                    }
                } else if (target.className == 'next') {
                    if (obj.current <= obj.pageCount) {
                        obj.current++;
                    } else {
                        obj.current = obj.pageCount;
                    }
                } else {
                    return;
                }
                // current 值改变，重新渲染
                _this.fillHtml(dom, obj);
                obj.cb();
            })
        }
    }

    $.fn.paging = function (options) {
        // 用户未传入参数时的默认参数
        var obj = {
            pageCount: 10,
            current: 1,
            cb: function () {
                console.log("default");
            }
        }

        // 合并参数 ,以用户传入的为主
        var args = $.extend(obj, options);
        page.init(this, args);
    }
})($)