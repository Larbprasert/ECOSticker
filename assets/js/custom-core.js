/// <reference path="../Scripts/jquery-2.0.3.js" />

(function ($, undefined) {

    $.fn.reverse = [].reverse;
    $.fn.numberBox = function () {
        return this.each(function () {
            $(this).keypress(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57));
            });
        });
    }
    $.fn.moneyBox = function (digit) {
        return this.each(function () {
            $(this).keypress(function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 46 || (key >= 48 && key <= 57));
                //|| key == 44 ,
            });

            $(this).focusout(function (e) {
                if ($(this).val().length > 0) {
                    var result = $.parseMoney($(this).val(), digit);
                    $(this).val(result);
                }
            });
        });
    }
    $.extend({
        ERROR: {
            DATA_TYPE: 'DATA ที่กำหนดต้องเป็น ARRAY เท่านั้น',
            URL: 'URL ที่กำหนดต้องเป็น STRING เท่านั้น',
            PARAM: 'PARAM ที่กำหนดต้องเป็น JSON,CLASS เท่านั้น',
            LOAD: 'ไม่สามารถโหลดข้อมูลได้',
            UNDEFINED_DATA: 'ไม่ได้ระบุ URL หรือ DATA'
        },
        cThread: function () {
            return $.cookies.get("thid") == null ? "" : $.cookies.get("thid");
        },
        dateNowAsp: function () {
            return (new Date()).toAspNetDateTime();
        },
        ifNull: function (value, defaultvalue) {
            return ((value == null) || (value == undefined)) ? defaultvalue : value;
        },
        post2: function (obj) {
            return $.ajax({
                contentType: obj.contentType == undefined ? "application/json; charset=utf-8" : obj.contentType,
                dataType: obj.dataType == undefined ? "json" : obj.dataType,
                type: obj.type == undefined ? "POST" : obj.type,
                url: obj.url,
                data: (typeof (obj.data) == "string") ? obj.data : JSON.stringify(obj.data),
                timeout: obj.timeout == undefined ? 0 : obj.timeout,
                crossDomain: obj.crossDomain == undefined ? false : obj.crossDomain,
                //headers: {},
                beforeSend: function (jqXHR, settings) {
                    if ($.isFunction(obj.beforeSend)) {
                        obj.beforeSend(jqXHR, settings);
                    }
                },
                complete: function (jqXHR, textStatus) {
                    if ($.isFunction(obj.complete)) {
                        obj.complete(jqXHR, textStatus);
                    }
                },
                success: function (ret) {
                    if ($.isFunction(obj.success)) {
                        obj.success(ret);
                    }
                },
                error: function (er) {
                    if ($.isFunction(obj.error)) {
                        if (er.readyState != 0 && er.statusText != "abort") {
                            obj.error(er.statusText + ", " + er.responseText);
                        }
                    }
                }
            });
        },
        log: function (obj) {
            var settings = {
                power: true,
                timer: true
            }

            if (settings.power) {
                if (typeof (obj) === "object") {
                    if (window.console) console.log(obj);
                    return;
                }
                if (settings.timer) {
                    var d = new Date(), hours = d.getHours(), minutes = d.getMinutes(), seconds = d.getSeconds(), miliseconds = d.getMilliseconds();
                    if (minutes < 10) { minutes = "0" + minutes }
                    if (seconds < 10) { seconds = "0" + seconds }
                    if (miliseconds < 10) { miliseconds = "00" + miliseconds }
                    else if (miliseconds < 100) { miliseconds = "0" + miliseconds }
                    obj = '[' + hours + ':' + minutes + ':' + seconds + '.' + miliseconds + ']  ' + obj;
                }
                if (window.console) console.log(obj);
            }
        },
        parameter: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) return "";
            else return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        parseInt: function (a) {
            a = $.removeCurrencyFormat(a);
            a = parseFloat(a);
            a = a.toFixed(0);
            return a;
        },
        parseDecimal: function (a, d) {
            var digit = 2;
            if (d != undefined) { digit = d; }
            a = $.removeCurrencyFormat(a);
            a = parseFloat(a);
            a = a.toFixed(digit);
            return a;
        },
        parseMoney: function (a, d) {
            a = $.removeCurrencyFormat(a);
            var values = parseFloat(a);
            var digit = 2;
            if (d != undefined) { digit = d; }
            values = values.toFixed(digit);
            var Nagative = false;
            if (values.toString().indexOf("-") != -1) {
                Nagative = true;
                values = Math.abs(values);
            }
            if (!isNaN(values)) {
                values = values.toString().split('.');
                if (values[0] == "") { values = "0"; }
                if (values.length == 1) {
                    values += ".00";
                    values = values.split('.');
                }
                var Result = "", a = values[0].length % 3;
                if (a != 0) {
                    Result = values[0].substring(0, a) + ",";
                    values[0] = values[0].substring(a, values[0].length);
                }
                for (var i = 0; i < values[0].length - 1; i += 3) {
                    Result += values[0].substring(i, i + 3) + ",";
                }
                if (Nagative) {
                    if (digit == 0) { return "-" + Result.substring(0, Result.length - 1); }
                    else { return "-" + Result.substring(0, Result.length - 1) + "." + values[1].substring(0, digit); }
                }
                else {
                    if (digit == 0) { return Result.substring(0, Result.length - 1); }
                    else { return Result.substring(0, Result.length - 1) + "." + values[1].substring(0, digit); }
                }
            } else { return "0.00"; }
        },
        removeCurrencyFormat: function (a) {
            var myarray = a.toString().split(',');
            return myarray.join('');
        },
        formatFileSize: function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        },
        formatBitrate: function (bits) {
            if (typeof bits !== 'number') {
                return '';
            }
            if (bits >= 1000000000) {
                return (bits / 1000000000).toFixed(2) + ' Gbit/s';
            }
            if (bits >= 1000000) {
                return (bits / 1000000).toFixed(2) + ' Mbit/s';
            }
            if (bits >= 1000) {
                return (bits / 1000).toFixed(2) + ' kbit/s';
            }
            return bits.toFixed(2) + ' bit/s';
        },
        dateNow: function (lang) {
            var curdate = new Date();
            return lang == "th" ? curdate.getThaiDateShort() : curdate.getEngDateShort();
        },
        GUID: function () {
            var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        randomNumber: function (d) {
            if (d == undefined) { d = 4; }
            return Math.random().toFixed(d) * Math.pow(10, d);
        },
        numberFormat: function (iStr) {
            iStr += "";
            var val = iStr == "" ? 0.00 : parseFloat(iStr);
            val = val.toFixed(2);

            return $.addComma(val);
        },
        intFormat: function (iStr) {
            iStr += "";
            var val = iStr == "" ? 0.00 : parseFloat(iStr);
            val = val.toFixed(0);

            return $.addComma(val);
        },
        addComma: function (nStr) {
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
       
        cloneObject: function (data) {
            var obj = {};
            $.each(data, function (name, value) {
                obj[name] = value;
            });
            return obj;
        }
    });

    // ==================================================================================================
    // ============================================== PROTOTYPE

    Boolean.parse = function (value) {
        if (value == null) {
            throw new Error("Boolean.parse: Cannot convert NULL to boolean.");
            return false;
        }

        switch (value.toLowerCase()) {
            case "true":
                return true;
            case "false":
                return false;
            default:
                throw new Error("Boolean.parse: Cannot convert string to boolean.");
        }
    }

    String.prototype.toDateFromAspNet = function () {
        //var d = new Date(parseInt(this.slice(6, -2)));
        //d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        //return d;

        var a = this.slice(0, -5);
        var b = a.split("T");
        var dd = b[0].split("-");
        var tt = b[1].split(":");

        var result = new Date(dd[0], (parseFloat(dd[1]) - 1), dd[2], tt[0], tt[1], tt[2], this.slice(-4, -1));

        return result;
    }
    String.prototype.toDateFromAspNetUTC = function () {
        var result = this.toDateFromAspNet();
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }
    Date.prototype.toAspNetDateTime = function () {
        var d, m, y,
            hh, mm, ss, ms;

        d = this.getDate();
        m = this.getMonth() + 1;
        y = this.getFullYear();
        hh = this.getHours();
        mm = this.getMinutes();
        ss = this.getSeconds();
        ms = this.getMilliseconds();

        //return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss) + "." + (ms < 10 ? "0" + ms : ms);
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + "T" + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss) + "." + (ms < 10 ? "0" + ms : ms) + "Z";
    }
    Date.prototype.toThaiDateShort = function (withtime) {
        var d = this.getDate(),
            m = this.getMonth(),
            y = this.getFullYear();

        var months_1 = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
            months_2 = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

        if (y < 2500) {
            y += 543;
        }

        if (withtime == null || withtime == false) {
            return d + " " + months_2[m] + " " + y;
        }
        else {
            var hh = this.getHours(),
                mm = this.getMinutes(),
                ss = this.getSeconds();

            return d + " " + months_2[m] + " " + y + " " + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + "";
        }
    }
    Date.prototype.getThaiDate = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth() + 1,
            y = mydate.getFullYear();

        if (y < 2500) {
            y += 543;
        }

        return d + "/" + m + "/" + y;
    }
    Date.prototype.getThaiDateFull = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth(),
            y = mydate.getFullYear();

        var months_1 = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
            months_2 = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

        if (y < 2500) {
            y += 543;
        }

        return d + " " + months_1[m] + " " + y;
    }
    Date.prototype.getThaiDateShort = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth(),
            y = mydate.getFullYear();

        var months_1 = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
            months_2 = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

        if (y < 2500) {
            y += 543;
        }

        return d + " " + months_2[m] + " " + y;
    }
    Date.prototype.getEngDate = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth() + 1,
            y = mydate.getFullYear();

        if (y > 2500) {
            y -= 543;
        }

        return d + "/" + m + "/" + y;
    }
    Date.prototype.getEngDateFull = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth(),
            y = mydate.getFullYear();

        var months_1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            months_2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (y > 2500) {
            y -= 543;
        }

        return months_1[m] + " " + d + ", " + y;
    }
    Date.prototype.getEngDateShort = function () {
        var mydate = new Date(),
            d = mydate.getDate(),
            m = mydate.getMonth(),
            y = mydate.getFullYear();

        var months_1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            months_2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (y > 2500) {
            y -= 543;
        }

        return months_2[m] + " " + d + ", " + y;
    }
    Date.prototype.customFormat = function (formatString) {
        var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
        var dateObject = this;
        YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2);
        MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M;
        MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
        DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D;
        DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3);
        th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
        formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

        h = (hhh = dateObject.getHours());
        if (h == 0) h = 24;
        if (h > 12) h -= 12;
        hh = h < 10 ? ('0' + h) : h;
        AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
        mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m;
        ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s;
        return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
    }


    // ==================================================================================================
    // ============================================== JSON

    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
        s = {
            'array': function (x) {
                var a = ['['], b, f, i, l = x.length, v;
                for (i = 0; i < l; i += 1) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            a[a.length] = v;
                            b = true;
                        }
                    }
                }
                a[a.length] = ']';
                return a.join('');
            },
            'boolean': function (x) {
                return String(x);
            },
            'null': function (x) {
                return "null";
            },
            'number': function (x) {
                return isFinite(x) ? String(x) : 'null';
            },
            'object': function (x) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    var a = ['{'], b, f, i, v;
                    for (i in x) {
                        v = x[i];
                        f = s[typeof v];
                        if (f) {
                            v = f(v);
                            if (typeof v == 'string') {
                                if (b) {
                                    a[a.length] = ',';
                                }
                                a.push(s.string(i), ':', v);
                                b = true;
                            }
                        }
                    }
                    a[a.length] = '}';
                    return a.join('');
                }
                return 'null';
            },
            'string': function (x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            }
        };
    $.toJSON = function (v) {
        var f = isNaN(v) ? s[typeof v] : s['number'];
        if (f) return f(v);
    };
    $.parseJSON = function (v, safe) {
        if (safe === undefined) safe = $.parseJSON.safe;
        if (safe && !/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(v))
            return undefined;
        return eval('(' + v + ')');
    };
    $.parseJSON.safe = false;

})(jQuery);



/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}


function SignalrHub(url, hubName, api) {
    var self = this;

    self.url = url == undefined ? "" : url;
    self.hubName = hubName == undefined ? "" : hubName;
    self.api = api == undefined ? false : api;
    self.logging = false;
    self.connection = null;
    self.proxy = null;

    self.start = function () {
        self.connection = $.hubConnection(self.url, { logging: self.logging });
        self.proxy = self.connection.createHubProxy(self.hubName);

        self.connection.start({ jsonp: self.api })
            .done(function () {
                toastr.success("connect to '" + self.hubName + "' success");
            }).fail(function (e) {
                toastr.error("connect to '" + self.hubName + "' error: " + e);
            });
    }
}