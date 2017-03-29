var http = require("http");
var storage = require("storage");

var CURRENT_APPID = 3040202;

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
        label_hint:cc.Label,
        star_r:cc.SpriteFrame,
        star_w:cc.SpriteFrame,
        star_n:cc.SpriteFrame,
        star_1:cc.Sprite,
        star_2:cc.Sprite,
        star_3:cc.Sprite,
        star_4:cc.Sprite,
        star_5:cc.Sprite,
        star_6:cc.Sprite,
        star_7:cc.Sprite,
        star_8:cc.Sprite,
        star_9:cc.Sprite,
        star_10:cc.Sprite,
        btn_1:cc.Button,
        btn_2:cc.Button,
        btn_3:cc.Button,
        btn_4:cc.Button,
        label_1:cc.Label,
        label_2:cc.Label,
        label_3:cc.Label,
        label_4:cc.Label,
        hint_bird_1:cc.Sprite,
        hint_bird_2:cc.Sprite,
        hint_bird_3:cc.Sprite,
        bird_1:cc.Sprite,
        bird_2:cc.Sprite,
        bird_3:cc.Sprite,
        bird_4:cc.Sprite,
        fire_spriteframe:cc.SpriteFrame,
        bird_sf_1:cc.SpriteFrame,
        bird_sf_2:cc.SpriteFrame,
        bird_sf_3:cc.SpriteFrame,
        bird_sf_4:cc.SpriteFrame,
        bird_sf_5:cc.SpriteFrame,
        bird_sf_6:cc.SpriteFrame,
        bird_sf_7:cc.SpriteFrame,
        bird_sf_8:cc.SpriteFrame,
        bird_sf_9:cc.SpriteFrame,
        bird_sf_10:cc.SpriteFrame,
        bird_sf_11:cc.SpriteFrame,
        bird_sf_12:cc.SpriteFrame,
        bird_sf_13:cc.SpriteFrame,
        bird_sf_14:cc.SpriteFrame,
        bird_sf_15:cc.SpriteFrame,
        bird_sf_16:cc.SpriteFrame,
        bird_sf_17:cc.SpriteFrame,
        bird_sf_18:cc.SpriteFrame,
        bird_sf_19:cc.SpriteFrame,
        bird_sf_20:cc.SpriteFrame,
        bird_sf_21:cc.SpriteFrame,
        wenzi:[],
        pinyin:[],
        res_audio:[],
        current_index:1,
        current_answer:'',
        touchCD:false,
        t_bird_kind_1:0,
        t_bird_kind_2:0,
        t_bird_kind_3:0,
        t_bird_kind_4:0,
        current_score:0,
        isMissionOver:false
    },

    // use this for initialization
    onLoad: function () {
        this.setAppID();
        this.setAccessToken();
        this.initTimeTick();        
        this._loadJson(CURRENT_APPID);
        this.gameOver = cc.find('GameOver').getComponent('GameOver');
        cc.audioEngine.play('res/raw-assets/resources/audio/bgMusic.mp3', true);
    },

    missionBegin:function(){
        this.initMission();
        this.playStatus = "playing";
    },

    initMission:function(){
        this.resetStar();
        this.hint_bird_1.getComponent(cc.Animation).play('anim_bird_'+Math.floor(Math.random()*20+1));
        this.hint_bird_2.getComponent(cc.Animation).play('anim_bird_'+Math.floor(Math.random()*20+1));
        this.hint_bird_3.getComponent(cc.Animation).play('anim_bird_'+Math.floor(Math.random()*20+1));
        this.current_index = 1;
        this.current_score = 0;
        this.isMissionOver = false;
        this._makeQuestion();
    },

    buttonClicked_1:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_select.mp3', false);
        this.bird_1.getComponent(cc.Animation).play('anim_bird_'+this.t_bird_kind_1);
        if(this.label_1.string == this.current_answer){
            this.selectRight(this.bird_1);
        }else{
            this.selectWrong(this.bird_1);
        }
    },
    buttonClicked_2:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_select.mp3', false);
        this.bird_2.getComponent(cc.Animation).play('anim_bird_'+this.t_bird_kind_2);
        if(this.label_2.string == this.current_answer){
            this.selectRight(this.bird_2);
        }else{
            this.selectWrong(this.bird_2);
        }
    },
    buttonClicked_3:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_select.mp3', false);
        this.bird_3.getComponent(cc.Animation).play('anim_bird_'+this.t_bird_kind_3);
        if(this.label_3.string == this.current_answer){
            this.selectRight(this.bird_3);
        }else{
            this.selectWrong(this.bird_3);
        }
    },
    buttonClicked_4:function(){
        if(!this.touchCD)return;
        this.touchCD = false;
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_select.mp3', false);
        this.bird_4.getComponent(cc.Animation).play('anim_bird_'+this.t_bird_kind_4);
        if(this.label_4.string == this.current_answer){
            this.selectRight(this.bird_4);
        }else{
            this.selectWrong(this.bird_4);
        }
    },

    selectRight:function(whichBird){
        this.current_score++;
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_fly.mp3', false);
        this.addStar(true);
        whichBird.getComponent('Bird').shangtian();
    },
    
    selectWrong:function(whichBird){
        cc.audioEngine.play('res/raw-assets/resources/audio/bird_fall.mp3', false);
        this.addStar(false);
        whichBird.getComponent('Bird').rudi();
    },

    addStar:function(isRight){
        var stars = [null, this.star_1, this.star_2, this.star_3, this.star_4, this.star_5,
        this.star_6, this.star_7, this.star_8, this.star_9, this.star_10];
        stars[this.current_index].spriteFrame = isRight ? this.star_r : this.star_w;
        stars[this.current_index].node.scale = 1.5;
        stars[this.current_index].node.runAction(cc.scaleTo(0.5, 1));
        this.current_index++;
        if(this.current_index >= 11){
            this.isMissionOver = true;
            this.scheduleOnce(function(){
                this.missionOver(this.current_score >= 6);
            }, 1);
        }
    },
    resetStar:function(){
        var stars = [this.star_1, this.star_2, this.star_3, this.star_4, this.star_5,
        this.star_6, this.star_7, this.star_8, this.star_9, this.star_10];
        for(var i in stars){
            stars[i].spriteFrame = this.star_n;
        }
    },

    missionOver:function(isWin){
        if(isWin){
            cc.audioEngine.play('res/raw-assets/resources/audio/great.mp3', false);
        }
        this.gameOver.showGameOver(isWin);
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
        for(var i=0; i<3; i++){
            var r_index = Math.floor(Math.random()*temp_array.length);
            question_array.push(temp_array[r_index]);
            temp_array.splice(r_index, 1);
        }
        question_array  = question_array.sort(function(a,b){return Math.random()-0.5;});
        this._initQuestion(question_array[0], question_array[1], question_array[2], question_array[3], right_answer);
    },

    _initQuestion:function(a_1, a_2, a_3, a_4, a_right){
        this.bird_1.getComponent(cc.Animation).stop();
        this.bird_2.getComponent(cc.Animation).stop();
        this.bird_3.getComponent(cc.Animation).stop();
        this.bird_4.getComponent(cc.Animation).stop();
        this.t_bird_kind_1 = Math.floor(Math.random()*20+1);
        this.t_bird_kind_2 = Math.floor(Math.random()*20+1);
        this.t_bird_kind_3 = Math.floor(Math.random()*20+1);
        this.t_bird_kind_4 = Math.floor(Math.random()*20+1);
        var sfs = [null, this.bird_sf_1, this.bird_sf_2, this.bird_sf_3, this.bird_sf_4, this.bird_sf_5,
         this.bird_sf_6, this.bird_sf_7, this.bird_sf_8, this.bird_sf_9, this.bird_sf_10, 
         this.bird_sf_11, this.bird_sf_12, this.bird_sf_13, this.bird_sf_14, this.bird_sf_15, 
         this.bird_sf_16, this.bird_sf_17, this.bird_sf_18, this.bird_sf_19, this.bird_sf_20];
        this.bird_1.spriteFrame = sfs[this.t_bird_kind_1];
        this.bird_2.spriteFrame = sfs[this.t_bird_kind_2];
        this.bird_3.spriteFrame = sfs[this.t_bird_kind_3];
        this.bird_4.spriteFrame = sfs[this.t_bird_kind_4];
        this.bird_1.node.y = -95;
        this.bird_2.node.y = -95;
        this.bird_3.node.y = -95;
        this.bird_4.node.y = -95;
        this.bird_1.node.rotation = 0;
        this.bird_2.node.rotation = 0;
        this.bird_3.node.rotation = 0;
        this.bird_4.node.rotation = 0;
        this.bird_1.node.removeAllChildren();
        this.bird_2.node.removeAllChildren();
        this.bird_3.node.removeAllChildren();
        this.bird_4.node.removeAllChildren();
        cc.audioEngine.play(this.res_audio[this.current_index-1], false);
        this.label_hint.string = this.pinyin[this.current_index-1];
        this.label_1.string = a_1;
        this.label_2.string = a_2;
        this.label_3.string = a_3;
        this.label_4.string = a_4;
        this.current_answer = a_right;
        this.touchCD = true;
    },
    _clearQuestion:function(){
        this.label_hint.string = '';
        this.label_1.string = '';
        this.label_2.string = '';
        this.label_3.string = '';
        this.label_4.string = '';
        this.current_answer = '';
    },

    _loadJson:function(appid){
        var url = cc.url.raw('resources/content/'+appid+'/content.json');
        var _this = this;
        cc.loader.load(url, function (err, jsondata) {
            _this.wenzi = jsondata['wenzi'];
            _this.pinyin = jsondata['pinyin'];
            _this.res_audio = jsondata['audio_res'];
            _this.loadingNode.getComponent('LoadRes').loadResources(_this.res_audio);
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
