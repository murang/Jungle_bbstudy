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
        wheel:cc.Node,
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
        current_index:1
    },

    // use this for initialization
    onLoad: function () {
        
    },

    selectRight:function(){
        // this.set_1.getComponent('Sets').setHightLight(true);
        var actions = cc.sequence(
            cc.callFunc(function () {
                
            }, this),
            cc.moveBy(this.moveDuration, cc.p(0, -720)),
            cc.callFunc(function () {
                this.labelShow.string = '';
                this.paperShowCard.spriteFrame = new cc.SpriteFrame(this.res_wan);   
                this.paperHide.node.y = 705;
            }, this)
        );
        this.paperHide.node.runAction(actions);
        
    },

    selectWrong:function(){

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
