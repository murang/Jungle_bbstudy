var http = require("http");
var storage = require("storage");

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
        timeDisplayPrefab: cc.Prefab,		//prefab里面的东西
        timeDisplay: cc.Node,		//刚才加到canvas上面的东西
        //enum: ["playing", "pause", "playedDone"]
        playStatus: "pause",		//状态标示
        loadingNode:{
            default: null,
            type: cc.ProgressBar
        },
        bg_1:cc.Sprite,
        bg_2:cc.Sprite,
        board_1:cc.Button,
        board_2:cc.Button,
        label_1:cc.Label,
        label_2:cc.Label,
        board_stand:cc.Sprite,
        cat:cc.Sprite,
        timeBar:{
            default: null,
            type: cc.ProgressBar
        },
        current_index:1,
        wenzi:[],
        pinyin:[],
        res_audio:[],
        current_answer:'',
        touchCD:false
    },

    // use this for initialization
    onLoad: function () {
        this.setAppID();
        this.setAccessToken();
        this.initTimeTick();        
        this._loadJson(CURRENT_APPID);
        this.gameOver = cc.find('GameOver').getComponent('GameOver');
    },

    missionBegin:function(){
        cc.audioEngine.stopAll();
        cc.audioEngine.play("http://omr2m40qu.bkt.clouddn.com/public-audio/click.mp3", false);
        cc.audioEngine.play('res/raw-assets/resources/audio/bgMusic.mp3', true);
        this.initMission();
        this.playStatus = "playing";
    },

    jumpLeft:function(){
        this.bg_1.node.runAction(cc.moveBy(1, 0, -500));
        this.bg_2.node.runAction(cc.moveBy(1, 0, -500));
        this.board_1.node.runAction(cc.moveBy(1, 0, -500));
        this.board_2.node.runAction(cc.moveBy(1, 0, -500));        
        this.board_stand.node.runAction(cc.moveBy(1, 0, -500));
        this.cat.node.runAction(cc.jumpBy(1, -400, 0, 300, 1));
    },
    jumpRight:function(){
        this.bg_1.node.runAction(cc.moveBy(1, 0, -500));
        this.bg_2.node.runAction(cc.moveBy(1, 0, -500));
        this.board_1.node.runAction(cc.moveBy(1, 0, -500));
        this.board_2.node.runAction(cc.moveBy(1, 0, -500));    
        this.board_stand.node.runAction(cc.moveBy(1, 0, -500));
        this.cat.node.runAction(cc.jumpBy(1, 400, 0, 300, 1));
    },

    initMission:function(){
        this.bg_1.node.y = 0;
        this.bg_2.node.y = 2500;
        this.cat.node.x = 0;
        this.board_stand.node.y = -300;

    },

    _checkBgRollOver:function(){
        if(bg_1.node.y <= -2500){
            bg_1.node.y = bg_1.node.y+5000;
        } 
        if(bg_2.node.y <= -2500){
            bg_2.node.y = bg_1.node.y+5000;
        } 
    },

    _initMission:function(){
        this.bg_1.node.y = 0;
        this.bg_2.node.y = 2500;
    },

    _loadJson:function(appid){
        var url = cc.url.raw('resources/content/'+appid+'/content.json');
        var _this = this;
        cc.loader.load(url, function (err, jsondata) {
            _this.wenzi = jsondata['wenzi'];
            _this.pinyin = jsondata['pinyin'];
            _this.res_audio = jsondata['audio_res'];
            var res_totle = ["http://omr2m40qu.bkt.clouddn.com/public-audio/click.mp3"];
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
