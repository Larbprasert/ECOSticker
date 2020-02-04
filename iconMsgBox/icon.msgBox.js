/// <reference path="icon.msgBox.js" />

/*!
* Licensed under Passakorn Netisri
*
* @version        1.1.0
* @since          17/06/2013
* @author         Passakorn Netisri
*/


; (function ($) {

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
                    class: "icon-modal cur-default"
                })
                    .css({ 'z-index': 2000 });

                self.option.closeOnClickOverlay = self.option.backDrop;

                if (!self.option.lockScreen) {
                    if (self.option.closeOnClickOverlay) {
                        $overlay.click(function () {
                            $.iconMsgBox.close();
                        });
                    }
                }
                $iconBox.append($overlay);

                var box = "";
                box += "<div " + (self.option.id == "" ? "" : ("id=\"iconmsgbox" + self.option.id) + "\"") + ">";

                if (self.option.title || self.option.showCloseButton) {
                    box += "    <div style=\"width:100%;position:absolute;top:0;left:0;border-bottom: 1px solid #e5e5e5;border-radius: 4px 4px 0 0;background-color: #eee;height: 40px;\">";
                    box += "        <div style=\"padding:11px 0 0 10px;font-size:15px;font-weight:bold;\">" + self.option.title + "</div>";
                    box += "    </div>";
                }

                box += "	<div style=\"padding: " + ((self.option.title || self.option.showCloseButton) ? "65px" : "30px") + " 15px 30px 15px;\">";
                if (self.option.icon != "") {
                    box += "        <span class=\"ui-icon " + self.option.icon + "\" style=\"display:inline-block;vertical-align:top;\"></span>";
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
                    var bt = "";
                    bt += "<button type='button' class='btn btn-default' style=\"margin-left:10px;min-width:40px;border-radius:4px;font-weight:lighter;padding:2px 9px;-webkit-box-shadow:none;\">";
                    //bt += "     <span class=\"image ui-iconBlack ui-icon-plus\"></span>";
                    bt += "     <span>" + item.text + "</span>";
                    bt += "</button>";

                    var $button = $(bt).click(function () {
                        item.click();
                    }).appendTo($('>div:last', $box));
                });

                if (!self.option.lockScreen) {
                    if (self.option.showCloseButton) {
                        var $btClose = $('<i class="fa fa-remove">').css({
                            position: "relative",
                            top: "-30px",
                            cursor: "pointer",
                            margin: "7px 7px 0 0",
                            float: "right"
                        }).click(function () {
                            myBox._close($(this));
                        }).appendTo($('>div:eq(0)', $box));
                    }
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

                $box.show("blind", function () {

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
                obj.parent().parent().hide("blind", function () {
                    obj.parent().parent().parent().remove();
                    if (typeof (self.option.closeCallback) == 'function') {
                        self.option.closeCallback();
                    }
                });
            },
            _close2: function (obj) {
                setTimeout(function () {
                    $('>div:eq(0)', obj).fadeOut('300');
                    $('>div:eq(1)', obj).hide("blind", function () {
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
        backDrop: true,
        lockScreen: false,
        closeCallback: null,
        closeCallbackDelay: 500,
        closeOnClickOverlay: true,
        css: {
            "background-color": "#fff",
            "display": "none",
            "border-radius": "6px",
            "left": "-9999px",
            //"position": "absolute",
            "font-size": "13px",
            "min-width": "300px",
            "max-width": "800px",
            "max-height": "700px",
            "position": "fixed",
            "top": "150px"
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
            $('div[icon-type=box] >div:eq(1)').hide("blind", function () {
                $(this).remove();
                $('div[icon-type=box]').remove();
            });

        }
        else {
            // hide Overlay
            $('div[icon-type=box][id=iconmsgboxoverlay' + id + '] >div:eq(0)').fadeOut('300');

            // hide Box
            $('div[icon-type=box][id=iconmsgboxoverlay' + id + '] >div:eq(1)').hide("blind", function () {
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
                closeOnClickOverlay: false,
                backDrop: false
            });
        },
        loading: function () {
            $.iconMsgBox({
                title: "",
                msg: "<div style='text-align:center;font-weight:bold;'><i class='fa fa-spinner fa-spin'></i>&nbsp;&nbsp;Loading...",
                showCloseButton: false,
                closeOnClickOverlay: false,
                backDrop: false,
                css: {
                    width: "200px",
                    "min-width": "200px"
                }
            });
        },
        pleaseWait: function () {
            $.iconMsgBox({
                title: "",
                msg: "<div style='text-align:center;font-weight:bold;'><i class='fa fa-cog fa-spin'></i>&nbsp;&nbsp;Please wait...",
                showCloseButton: false,
                closeOnClickOverlay: false,
                backDrop: false,
                css: {
                    width: "200px",
                    "min-width": "200px"
                }
            });
        },
        status: function (title, message, buttons) {
            $.iconMsgBox({
                title: title == "" || title == undefined ? "Status" : title,
                msg: message,
                showCloseButton: false,
                closeOnClickOverlay: false,
                backDrop: false,
                buttons: buttons == undefined ? []: buttons
            });
        }
    };

})(jQuery);






