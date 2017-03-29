//var http = require("http")

var storage = {
    getCurrentAppID: function(){
        return cc.sys.localStorage.getItem("appid");
    },

    setCurrentAppID: function(appid){
        cc.sys.localStorage.setItem("appid", appid);
    },

    getCurrentAccessToken: function(){
        return cc.sys.localStorage.getItem("access_token");
    },

    setCurrentAccessToken: function(access_token){
        cc.sys.localStorage.setItem("access_token", access_token);
    }
}

module.exports = storage;