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
        loadingBar:{
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
        }
    },

    // use this for initialization
    onLoad: function () {
        this.labelHide.string = '宝宝爱认知';
        this.paperHide.node.runAction(cc.moveBy(this.moveDuration, cc.p(0, -720)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
