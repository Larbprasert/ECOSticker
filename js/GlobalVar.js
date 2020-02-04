/// <reference path="../Scripts/cookies.js" />

var GlobalVar = {
    Url: {
        Root: "",
        API: ""
    },
    Init: function () {
        var self = this;


    },
    useronline: function () {

        var cookie = $.cookie("userecosticker");
        if (cookie != null) {
            cookie = JSON.parse($.cookie("userecosticker"));

        } else if (cookie == undefined || cookie == null) {
            window.location.href = _root + '/login/index';
        } else if (cookie = "") {
            window.location.href = _root + '/login/index';
        }
        return cookie;

    }
    
}