var http = require("http");
var storage = require("storage");

var CURRENT_APPID = 3040102;

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
        timeDisplayPrefab: cc.Prefab,
        timeDisplay: cc.Node,

        //enum: ["playing", "pause", "playedDone"]
        playStatus: "pause",

        loadingNode:{
            default: null,
            type: cc.ProgressBar
        },
        wheel:cc.Sprite,
        btn_1:cc.Button,
        btn_2:cc.Button,
        btn_3:cc.Button,
        set_1:cc.Sprite,
        set_2:cc.Sprite,
        set_3:cc.Sprite,
        set_4:cc.Sprite,
        set_5:cc.Sprite,
        npc_1:cc.Sprite,
        npc_2:cc.Sprite,
        npc_3:cc.Sprite,
        npc_4:cc.Sprite,
        npc_5:cc.Sprite,
        sf_npc_1:cc.SpriteFrame,
        sf_npc_2:cc.SpriteFrame,
        sf_npc_3:cc.SpriteFrame,
        sf_npc_4:cc.SpriteFrame,
        sf_npc_5:cc.SpriteFrame,
        sf_npc_6:cc.SpriteFrame,
        sf_npc_7:cc.SpriteFrame,
        sf_npc_8:cc.SpriteFrame,
        sf_npc_9:cc.SpriteFrame,
        sf_npc_10:cc.SpriteFrame,
        bus:cc.Sprite,
        sf_bus_0:cc.SpriteFrame,
        sf_bus_1:cc.SpriteFrame,
        sf_bus_2:cc.SpriteFrame,
        sf_bus_3:cc.SpriteFrame,
        sf_bus_4:cc.SpriteFrame,
        sf_bus_5:cc.SpriteFrame,
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
        this._loadJson(CURRENT_APPID);
        this.wheel.node.rotation = 36;
        cc.loader.loadResDir('audio', function(err, audios){});
        this._clearQuestion();
        this.initTimeTick();
    },

    initTimeTick: function(){
        var context = this;
        var timeDisplayNode = cc.instantiate(context.timeDisplayPrefab);

        // Prefab添加引用: timeTick跟 game 组件相互添加引用
        timeDisplayNode.getComponent('TimeTick').game = context;
        context.timeDisplay.addChild(timeDisplayNode);
    },

    missionBegin:function(){
        cc.audioEngine.play('res/raw-assets/resources/audio/bgMusic.mp3', true);
        this._initMission();
        this.playStatus = "playing";
    },

    btnClicked_1:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/click.mp3', false);
        if(this.btn_1.node.getChildByName('Label').getComponent(cc.Label).string == this.current_answer){
            this.selectRight();
        }else{
            this.selectWrong();
        }
    },
    btnClicked_2:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/click.mp3', false);
        if(this.btn_2.node.getChildByName('Label').getComponent(cc.Label).string == this.current_answer){
            this.selectRight();
        }else{
            this.selectWrong();
        }
    },
    btnClicked_3:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/click.mp3', false);
        if(this.btn_3.node.getChildByName('Label').getComponent(cc.Label).string == this.current_answer){
            this.selectRight();
        }else{
            this.selectWrong();
        }
    },

    selectRight:function(){
        cc.audioEngine.play('res/raw-assets/resources/audio/roate.mp3', false);
        var res_aud = this.current_round==1 ? this.res_aud_1 : this.res_aud_2;
        cc.audioEngine.play(res_aud[this.current_index-1], false);
        var sets = [null, this.set_1, this.set_2, this.set_3, this.set_4, this.set_5];
        var npcs = [null, this.npc_1, this.npc_2, this.npc_3, this.npc_4, this.npc_5];
        var actions = cc.sequence(
            cc.callFunc(function () {
                sets[this.current_index].node.getChildByName('board').setLocalZOrder(2);
                npcs[this.current_index].node.setPosition(cc.p(0,0));
                sets[this.current_index].node.addChild(npcs[this.current_index].node,1);
            }, this),
            cc.rotateBy(1.5, 72),
            cc.callFunc(function () {
                sets[this.current_index].getComponent('Sets').setHighLight(false);
                this.current_index++;
                if(this.current_index == 6){
                    this.rollToNextRound();
                }else{
                    this._makeQuestion();
                }
            }, this)
        );
        this.wheel.node.runAction(actions);
    },

    selectWrong:function(){
        cc.audioEngine.play('res/raw-assets/resources/audio/lose.mp3', false);
        var actions = cc.sequence(
            cc.rotateBy(0.5, -72),
            cc.rotateBy(0.5, 72),
            cc.callFunc(function () {
                this.touchCD = true;
            }, this)
        );
        this.wheel.node.runAction(actions);
    },

   rollToNextRound:function(){
       cc.audioEngine.play('res/raw-assets/resources/audio/finish.mp3', false);
       this._clearQuestion();
       var actions = cc.sequence(
            cc.rotateBy(3, 720),
            cc.callFunc(function () {
                this.busCome();
            }, this)
        );
        this.wheel.node.runAction(actions);
    },

    busCome:function(){
        this.bus.node.x = -1350;
        this.bus.spriteFrame = this.sf_bus_0;
        var actions = cc.sequence(
            cc.callFunc(function () {
                cc.audioEngine.play('res/raw-assets/resources/audio/buscome.mp3', false);
            }, this),
            cc.moveBy(3, cc.p(1350, 0)),
            cc.callFunc(function () {
                this.npc_1.node.active = false;
                cc.audioEngine.play('res/raw-assets/resources/audio/kidGo.mp3', false);
                this.bus.spriteFrame = this.sf_bus_1;
            }, this),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.npc_2.node.active = false;
                cc.audioEngine.play('res/raw-assets/resources/audio/kidGo.mp3', false);
                this.bus.spriteFrame = this.sf_bus_2;
            }, this),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.npc_3.node.active = false;
                cc.audioEngine.play('res/raw-assets/resources/audio/kidGo.mp3', false);
                this.bus.spriteFrame = this.sf_bus_3;
            }, this),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.npc_4.node.active = false;
                cc.audioEngine.play('res/raw-assets/resources/audio/kidGo.mp3', false);
                this.bus.spriteFrame = this.sf_bus_4;
            }, this),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.npc_5.node.active = false;
                cc.audioEngine.play('res/raw-assets/resources/audio/kidGo.mp3', false);
                this.bus.spriteFrame = this.sf_bus_5;
            }, this),
            cc.delayTime(0.5),
            cc.callFunc(function () {
                cc.audioEngine.play('res/raw-assets/resources/audio/buscome.mp3', false);
            }, this),
            cc.moveBy(3,cc.p(1350,0)),
            cc.callFunc(function () {
                if(this.current_round == 1){
                    this.current_round = 2;
                }else{
                    this.current_round = 1;
                }
                this._initMission();
            }, this)
        );
        this.bus.node.runAction(actions);
    },

    _initMission:function(){
        var pinyin = this.current_round==1 ? this.pinyin_1 : this.pinyin_2;
        this.wheel.node.rotation = 36;
        this.set_1.getComponent('Sets').setBoardString(pinyin[0]);
        this.set_2.getComponent('Sets').setBoardString(pinyin[1]);
        this.set_3.getComponent('Sets').setBoardString(pinyin[2]);
        this.set_4.getComponent('Sets').setBoardString(pinyin[3]);
        this.set_5.getComponent('Sets').setBoardString(pinyin[4]);
        this.npc_1.node.active = true;
        this.npc_2.node.active = true;
        this.npc_3.node.active = true;
        this.npc_4.node.active = true;
        this.npc_5.node.active = true;
        this.npc_1.spriteFrame = this.current_round==1 ? this.sf_npc_1 : this.sf_npc_6;
        this.npc_1.node.setPosition(cc.p(-689,-280))
        cc.find('Canvas').addChild(this.npc_1.node, 998);
        this.npc_2.spriteFrame = this.current_round==1 ? this.sf_npc_2 : this.sf_npc_7;
        this.npc_2.node.setPosition(cc.p(-531,-290))
        cc.find('Canvas').addChild(this.npc_2.node, 998);
        this.npc_3.spriteFrame = this.current_round==1 ? this.sf_npc_3 : this.sf_npc_8;
        this.npc_3.node.setPosition(cc.p(-780,-376))
        cc.find('Canvas').addChild(this.npc_3.node, 999);
        this.npc_4.spriteFrame = this.current_round==1 ? this.sf_npc_4 : this.sf_npc_9;
        this.npc_4.node.setPosition(cc.p(-632,-373))
        cc.find('Canvas').addChild(this.npc_4.node, 999);
        this.npc_5.spriteFrame = this.current_round==1 ? this.sf_npc_5 : this.sf_npc_10;
        this.npc_5.node.setPosition(cc.p(-466,-386))
        cc.find('Canvas').addChild(this.npc_5.node, 999);
        this.current_index = 1;
        this._makeQuestion();
    },

    _makeQuestion:function(){ 
        var sets = [null, this.set_1, this.set_2, this.set_3, this.set_4, this.set_5];
        sets[this.current_index].getComponent('Sets').setHighLight(true);
        var wenzi = this.current_round==1 ? this.wenzi_1 : this.wenzi_2;
        var temp_array = new Array();
        var question_array = new Array();
        for (var index in wenzi) {
            temp_array.push(wenzi[index]);
        }
        this.current_answer = wenzi[this.current_index-1];
        temp_array.splice(this.current_index-1, 1);
        question_array.push(this.current_answer);
        for(var i=0; i<2; i++){
            var r_index = Math.floor(Math.random()*temp_array.length);
            question_array.push(temp_array[r_index]);
            temp_array.splice(r_index, 1);
        }
        question_array  = question_array.sort(function(a,b){return Math.random()-0.5;});
        this._initQuestion(question_array[0], question_array[1], question_array[2],this.current_answer);
        this.touchCD = true;
    },

    _initQuestion:function(a_1, a_2, a_3, a_right){
        this.btn_1.node.getChildByName('Label').getComponent(cc.Label).string = a_1;
        this.btn_2.node.getChildByName('Label').getComponent(cc.Label).string = a_2;
        this.btn_3.node.getChildByName('Label').getComponent(cc.Label).string = a_3;
        this.current_answer = a_right;
    },
    _clearQuestion:function(){
        this.btn_1.node.getChildByName('Label').getComponent(cc.Label).string = '';
        this.btn_2.node.getChildByName('Label').getComponent(cc.Label).string = '';
        this.btn_3.node.getChildByName('Label').getComponent(cc.Label).string = '';
        this.current_answer = '';
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
            _this.loadingNode.getComponent('LoadRes').loadResources(res_totle);
        });
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
