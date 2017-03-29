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
        sf_win: cc.SpriteFrame,
        sf_lose: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {
        this.gameController = cc.find('GameController').getComponent('GameController');
    },

    showGameOver:function(isWin){
        this.node.active = true;
        this.getComponent(cc.Sprite).spriteFrame = isWin ? this.sf_win : this.sf_lose;
    },

    btn_restart:function(){
        this.node.active = false;
        this.gameController.missionBegin();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
