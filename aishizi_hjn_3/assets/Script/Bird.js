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
        fire_sf:cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {
        this.gameController = cc.find('GameController').getComponent('GameController');
    },

    playAnim:function(index){

    },

    shangtian:function(){
        var fire = new cc.Node('fire');
        var fs = fire.addComponent(cc.Sprite);
        fs.spriteFrame = this.fire_sf;
        fire.parent = this.node;
        fire.y=-120;
        var actions = cc.sequence(
            cc.moveBy(1.5, cc.p(0, 1000)),
            cc.callFunc(function () {
                if(!this.gameController.isMissionOver){
                    this.gameController._makeQuestion();
                }
            }, this)
        );
        this.node.runAction(actions);
    },

    rudi:function(){
        var actions = cc.sequence(
            cc.callFunc(function () {
                this.node.rotation = 180;
            }, this),
            cc.moveBy(1.5, cc.p(0, -1000)),
            cc.callFunc(function () {
                if(!this.gameController.isMissionOver){
                    this.gameController._makeQuestion();
                }
            }, this)
        );
        this.node.runAction(actions);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
