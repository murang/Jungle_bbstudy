//var pictureBookPlay = require("PlayPictureBook")
var timeFormatter = require("timeFormatter")
var storage = require("storage")
var api = require("api")

var CUMULATIVE_SECONDS = 0;
var API_CALL_INTERVAL = 5;
var APPID = storage.getCurrentAppID();//cc.sys.localStorage.getItem("appid")
var ACCESS_TOKEN = storage.getCurrentAccessToken();//cc.sys.localStorage.getItem("access_token");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        var context = this;

        context.schedule(context.timeTickTick, 1);
    },

    timeTickTick: function(){
        var doTimeTick = this.game.playStatus == "playing";
        CUMULATIVE_SECONDS += doTimeTick ? 1 : 0;

        if (doTimeTick && (CUMULATIVE_SECONDS % API_CALL_INTERVAL === 0)) {//每过5秒钟告知服务器
            cc.log("access_token: " + ACCESS_TOKEN);

            if (ACCESS_TOKEN !== '') {
                api.syncLearnedTime(APPID, ACCESS_TOKEN, API_CALL_INTERVAL);
                //this.doSyncLearnedTime(ACCESS_TOKEN);
            }
        }

        this.renderTimeTick(CUMULATIVE_SECONDS);        
    },

    renderTimeTick: function (elapsedSeconds) {
        this.node.getComponent(cc.Label).string = timeFormatter.generateRenderTime(elapsedSeconds);
    },

    //doSyncLearnedTime: function (access_token) {
    //    var xhr = new XMLHttpRequest();
    //    xhr.onreadystatechange = function () {
    //        var response = xhr.responseText;
    //        cc.log(response);
    //        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
    //            var response = xhr.responseText;
    //            cc.log(response);
    //        }
    //    };

    //    var params = ["learn_time=" + API_CALL_INTERVAL, "access_token=" + access_token].join("&")
    //    var url = API_URL + "?" + params;
    //    cc.log("url: " + url);
    //    xhr.open("POST", url, true);
    //    xhr.send();
    //},


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
