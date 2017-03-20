var config = require("config")

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
        moveDuration:1,
        coolDownTime:3,
        canvas: cc.Node,
        buttonPlay:{
            default: null,
            type: cc.Button
        },
        loadingNode:{
            default: null,
            type: cc.ProgressBar
        },
        loadingTips: {
            default: null,
            type: cc.Label
        },
        paperShow:{
            default:null,
            type:cc.Sprite
        },
        paperHide:{
            default:null,
            type:cc.Sprite
        },
        paperShowCard:{
            default:null,
            type:cc.Sprite
        },
        paperHideCard:{
            default:null,
            type:cc.Sprite
        },
        labelShow:{
            default:null,
            type:cc.Label
        },
        labelHide:{
            default:null,
            type:cc.Label
        },
        res_pics:[],
        res_auds_cn:[],
        res_auds_en:[],
        res_aud_cntop:null,
        res_aud_entop:null,
        res_prepared:false,
        content_data:null,
        content_count:0,
        content_index:0,
        isTouchCooldown:false,
        isMoveActionTrigger:false,
        res_wan:null
    },

    // use this for initialization
    onLoad: function () {
        this.buttonPlay.node.active = false;
        this._loadJson(config.AppId);
        var _this = this;
        cc.loader.loadRes('wan1', function(err, res){
            _this.res_wan = res;
        });
        this.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            // if(!_this.isTouchCooldown || _this.isMoveActionTrigger)return false;
        }, self.node);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(!_this.isTouchCooldown || _this.isMoveActionTrigger)return;
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            var touchStartLoc = touches[0].getStartLocation();
            cc.log('begin y = ' + touchStartLoc.y + '  now y = ' + touchLoc.y);
            if(touchLoc.y - touchStartLoc.y >= 100){
                _this.isMoveActionTrigger = true;
                _this.moveBackward();
            }else if(touchStartLoc.y - touchLoc.y >= 100){
                _this.isMoveActionTrigger = true;
                _this.moveForward();
            }
        }, self.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log('touch end');
            _this.isMoveActionTrigger = false;
        }, self.node);
    },

    _loadJson:function(appid){
        var url = cc.url.raw('resources/content/'+appid+'/content.json');
        var _this = this;
        cc.loader.load(url, function (err, jsondata) {
            _this.content_data = jsondata;
            _this.content_count = jsondata["str_items_en"].length;
            var ress_pics = new Array();
            var ress_auds_cn = new Array();
            var ress_auds_en = new Array();
            for(var i=1; i<=_this.content_count; i++){
                var url_pic = _this._getPicUrl(appid, i);
                var url_aud_cn = _this._getAudUrlCN(appid, i);
                var url_aud_en = _this._getAudUrlEN(appid, i);
                _this.res_pics.push(url_pic);
                _this.res_auds_cn.push(url_aud_cn);
                _this.res_auds_en.push(url_aud_en);
                ress_pics.push(url_pic);
                ress_auds_cn.push(url_aud_cn);
                ress_auds_en.push(url_aud_en);
            }
            _this.res_aud_cntop = [config.ResNetLoc + config.ProName + '-audio',appid,'cn_top.mp3'].join("/");
            _this.res_aud_entop = [config.ResNetLoc + config.ProName + '-audio',appid,'en_top.mp3'].join("/");
            var res_totle = ress_pics.concat(ress_auds_cn.concat(ress_auds_en));
            res_totle.push(_this.res_aud_cntop);
            res_totle.push(_this.res_aud_entop);
            _this.loadingNode.getComponent('LoadRes').loadResources(res_totle);
        })
    },

    _getPicUrl:function(id, index){
        var str_index = index<10 ? '0'+index : ''+index;
        return [config.ResNetLoc + config.ProName + '-picture',id, str_index+'.png'].join("/");
    },
    _getAudUrlCN:function(id, index){
        var str_index = index<10 ? '0'+index : ''+index;
        return [config.ResNetLoc + config.ProName + '-audio',id, 'cn'+str_index+'.mp3'].join("/");
    },
    _getAudUrlEN:function(id, index){
        var str_index = index<10 ? '0'+index : ''+index;
        return [config.ResNetLoc + config.ProName + '-audio',id, 'en'+str_index+'.mp3'].join("/");
    },

    _playAudioByIndex:function(index){
        var first_id = cc.audioEngine.play(this.res_auds_cn[index],false);
        var time = cc.audioEngine.getDuration(first_id);
        this.scheduleOnce(function(){
            cc.audioEngine.play(this.res_auds_en[index],false);
        }, time);
    },

    missionBegin:function(){
        this.buttonPlay.node.active = false;
        this.isTouchCooldown = false;
        this.scheduleOnce(function(){
            this.isTouchCooldown = true;
        }, this.coolDownTime);
        cc.audioEngine.play(this.res_aud_cntop,false);
        this.content_index = 1;
        this.labelHide.string = this.content_data["str_items_cn"][0] +' '+ this.content_data["str_items_en"][0];
        this.paperHideCard.spriteFrame = new cc.SpriteFrame(this.res_pics[0]); 
        var actions = cc.sequence(
            cc.moveBy(this.moveDuration, cc.p(0, -720)),
            cc.callFunc(function () {
                this.labelShow.string = this.content_data["str_items_cn"][0] +' '+ this.content_data["str_items_en"][0];
                this.paperShowCard.spriteFrame = new cc.SpriteFrame(this.res_pics[0]);   
                this.paperHide.node.y = 705;
                this._playAudioByIndex(0);
            }, this)
            );
        this.paperHide.node.runAction(actions);
    },

    moveForward:function(){
        if(this.content_index > this.content_count)return;
        this.isTouchCooldown = false;
        this.scheduleOnce(function(){
            this.isTouchCooldown = true;
        }, this.coolDownTime);
        if(this.content_index == this.content_count){
            this.content_index++;
            this.labelHide.string = '';
            this.paperHideCard.spriteFrame = new cc.SpriteFrame(this.res_wan); 
            var actions = cc.sequence(
                cc.moveBy(this.moveDuration, cc.p(0, -720)),
                cc.callFunc(function () {
                    this.labelShow.string = '';
                    this.paperShowCard.spriteFrame = new cc.SpriteFrame(this.res_wan);   
                    this.paperHide.node.y = 705;
                }, this)
            );
            this.paperHide.node.runAction(actions);
            return;
        }
        this.content_index++;
        this.labelHide.string = this.content_data["str_items_cn"][this.content_index-1] +' '+ this.content_data["str_items_en"][this.content_index-1];
        this.paperHideCard.spriteFrame = new cc.SpriteFrame(this.res_pics[this.content_index-1]);   
        var actions = cc.sequence(
            cc.moveBy(this.moveDuration, cc.p(0, -720)),
            cc.callFunc(function () {
                this.labelShow.string = this.content_data["str_items_cn"][this.content_index-1] +' '+ this.content_data["str_items_en"][this.content_index-1];
                this.paperShowCard.spriteFrame = new cc.SpriteFrame(this.res_pics[this.content_index-1]);   
                this.paperHide.node.y = 705;
                this._playAudioByIndex(this.content_index-1);
            }, this)
            );
        this.paperHide.node.runAction(actions);
    },
    
    moveBackward:function(){
        if(this.content_index <=1)return;
        this.isTouchCooldown = false;
        this.scheduleOnce(function(){
            this.isTouchCooldown = true;
        }, this.coolDownTime);
        this.content_index--;        
        this.paperHide.node.y = -15;
        if(this.content_index  == this.content_count){
            this.labelHide.string = '';
        }else{
            this.labelHide.string = this.content_data["str_items_cn"][this.content_index] +' '+ this.content_data["str_items_en"][this.content_index];
        }
        this.paperHideCard.spriteFrame = new cc.SpriteFrame(this.res_pics[this.content_index]);   
        this.labelShow.string = this.content_data["str_items_cn"][this.content_index-1] +' '+ this.content_data["str_items_en"][this.content_index-1];
        this.paperShowCard.spriteFrame = new cc.SpriteFrame(this.res_pics[this.content_index-1]);
        var actions = cc.sequence(
            cc.moveBy(this.moveDuration, cc.p(0, 720)),
            cc.callFunc(function () {
                this._playAudioByIndex(this.content_index-1);
            }, this)
            );
        this.paperHide.node.runAction(actions);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
