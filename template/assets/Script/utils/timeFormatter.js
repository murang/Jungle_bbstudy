var timeFormatter = {

   generateRenderTime: function (cumulative_time) {
       var minutes = 0;
       var seconds = 0;

       minutes = Math.floor(cumulative_time / 60);
       seconds = cumulative_time % 60;

       return this._timeWithFormat(minutes, seconds);
    },

    _timeWithFormat: function (minutes, seconds) {
        return this._fillTimeCell(minutes) + ' ：' + this._fillTimeCell(seconds);
    },

    _fillTimeCell: function (time_num) {
        var str = time_num;

        if (time_num < 10) {
            str = "0" + time_num;
        }

        return str;
    },
};

module.exports = timeFormatter;