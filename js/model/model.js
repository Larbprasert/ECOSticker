
function GridParam(obj) {
    var info = {
        Mode: 0,
        OrderBy: '',
        OrderType: '',
        GroupBy: '',
        PageSize: 20,
        CurrentPage: 1,
        TotalRecord: 0,
        LastPage: 0,
        MaxPageSize: 5
    };

    if (obj != undefined)
        info = $.extend({}, info, obj);

    info.ToServerObject = function () {
        var cl = _.clone(this);
        cl.CurrentPage--;
        return cl;
    }
    return info;
}
