var http = require("http");
var storage = require("storage");

var RES_NETPATH = "http://omr2m40qu.bkt.clouddn.com/";
var CURRENT_APPID = 3040402;


cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        timeDisplayPrefab: cc.Prefab,       //prefab里面的东西
        timeDisplay: cc.Node,       //刚才加到canvas上面的东西
        //enum: ["playing", "pause", "playedDone"]
        playStatus: "pause",        //状态标示
        loadingNode:{
            default: null,
            type: cc.ProgressBar
        },
        gameOver:cc.Sprite,
        touchCD:false,
    },

    // use this for initialization
    onLoad: function () {
        this.setAppID();
        this.setAccessToken();
        this.initTimeTick();        
        this._loadJson(CURRENT_APPID);
    },

    missionBegin:function(){
        cc.audioEngine.stopAll();
        cc.audioEngine.play(RES_NETPATH+"public-audio/click.mp3", false);
        // cc.audioEngine.play('res/raw-assets/resources/audio/bg2.mp3', true);
        this.initMission();
        this.playStatus = "playing";
    },

    missionOver:function(isWin){
        this.touchCD = false;
        this.gameOver.getComponent('GameOver').showGameOver(isWin);
    },

    initMission:function(){

    },

    _loadJson:function(appid){
        var url = cc.url.raw('resources/content/'+appid+'/content.json');
        // var url = RES_NETPATH+appid+'/content.json';
        var _this = this;
        cc.loader.load(url, function (err, jsondata) {
            var datas = jsondata['data'];
            for(var i in datas){
                var data = datas[i];
                _this.wenzi.push(data['wenzi']);
                _this.pinyin.push(data['pinyin']);
                var ra_str = RES_NETPATH+appid+'/'+data['audio_res'];
                _this.res_audio.push(ra_str);
            }
            var res_totle = [RES_NETPATH+"public-audio/click.mp3"];
            res_totle = res_totle.concat(_this.res_audio);
            _this.loadingNode.getComponent('LoadRes').loadResources(res_totle);
        });
    },

    initTimeTick: function(){
        var context = this;
        var timeDisplayNode = cc.instantiate(context.timeDisplayPrefab);

        // Prefab添加引用: timeTick跟 game 组件相互添加引用
        timeDisplayNode.getComponent('TimeTick').game = context;
        context.timeDisplay.addChild(timeDisplayNode);
    },
    setAppID: function(){
        if(http.parseCurrentAppID().length > 0){
            CURRENT_APPID = http.parseCurrentAppID();
        };
        storage.setCurrentAppID(CURRENT_APPID);
    },
    setAccessToken: function(){
        storage.setCurrentAccessToken(http.parseCurrentAccessToken());
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
