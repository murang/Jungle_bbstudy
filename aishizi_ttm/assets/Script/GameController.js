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
        cc.audioEngine.play('res/raw-assets/resources/audio/bg2.mp3', true);
        this.initMission();
        this.playStatus = "playing";
    },

    missionOver:function(isWin){
        this.gameOver.showGameOver(isWin);
    },

    jumpLeft:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        this.bg_1.node.runAction(cc.moveBy(1, 0, -500));
        this.bg_2.node.runAction(cc.moveBy(1, 0, -500));
        this.board_1.node.runAction(cc.moveBy(1, 0, -500));
        this.board_2.node.runAction(cc.moveBy(1, 0, -500));        
        this.board_stand.node.runAction(cc.moveBy(1, 0, -500));
        this.cat.node.scaleX = -1;
        this.cat.getComponent(cc.Animation).play('jump');
        var seq = cc.sequence(
            cc.jumpBy(1, -400, 0, 300, 1),
            cc.callFunc(function () {
                if(this.current_answer == this.label_1.string){
                    this.selectRight();
                }else{
                    this.selectWrong();
                }
                this._checkBgRollOver();
            }, this)
        );
        this.cat.node.runAction(seq);
    },
    jumpRight:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        this.bg_1.node.runAction(cc.moveBy(1, 0, -500));
        this.bg_2.node.runAction(cc.moveBy(1, 0, -500));
        this.board_1.node.runAction(cc.moveBy(1, 0, -500));
        this.board_2.node.runAction(cc.moveBy(1, 0, -500));    
        this.board_stand.node.runAction(cc.moveBy(1, 0, -500));
        this.cat.node.scaleX = 1;
        this.cat.getComponent(cc.Animation).play('jump');
        var seq = cc.sequence(
            cc.jumpBy(1, 400, 0, 300, 1),
            cc.callFunc(function () {
                if(this.current_answer == this.label_2.string){
                    this.selectRight();
                }else{
                    this.selectWrong();
                }
                this._checkBgRollOver();
            }, this)
        );
        this.cat.node.runAction(seq);
        
    },

    selectRight:function(){
        var sound_wins = ['res/raw-assets/resources/audio/win_0.mp3',
        'res/raw-assets/resources/audio/win_1.mp3',
        'res/raw-assets/resources/audio/win_2.mp3',
        'res/raw-assets/resources/audio/win_3.mp3',
        'res/raw-assets/resources/audio/win_4.mp3',
        'res/raw-assets/resources/audio/win_5.mp3',
        'res/raw-assets/resources/audio/win_6.mp3',
        'res/raw-assets/resources/audio/win_7.mp3'];
        var arindex = Math.floor(Math.random()*sound_wins.length);
        cc.audioEngine.play(sound_wins[arindex], false);
        this.board_1.node.opacity = 0;
        this.board_2.node.opacity = 0;
        this.board_stand.node.x = this.cat.node.x;
        this.board_stand.node.y = -300;
        this.board_stand.node.runAction(cc.moveTo(1, 0, -300));
        var seq = cc.sequence(
            cc.moveTo(1, 0, -50),
            cc.callFunc(function () {
                this.current_index++;
                if(this.current_index > this.wenzi.length){
                    this.missionOver(true);
                }else{
                    this._makeQuestion();
                }
            }, this),
        );
        this.cat.node.runAction(seq);
        
    },

    selectWrong:function(){
        var seq = cc.sequence(
            cc.callFunc(function () {
                this.cat.getComponent(cc.Animation).play('rock');
            }, this),
            cc.delayTime(1.2),
            cc.callFunc(function () {
                this.missionOver(false);
            }, this)
        );
        this.cat.node.runAction(seq);
    },

    initMission:function(){
        this.bg_1.node.y = 0;
        this.bg_2.node.y = 2500;
        this.cat.node.x = 0;
        this.board_stand.node.y = -300;
        this.current_index = 1;
        this._makeQuestion();
    },

    _makeQuestion:function(){
        var temp_array = new Array();
        var question_array = new Array();
        var right_answer;
        for (var index in this.wenzi) {
            temp_array.push(this.wenzi[index]);
        }
        right_answer = temp_array[this.current_index-1];
        temp_array.splice(this.current_index-1, 1);
        question_array.push(right_answer);
        var r_index = Math.floor(Math.random()*temp_array.length);
        question_array.push(temp_array[r_index]);
        question_array  = question_array.sort(function(a,b){return Math.random()-0.5;});
        this._initQuestion(question_array[0], question_array[1], right_answer);
    },

    _initQuestion:function(a_1, a_2, a_right){
        this.current_answer = a_right;
        this.label_1.string = a_1;
        this.label_2.string = a_2;
        this.board_1.node.y = 200;
        this.board_2.node.y = 200;
        this.board_1.node.opacity = 0;
        this.board_2.node.opacity = 0;
        this.board_1.node.runAction(cc.fadeIn(0.5));
        this.board_2.node.runAction(cc.fadeIn(0.5));
        cc.audioEngine.play(this.res_audio[this.current_index-1], false);
        this.touchCD = true;
    },

    _checkBgRollOver:function(){
        if(this.bg_1.node.y <= -2500){
            this.bg_1.node.y = this.bg_1.node.y+5000;
        } 
        if(this.bg_2.node.y <= -2500){
            this.bg_2.node.y = this.bg_2.node.y+5000;
        } 
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
