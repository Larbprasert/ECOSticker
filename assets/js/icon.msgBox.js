
/*!
* Licensed under Passakorn Netisri
*
* @version        1.0.0
* @since          17/06/2013
* @author         Passakorn Netisri
*/


(function ($) {

    $.iconMsgBox = function (setting) {
        var self = this;
        self.option = $.extend({}, $.iconMsgBox.defaults, setting);
        self.option.css = $.extend({}, $.iconMsgBox.defaults.css, setting.css);

        var myBox = {
            init: function () {
                myBox._destroy();
                myBox._render();
            },
            _render: function () {
                var $iconBox = $('<div>', {
                    id: self.option.id == "" ? "" : "iconmsgboxoverlay" + self.option.id,
                    'icon-type': "box"
                });

                var $overlay = $('<div>', {
                    id: self.option.id == "" ? "" : "iconmsgboxoverlay" + self.option.id,
                    //class: "icon-modal cur-default",
                    css: {
                        'background-position': 'center center',
                        'background-repeat': 'no-repeat',
                        'position': 'fixed',
                        'top': '0',
                        'bottom': '0',
                        'left': '0',
                        'right': '0',
                        'background-color': '#000',
                        'z-index': '99',
                        'display': 'block',
                        'filter': 'alpha(opacity=160)',
                        '-moz-opacity': '.35',
                        'opacity': '.35',
                        'cursor': 'progress'
                    }
                }).css({ 'z-index': 2000 });

                if (self.option.closeOnClickOverlay) {
                    $overlay.click(function () {
                        $.iconMsgBox.close();
                    });
                }
                $iconBox.append($overlay);

                var box = "";
                box += "<div " + (self.option.id == "" ? "" : ("id=\"iconmsgbox" + self.option.id) + "\"") + ">";
                if (self.option.title || self.option.showCloseButton) {
                    box += "    <div style=\"width:100%;position:absolute;top:0;left:0;border-bottom: 1px solid #4BB777;border-radius: 4px 4px 0 0;background-color: #4EC67F;height: 40px;\">";
                    box += "        <div style=\"display:inline-block;padding:11px 0 0 10px;font-size:15px;font-weight:bold;color:white;\">" + self.option.title + "</div>";
                    box += "    </div>";
                }

                box += "	<div style=\"padding: " + ((self.option.title || self.option.showCloseButton) ? "65px" : "30px") + " 40px 30px 15px;\">";
                if (self.option.icon != "") {
                    box += "        <span class=\"ui-icon " + self.option.icon + "\" style=\"display:inline-block;;vertical-align:top;\"></span>";
                }
                box += "		" + self.option.msg;
                box += "	</div>";

                if (self.option.buttons.length > 0) {
                    box += "	<div style=\"position: relative;padding: 10px 10px 10px 30px;border-top: 1px dotted #ccc;text-align: right;\">";
                    box += "	</div>";
                }
                box += "</div>";
                var $box = $(box).css(self.option.css);

                $.each(self.option.buttons, function (index, item) {
                    //$.log(item);
                    var bt = "";
                    //bt += "<span class=\"icon-ui-button\" style=\"margin-left:10px;min-width:40px;border-radius:4px;font-weight:lighter;padding:2px 9px;-webkit-box-shadow:none;\">";
                    ////bt += "     <span class=\"image ui-iconBlack ui-icon-plus\"></span>";
                    //bt += "     <span>" + item.text + "</span>";
                    //bt += "</span>";
                    //alert(item.type);
                    bt += "<button type=\"button\" class=\"btn btn-" + (item.type == "" || item.type == undefined ? "default" : item.type) + " btn-sm\" style=\"margin-left:10px;margin-right:0 !important;border-radius:4px !important;\">" + item.text + "</button>";

                    var $button = $(bt).click(function () {
                        item.click();
                    }).appendTo($('>div:last', $box));
                });

                if (self.option.showCloseButton) {
                    //<span class=\"glyphicon glyphicon-pencil\"></span>
                    var $btClose = $('<span class="glyphicon glyphicon-remove"></span>').css({
                        cursor: "pointer",
                        margin: "7px 7px 0 0",
                        float: "right"
                    }).click(function () {
                        myBox._close($(this));
                    }).appendTo($('>div:eq(0)', $box));
                }

                $iconBox.append($box);
                myBox._show($iconBox);
            },
            _show: function (obj) {
                $('body').append(obj);
                var $box = $('>div:eq(1)', obj);

                var docWidth = document.body.clientWidth;
                var boxWidth = $box.width();

                var docHeight = document.body.clientHeight;
                var boxHeight = $box.height();

                var left = (docWidth / 2) - (boxWidth / 2) - 21;
                var top = window.pageYOffset + ((docHeight / 2) - (boxHeight / 2));
                top -= self.option.topMinus;

                $box.css({
                    left: left,
                    top: top,
                    "z-index": 2001,
                });

                if (self.option.css.position == "fixed") {
                    $box.css({
                        position: "fixed",
                        top: self.option.css.top
                    });
                }

                $box.slideToggle(300, function () {
                    if (self.option.autoClose) {
                        myBox._close2(obj)
                    }
                });
            },
            _close: function (obj) {
                // obj = button close

                // hide Overlay
                obj.parent().parent().prev().fadeOut('300');

                // hide Box
                obj.parent().parent().slideToggle(250, function () {
                    obj.parent().parent().parent().remove();
                    if (typeof (self.option.closeCallback) == 'function') {
                        self.option.closeCallback();
                    }
                });
            },
            _close2: function (obj) {
                setTimeout(function () {
                    $('>div:eq(0)', obj).fadeOut('300');
                    $('>div:eq(1)', obj).slideToggle(250, function () {
                        obj.remove();

                        if (typeof (self.option.closeCallback) == 'function') {
                            self.option.closeCallback();
                        }
                    });
                }, self.option.autoCloseDelay);

            },
            _destroy: function () {
                $('div[icon-type=box]').remove();
            }

        }

        return myBox.init();
    }

    $.iconMsgBox.defaults = {
        autoClose: false,
        autoCloseDelay: 1000,
        buttons: [],
        closeCallback: null,
        closeCallbackDelay: 500,
        closeOnClickOverlay: true,
        css: {
            "background-color": "#fff",
            "display": "none",
            //"border": "1px solid #fff",
            //"-moz-box-shadow": "0px 0px 10px 0px #5a5a5a",
            //"-webkit-box-shadow": "0px 0px 15px 0px #5a5a5a",
            //"box-shadow": "0px 0px 10px 0px #5a5a5a",
            //"padding": "30px 20px",
            "border-radius": "6px",
            "left": "-9999px",
            "position": "absolute",
            "font-size": "13px",
            "min-width": "300px"
        },
        icon: "",
        id: "",
        msg: "",
        topMinus: 0,
        showCloseButton: true,
        title: ""
    };

    $.iconMsgBox.close = function (id) {
        if (id == undefined || id == "") {
            // hide Overlay
            $('div[icon-type=box] >div:eq(0)').fadeOut('300');

            // hide Box
            $('div[icon-type=box] >div:eq(1)').slideToggle(300, function () {
                $(this).remove();
                $('div[icon-type=box]').remove();
            });

        }
        else {
            // hide Overlay
            $('div[icon-type=box][id=iconmsgboxoverlay' + id + '] >div:eq(0)').fadeOut('300');

            // hide Box
            $('div[icon-type=box][id=iconmsgboxoverlay' + id + '] >div:eq(1)').slideToggle(300, function () {
                $(this).remove();
                $('div[icon-type=box][id=iconmsgboxoverlay' + id + ']').remove();
            });
        }
        $.iconMsgBox.defaults.closeCallback = null;
    }
    $.iconMsgBox.template = {
        lockScreen: function (title, message) {
            $.iconMsgBox({
                title: title,
                msg: message,
                showCloseButton: false,
                closeOnClickOverlay: false
            });
        },
        loading: function (id) {
            var opt = {
                title: "",
                msg: "<div style='text-align:center;font-weight:bold;'><i class='fa fa-spin fa-spinner'></i>&nbsp;กำลังดำเนินการ...</div>",
                showCloseButton: false,
                closeOnClickOverlay: false
            };
            if (id != undefined && id != null && id != "") opt.id = id;
            $.iconMsgBox(opt);
        },
        pleaseWait: function (id) {
            var opt = {
                title: "",
                msg: "<div style='text-align:center;font-weight:bold;'><img src='../../images/shared/spinner.gif' class='btImg' />&nbsp;Please wait.</div>",
                showCloseButton: false,
                closeOnClickOverlay: false
            };
            if (id != undefined && id != null && id != "") opt.id = id;
            $.iconMsgBox(opt);
        }
    };
})(jQuery);






