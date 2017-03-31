var http = {

    parseCurrentAppID: function(){
        return this.parseParamValueByKey(window.location.href, "appid")
    },

    parseCurrentAccessToken: function(){
        return this.parseParamValueByKey(window.location.href, "access_token");
    },

    parseParamValueByKey: function (url, key) {
        var value = "";
        var url_params = this._parseURLParams(url);
        if (url_params != undefined && url_params.hasOwnProperty(key)) {
            value = this._parseURLParams(url)[key];
        }

        return value;
    },

    _parseURLParams: function (url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
}

module.exports = http;