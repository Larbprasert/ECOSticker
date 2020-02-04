
!function ($) {

    /* 
		EVENT - rowCreate  - rowCreated  - rowClick - rowSelect - finish
		METHOD - reload - select - previous - next - search - sort
	*/

    $.widget("custom.table", {
        // ========================================================================== SYSTEM - OPTION
        options: {
            url: "",
            data: "",
            buttons: null,
            rowPerPage: 10,
            autoReload: 0,
            searchBar: true,
            pageBar: true,
            pagination: true,
            border: true,
            striped: true,
            condensed: false,
            debug: false
        },
        // ========================================================================== SYSTEM - METHOD
        _create: function () {
            this._log("Widget - Create");
            // ====================================================================== 

            this.controllers = {
                container: null,
                thead: null,
                tbody: null,
                tfoot: null,
                txt_status: null,
                tbx_search: null,
                cbx_all: null,
                txt_pagedetail: null,
                pagination: null
            };

            this.variables = {
                header: [],
                key: "",
                page: { current: 0, max: 0 },
                sort: { column: "", direction: "" },
                searchText: "",
                xhr: null,
                timeout: null,
                selected: {
                    data: [],
                    add: function (value) {
                        if ($.inArray(value, this.data) == -1) {
                            this.data.push(value);
                        }
                    },
                    remove: function (value) {
                        this.data = $.grep(this.data, function (obj) {
                            return obj != value;
                        });
                    },
                    check: function (value) {
                        if ($.inArray(value, this.data) != -1) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            };

            this._setControllers();
            this._setEvents();
        },
        _init: function () {
            this._log("Widget - Init");
            //  ======================================================================

            var self = this,
               options = self.options,
               variables = self.variables,
               controllers = self.controllers;

            this.reload(function () {
                controllers.container.trigger("finish", null);
            });
        },
        _setOption: function (key, value) {
            this._log("Widget - SetOption");
            //  ======================================================================

            this._log(key + ": " + value);

            if (key === "data") {
                this.options.data = value;
                this.reload();
            }

            //this.options[key] = value;
            this._super(key, value);
        },
        _setOptions: function (options) {
            this._log("Widget - SetOptions");
            //  ======================================================================

            this._log(options);

            //this.options = options;
            this._super(options);
        },
        _destroy: function () {
            this._log("Widget - Destroy");
            //  ======================================================================

            this.element.removeClass("custom-table").html("");
        },


        // ========================================================================== MY - METHOD
        _setControllers: function () {
            this._log("Widget - Set Controller");
            // ====================================================================== 

            var self = this,
                options = self.options,
                variables = self.variables,
                controllers = self.controllers;

            //  container
            controllers.container = this.element;
            controllers.container.addClass("custom-table table table-hover");

            if (options.border) {
                controllers.container.addClass("table-bordered");
            }
            if (options.striped) {
                controllers.container.addClass("table-striped");
            }
            if (options.condensed) {
                controllers.container.addClass("table-condensed");
            }

            //  thead
            controllers.thead = controllers.container.find("thead");

            //  tbody
            controllers.tbody = controllers.container.find("tbody");
            if (controllers.tbody.length == 0) {
                controllers.tbody = $("<tbody>").insertAfter(controllers.thead);
            }
            else {
                controllers.tbody.html("");
            }

            //  tfoot
            controllers.tfoot = controllers.container.find("tfoot");
            if (controllers.tfoot.length == 0) {
                controllers.tfoot = $("<tfoot>").insertAfter(controllers.tbody);
            }
            else {
                controllers.tfoot.html("");
            }

            //  searchbar
            if (options.searchBar) {
                $('<caption><label class="custom-table-status pull-left text-info"></label><input type="text" placeholder="' + $.custom.table.placeHolder + '" class="custom-table-search pull-right" /></caption>').insertBefore(controllers.thead);

                //  txt_status
                controllers.txt_status = controllers.container.find(".custom-table-status");
                //  tbx_search
                controllers.tbx_search = controllers.container.find(".custom-table-search");
            }


            //  checkbox
            controllers.thead.find("[role=checkbox]").append('<input type="checkbox"/>');
            controllers.cbx_all = controllers.thead.find(":checkbox:first");

            //  sort
            controllers.thead.find("[data-sort]").each(function (index, th) {
                $(th).attr("data-direction", "none").append('<i class="pull-right"></i>');
            });

            //  data
            var all_th = controllers.thead.find("th");
            $.each(all_th, function (index, th) {
                var type, data, align, $th = $(th);

                if ($th.attr("role") != undefined) {
                    if ($th.attr("role") == "checkbox") {
                        variables.key = $th.attr("data-key");
                        type = "checkbox";
                        data = $th.attr("data-column");
                        align = "center";
                    }
                    else {
                        type = "button";
                        align = "center";
                    }
                }
                else {
                    type = "column";
                    data = $th.attr("data-column");
                    align = "left";
                }

                align = $th.attr("data-align") ? $th.attr("data-align") : align;

                variables.header.push({
                    "type": type,
                    "data": data ? data : "",
                    "align": "data-" + align
                });
            });

            //  pagebar
            if (options.pageBar) {
                var page_html = '<div class="text-info custom-table-pagination-detail"></div>';
                //page_html += '<div class="text-info custom-table-pagination-detail"></div>';
                if (options.pagination) {
                    page_html += '<div class="pagination pagination-right custom-table-pagination pagination-small"></div>';
                }

                $('<tr><td colspan="' + all_th.length + '">' + page_html + '</td></tr>').appendTo(controllers.tfoot);

                //  txt_pagedetail
                controllers.txt_pagedetail = controllers.tfoot.find(".custom-table-pagination-detail");

                //  ul_pagination
                controllers.pagination = controllers.tfoot.find(".custom-table-pagination");
                if (options.pagination) {
                    for (var i = 0; i < 4; i++) {
                        $("<button>")
                            .attr("type", "button")
                            .addClass("btn btn-mini btn-inverse")
                            .appendTo(controllers.pagination);
                    }

                    var btns_page = controllers.pagination.find("button");
                    btns_page.eq(0).html('<i class="icon-white icon-fast-backward"></i>' + $.custom.table.page.first).click(function () {
                        self.first();
                    });
                    btns_page.eq(1).html('<i class="icon-white icon-backward"></i>' + $.custom.table.page.previous).click(function () {
                        self.prev();
                    });
                    btns_page.eq(2).html('<i class="icon-white icon-forward"></i>' + $.custom.table.page.next).click(function () {
                        self.next();
                    });
                    btns_page.eq(3).html('<i class="icon-white icon-fast-forward"></i>' + $.custom.table.page.last).click(function () {
                        self.last();
                    });
                }
            }

            //  create row
            var td_length = all_th.length;
            for (var i = 0; i < options.rowPerPage; i++) {
                var tr = $("<tr>").appendTo(controllers.tbody);
                for (var j = 0; j < td_length; j++) {
                    var td = $("<td>").addClass(variables.header[j].align).append("&nbsp;").appendTo(tr);
                }
            }
        },
        _setEvents: function () {
            this._log("Widget - Set Event");
            // ====================================================================== 

            var self = this,
                options = self.options,
                variables = self.variables,
                controllers = self.controllers;

            //  events
            controllers.thead
                .on("click", "th[data-sort]", function () {
                    var column, direction, $this, $icon;

                    $this = $(this);
                    $icon = $this.find("i").removeClass("icon-circle-arrow-up icon-circle-arrow-down");
                    column = $this.attr("data-sort");
                    direction = $this.attr("data-direction");


                    //  sort hilight
                    //var selected_index = controllers.thead.find("th").index(this);
                    //controllers.container.find(".sorted").removeClass("sorted");
                    //$this.addClass("sorted");
                    //controllers.tbody.find("tr").each(function () {
                    //    $(this).find("td:eq(" + selected_index + ")").addClass("sorted");
                    //});


                    // clear
                    $this.siblings().find("i").removeClass("icon-circle-arrow-up icon-circle-arrow-down");

                    switch (direction) {
                        case "none":
                            direction = "ascending";
                            $icon.addClass("icon-circle-arrow-up");
                            break;
                        case "descending":
                            direction = "ascending";
                            $icon.addClass("icon-circle-arrow-up");
                            break;
                        default:
                            direction = "descending";
                            $icon.addClass("icon-circle-arrow-down");
                            break;
                    }

                    $this.attr("data-direction", direction);

                    self.sort(column, direction);
                })
                .on("mouseover", "th[data-sort]", function () {
                    $(this).find("i").addClass("icon-resize-vertical");
                })
                .on("mouseout", "th[data-sort]", function () {
                    $(this).find("i").removeClass("icon-resize-vertical");
                });

            controllers.tbody
                .on("click", "td", function (e) {
                    e.stopPropagation();

                    var tr = $(this).parent(),
                        tr_data = tr.data("table-data");

                    if (tr_data != undefined) {
                        controllers.container.trigger("rowClick", { data: tr_data });
                    }
                })
                .on("dblclick", "td", function (e) {
                    e.stopPropagation();

                    var tr = $(this).parent(),
                        tr_data = tr.data("table-data");

                    if (tr_data != undefined) {
                        controllers.container.trigger("rowDblClick", { data: tr_data });
                    }
                })
                .on("click", ":checkbox", function (e) {
                    e.stopPropagation();

                    if (controllers.cbx_all.is(":checked")) {
                        controllers.cbx_all.prop("checked", false);
                    }

                    var $this = $(this),
                        tr = $this.parent().parent(),
                        tr_data = tr.data("table-data");

                    if ($this.is(":checked")) {
                        tr.addClass("info");
                    }
                    else {
                        tr.removeClass("info");
                    }

                    if (tr_data != undefined) {
                        self._selectCheckbox($this.is(":checked"), tr_data);
                        controllers.container.trigger("rowSelect", {
                            checked: $this.is(":checked"),
                            data: tr_data
                        });
                    }
                })
                .on("dblclick", ":checkbox", function (e) {
                    e.preventDefault();
                    return false;
                });


            if (controllers.cbx_all.length > 0) {
                controllers.cbx_all.click(function (e) {
                    e.stopPropagation();

                    var $this, cb_all, tr_all, tr_data_array;

                    $this = $(this);
                    cb_all = controllers.tbody.find(":checkbox").prop("checked", $this.is(":checked"));
                    tr_all = cb_all.parent().parent();
                    tr_data_array = [];

                    if ($this.is(":checked")) {
                        tr_all.addClass("info");
                    }
                    else {
                        tr_all.removeClass("info");
                    }

                    $.each(tr_all, function (index_tr, value_tr) {
                        tr_data_array.push($(value_tr).data("table-data"));
                        if (index_tr == tr_all.length - 1) {

                            self._selectCheckbox($this.is(":checked"), tr_data_array);

                            self.controllers.container.trigger("rowSelect", {
                                checked: $this.is(":checked"),
                                data: tr_data_array
                            });
                        }
                    });
                });
            }

            if (options.searchBar) {
                controllers.tbx_search.keyup(function () {
                    var search_value = $(this).val();
                    if (variables.searchText == search_value) {
                        return;
                    }
                    self.search(search_value);
                });
            }
        },
        _selectCheckbox: function (checked, data) {
            var self = this,
               options = self.options,
               variables = self.variables,
               controllers = self.controllers;

            if (checked) {
                if ($.isArray(data)) {
                    $.each(data, function (index, value) {
                        variables.selected.add(value[variables.key]);
                    });
                }
                else {
                    variables.selected.add(data[variables.key]);
                }
            }
            else {
                if ($.isArray(data)) {
                    $.each(data, function (index, value) {
                        variables.selected.remove(value[variables.key]);
                    });
                }
                else {
                    variables.selected.remove(data[variables.key]);
                }
            }
        },


        // ======================================================= PRIVATE
        _log: function (value) {
            if ($.isFunction($.log) && this.options.debug) {
                $.log(value);
            }
        },
        _loadData: function (callback) {
            this._log("Widget - LoadData");
            //  ======================================================================

            var options = this.options,
                variables = this.variables,
                send_data;

            if (typeof options.data == "string") {
                if ($.trim(options.data).length > 0) {
                    options.data = $.parseJSON(options.data);
                }
                else {
                    options.data = {};
                }
            }

            send_data = options.data;
            send_data["param"] = {
                "SearchText": variables.searchText,
                "SortColumn": variables.sort.column,
                "SortType": variables.sort.direction == "none" ? "" : variables.sort.direction,
                "RowPerPage": options.rowPerPage,
                "CurrentPage": variables.page.current
            }

            if (variables.xhr != null) {
                variables.xhr.abort();
                variables.xhr = null;
            }

            //variables.xhr = $.post2({
            //    url: options.url,
            //    data: send_data,
            //    success: function (ret) {
            //        if ($.isFunction(callback)) {
            //            callback(ret.d);
            //        }
            //        variables.xhr = null;
            //    },
            //    error: function (er) { $.log(er); }
            //});


            variables.xhr = $.ajax({
                type: "POST",
                url: options.url,
                data: { '': JSON.stringify(send_data["param"]) },
                success: function (ret) {
                    if ($.isFunction(callback)) {
                        callback(ret);
                    }
                    variables.xhr = null;
                },
                error: function (er) { $.log(er); }
            });
        },
        _bindData: function (data, callback) {
            this._log("Widget - Bind");
            //  ======================================================================

            var self = this,
                options = self.options,
                variables = self.variables,
                controllers = self.controllers;

            controllers.cbx_all.prop("checked", false);

            var data_length = data.length;

            var tr_all = controllers.tbody.find("tr").removeData("table-data").removeClass("info");
            tr_all.find("td").html("&nbsp;");

            if (data_length > 0) {
                data_length--;
                $.each(data, function (index_data, value) {
                    var tr = tr_all.eq(index_data).data("table-data", value);
                    var td_all = tr.find("td");

                    $.each(variables.header, function (index_header, obj) {
                        var td = td_all.eq(index_header);

                        if (obj.type == "checkbox") {
                            td.html('<input type="checkbox"/>');

                            if (value[obj.data] == "true") {
                                tr.addClass("info").find(":checkbox").prop("checked", true);
                            }
                            else {
                                tr.find(":checkbox").prop("checked", false);
                            }
                        }
                        else if (obj.type == "button") {
                            $.each(options.buttons, function (propname, propvalue) {
                                var btntext, btnobj;
                                btntext = propname;
                                btnobj = propvalue;

                                var btn = $("<button>", { "type": "button" }).addClass("btn btn-mini " + btnobj.class).html(btnobj.text == false ? "" : "&nbsp;" + btntext);
                                var btn_icon = $("<i>").addClass(btnobj.icon).prependTo(btn);

                                btn.click(function (e) {
                                    e.stopPropagation();

                                    var tr = $(this).parent().parent();

                                    if ($.isFunction(btnobj.click)) {
                                        btnobj.click({ data: tr.data("table-data") });
                                    }
                                });

                                td.append(btn);
                            });
                        }
                        else {
                            td.html(value[obj.data]);
                        }
                    });

                    //controllers.container.trigger("rowCreate", {
                    //    data: value,
                    //    selected: variables.selected
                    //});

                    if (variables.key != "") {

                        if (variables.selected.check(value[variables.key])) {
                            tr.addClass("info").find(":checkbox").prop("checked", true);
                        }
                        else {
                            tr.find(":checkbox").prop("checked", false);
                        }
                    }

                    controllers.container.trigger("rowCreated", {
                        data: value,
                        select: tr
                    });

                    //  ======================================================================
                    if (index_data == data_length) {
                        controllers.container.trigger("finish", null);
                        callback();
                    }
                });
            }
            else {
                callback();
            }
        },
        _bindPage: function (data) {
            var self = this,
                options = self.options,
                variables = self.variables,
                controllers = self.controllers;

            variables.page.max = parseFloat(data / options.rowPerPage);

            var num_array = variables.page.max.toString().split(".");
            if (num_array.length > 1) {
                variables.page.max = parseFloat(num_array[0]) + 1;
            }

            controllers.txt_pagedetail.html("<small>" + $.custom.table.page.detail.replace("{0}", (variables.page.current + 1)).replace("{1}", (variables.page.max == 0 ? 1 : variables.page.max)).replace("{2}", data) + "</small>");
        },
        _status: function (text) {
            var self = this,
                options = self.options,
                controllers = self.controllers;

            if (options.searchBar) {
                switch (text) {
                    case "loading...":
                        controllers.txt_status.addClass("loading");
                        break;
                    default:
                        controllers.txt_status.removeClass("loading");
                        break;
                }
                controllers.txt_status.html(text);
            }
            else {
                // โชวตรงกลางเลย
            }

        },


        // ======================================================= PUBLIC
        // โหลดข้อมูลใหม่
        reload: function () {
            // ====================================================================== loading

            // ======================================================================
            var self = this,
                options = self.options,
                variables = self.variables,
                controllers = self.controllers;

            self._status("loading...");

            self._loadData(function (ret) {
                self._bindPage(ret[1]);
                self._bindData(ret[0], function () {

                    self._status("");

                    if (options.autoReload > 0) {
                        clearTimeout(variables.timeout);
                        variables.timeout = setTimeout(function () {
                            self.reload();
                        }, options.autoReload * 1000);
                    }
                });
            });
        },
        // เลือกอะไรอยู่บ้าง , ให้เลือกอะไร
        select: function (value) {
            this._log("Widget - Select");

            var self = this,
               options = self.options,
               variables = self.variables,
               controllers = self.controllers;

            if (value == null) {
                return variables.selected.data;
            }
            else {
                if ($.isArray(value)) {
                    variables.selected.data = value;
                }
                else {
                    variables.selected.add(value);
                }
                variables.page.current = 0;
                self.reload();
            }
        },
        //  ลบที่เลือก
        clear: function () {
            var self = this,
               options = self.options,
               variables = self.variables,
               controllers = self.controllers;

            variables.selected.data = [];
            variables.page.current = 0;
        },
        // หน้าแรก
        first: function () {
            var self = this, variables = self.variables;
            if (variables.page.current == 0) {
                return;
            }
            variables.page.current = 0;
            self.reload();
        },
        // ย้อนกลับ
        prev: function () {
            var self = this, variables = self.variables;
            if (variables.page.current == 0) {
                return;
            }
            variables.page.current--;
            self.reload();
        },
        // ถัดไป
        next: function () {
            var self = this, variables = self.variables;
            if (variables.page.current == variables.page.max - 1) {
                return;
            }
            variables.page.current++;
            self.reload();
        },
        // หน้าสุดท้าย
        last: function () {
            var self = this, variables = self.variables;
            if (variables.page.current == variables.page.max - 1) {
                return;
            }
            variables.page.current = variables.page.max - 1;
            self.reload();
        },
        // ค้นหา
        search: function (value) {
            var self = this, variables = self.variables;
            variables.searchText = value;
            variables.page.current = 0;
            self.reload();
        },
        // เรียงลำดับ
        sort: function (column, direction) {
            var self = this, variables = self.variables;
            variables.sort.column = column;
            variables.sort.direction = direction == "descending" ? "asc" : "desc";
            self.reload();
        },
    });


    // ============================================================================== EXTEND - PROPERTY
    $.extend($.custom.table, {
        placeHolder: "พิมพ์เพื่อค้นหา",
        page: {
            detail: "หน้า {0} จาก {1} ({2} รายการ)",
            first: "หน้าแรก",
            previous: "ก่อนหน้า",
            next: "ถัดไป",
            last: "หน้าสุดท้าย"
        }
    });

}(window.jQuery);
