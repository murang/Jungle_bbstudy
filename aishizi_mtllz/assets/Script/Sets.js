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
        sf_bg:cc.SpriteFrame,
        sf_board:cc.SpriteFrame,
        sf_bg_hl:cc.SpriteFrame,
        sf_board_hl:cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {
        // this.setBoardString('fuck');
    },

    setBoardString:function(str){
         this.node.getChildByName('board').getChildByName('label').getComponent(cc.Label).string = str;
    },

    setHighLight:function(isHighLight){
        if(isHighLight){
            this.getComponent(cc.Sprite).spriteFrame = this.sf_bg_hl;
            this.node.getChildByName('board').getComponent(cc.Sprite).spriteFrame = this.sf_board_hl;
        }else{
            this.getComponent(cc.Sprite).spriteFrame = this.sf_bg;
            this.node.getChildByName('board').getComponent(cc.Sprite).spriteFrame = this.sf_board;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var rot = this.wheel.rotation;
        this.node.rotation = -rot;
    },
});
