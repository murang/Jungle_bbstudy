var http = require("http");
var storage = require("storage");

var CURRENT_APPID = 3040302;

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

        partical:cc.ParticleSystem,
        sprite_wwj:cc.Sprite,
        sprite_zhuan:cc.Sprite,
        label_hint:cc.Label,
        sprite_che_1:cc.Sprite,
        sprite_che_2:cc.Sprite,
        label_che_1:cc.Label,
        label_che_2:cc.Label,
        boom:cc.Sprite,
        house:cc.Sprite,
        house_11:cc.SpriteFrame,
        house_12:cc.SpriteFrame,
        house_13:cc.SpriteFrame,
        house_14:cc.SpriteFrame,
        house_15:cc.SpriteFrame,
        house_21:cc.SpriteFrame,
        house_22:cc.SpriteFrame,
        house_23:cc.SpriteFrame,
        house_24:cc.SpriteFrame,
        house_25:cc.SpriteFrame,
        zhuan:cc.Sprite,
        zhuan_1:cc.SpriteFrame,
        zhuan_2:cc.SpriteFrame,
        zhuan_3:cc.SpriteFrame,
        zhuan_4:cc.SpriteFrame,
        current_round:1,
        current_index:1,
        wenzi_1:[],
        wenzi_2:[],
        pinyin_1:[],
        pinyin_2:[],
        res_aud_1:[],
        res_aud_2:[],
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
        this._initMission();
        this.playStatus = "playing";
    },

    cheClicked_1:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/click.mp3', false);
        if(this.label_che_1.string == this.current_answer){
            this.selectRight();
        }else{
            this.selectWrong();
        }
    },
    cheClicked_2:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/click.mp3', false);
        if(this.label_che_2.string == this.current_answer){
            this.selectRight();
        }else{
            this.selectWrong();
        }
    },

    selectRight:function(){
        if(this.current_index < 5){
            this.setBuilding(this.current_index);
            this.current_index++;
            this._makeQuestion();
        }else if(this.current_index == 5){
            this.setBuilding(this.current_index);
            this.partical.resetSystem();
            if(this.current_round == 1){
                this.scheduleOnce(function(){
                    this.current_round = 2;
                    this.current_index = 1;
                    this.house.node.y = 650;
                    this._makeQuestion();
                }, 1);
            }else{
                this.scheduleOnce(function(){
                    this.missionOver(true);
                }, 1);
            }
        }
    },
    selectWrong:function(){
        cc.audioEngine.play('res/raw-assets/resources/audio/chi.mp3', false);
        this.boom.node.active = true;
        this.boom.getComponent(cc.Animation).play();
        this.scheduleOnce(function(){
            cc.audioEngine.play('res/raw-assets/resources/audio/hong.mp3', false);
            this.boom.node.active = false;
            if(this.current_index==1){
                this.missionOver(false);
            }else{
                this.current_index--;
                this.setBuilding(this.current_index-1);
                this._makeQuestion();
            }
        }, 3);
    },

    missionOver:function(isWin){
        this.gameOver.showGameOver(isWin);
    },

    setBuilding:function(index){
        cc.audioEngine.play('res/raw-assets/resources/audio/down'+index+'.mp3', false);
        var house_sf = [
            null,
            [null, this.house_11, this.house_12, this.house_13, this.house_14, this.house_15],
            [null, this.house_21, this.house_22, this.house_23, this.house_24, this.house_25]
        ];
        this.house.spriteFrame = house_sf[this.current_round][index];
        if(index == 1){
            this.house.node.y = 650;
            var seq = cc.sequence(
                cc.moveBy(0.45, 0, -800), 
                cc.moveBy(0.1, 0, 50), 
                cc.moveBy(0.05, 0, -50), 
            );
            this.house.node.runAction(seq);
        }
        var zhuan_sf = [null, this.zhuan_1, this.zhuan_2, this.zhuan_3, this.zhuan_4, null];
        this.zhuan.spriteFrame = zhuan_sf[index];
    },

    _initMission:function(){
        this.current_round = 1;
        this.current_index = 1;
        this.house.node.y = 650;
        this.zhuan.spriteFrame = null;
        this.sprite_wwj.node.x = 400;
        this.sprite_wwj.node.scaleX = 1;
        this.sprite_wwj.getComponent(cc.Animation).play();
        this.sprite_wwj.node.stopAllActions();
        var wwj_move = cc.repeatForever(
             cc.sequence(
                 cc.moveBy(5, -800, 0), 
                 cc.callFunc(function () {
                    this.sprite_wwj.node.scaleX = -1;
                }, this),
                 cc.moveBy(5, 800, 0),
                 cc.callFunc(function () {
                    this.sprite_wwj.node.scaleX = 1;
                }, this),
             )
        );
        this.sprite_wwj.node.runAction(wwj_move);
        this._makeQuestion();
    },

    _makeQuestion:function(){ 
        var wenzi = this.current_round==1 ? this.wenzi_1 : this.wenzi_2;
        var temp_array = new Array();
        var question_array = new Array();
        for (var index in wenzi) {
            temp_array.push(wenzi[index]);
        }
        var right_answer = wenzi[this.current_index-1];
        temp_array.splice(this.current_index-1, 1);
        question_array.push(right_answer);
        var r_index = Math.floor(Math.random()*temp_array.length);
        question_array.push(temp_array[r_index]);
        question_array  = question_array.sort(function(a,b){return Math.random()-0.5;});
        this._initQuestion(question_array[0], question_array[1], right_answer);
    },

    _initQuestion:function(a_1, a_2, a_right){
        cc.audioEngine.play('res/raw-assets/resources/audio/move.mp3', false);
        var pinyin = this.current_round==1 ? this.pinyin_1 : this.pinyin_2;
        var res_auds = this.current_round==1 ? this.res_aud_1 : this.res_aud_2;
        this.label_hint.string = pinyin[this.current_index-1];
        this.label_che_1.string = a_1;
        this.label_che_2.string = a_2;
        this.current_answer = a_right;
        this.sprite_che_1.node.x = 1300;
        this.sprite_che_2.node.x = 1800;
        this.sprite_che_1.getComponent(cc.Animation).play();
        this.sprite_che_2.getComponent(cc.Animation).play();
        var actionWithCB = cc.sequence(
            cc.moveBy(1, -1200, 0), 
            cc.callFunc(function () {
                cc.audioEngine.play(res_auds[this.current_index-1], false);
                this.sprite_che_1.getComponent(cc.Animation).stop();
                this.sprite_che_2.getComponent(cc.Animation).stop();
                this.touchCD = true;
            }, this)
        );
        this.sprite_che_1.node.runAction(actionWithCB);
        this.sprite_che_2.node.runAction(cc.moveBy(1, -1200, 0));
    },

    _loadJson:function(appid){
        var url = cc.url.raw('resources/content/'+appid+'/content.json');
        var _this = this;
        cc.loader.load(url, function (err, jsondata) {
            _this.wenzi_1 = jsondata['wenzi_1'];
            _this.wenzi_2 = jsondata['wenzi_2'];
            _this.pinyin_1 = jsondata['pinyin_1'];
            _this.pinyin_2 = jsondata['pinyin_2'];
            _this.res_aud_1 = jsondata['audio_res_1'];
            _this.res_aud_2 = jsondata['audio_res_2'];
            var res_totle = _this.res_aud_1.concat(_this.res_aud_2);
            res_totle.push("http://omr2m40qu.bkt.clouddn.com/public-audio/click.mp3");
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
