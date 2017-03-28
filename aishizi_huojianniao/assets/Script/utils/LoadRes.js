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
        loadingLayout:cc.Layout,
        btnBegin:cc.Button,
        loadingTips: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.loadingLayout.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //block the touch event behind this layout
        }, this);
        this.progressBar = this.getComponent(cc.ProgressBar);
        this.progressBar.progress = 0;  
        this.gameController = cc.find('GameController').getComponent('GameController');
        this.btnBegin.node.active = false;
    },

    loadResources:function(resList) {
        cc.loader.load(resList, this._progressCallback.bind(this), this._completeCallback.bind(this));
    },

    startMission:function(){
        this.loadingLayout.node.active = false;
        this.gameController.missionBegin();
    },

    _progressCallback: function (completedCount, totalCount, res) {
        this.progress = completedCount / totalCount;
        this.resource = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    },

    _completeCallback: function (error, res) {
        this.node.active = false;
        this.btnBegin.node.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.resource) {
            return;
        }
        var progress = this.progressBar.progress;
        if (progress >= 1) {
            return;
        }
        if (progress < this.progress) {
            progress += dt;
        }
        this.progressBar.progress = progress;
    },
});
