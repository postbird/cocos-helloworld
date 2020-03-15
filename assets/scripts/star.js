// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        picRadius: 0, // 通过 player 和 start 的距离判断已经收集
        picAudio: {  // 得分音效
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        if (this.getPlayerDistance() < this.picRadius) {
            // 可以收集 star
            this.handleStarPicked();
            return;
        }
        // 同步 gameControl 中的 timer 决定当前 star 的透明度
        const opacityRatio = 1 - this.game.timer / this.game.starDuration;
        const minOpacity = 50; // 最大透明度是 255
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
    // 获取 player 和 star 的距离
    getPlayerDistance() {
        // 获取 gameControl 中 player 引用的位置信息
        const playerPos = this.game.player.getPosition();
        // 计算两点距离
        return this.node.position.sub(playerPos).mag();
    },
    // 当认为星星已经可以被收集时的动作
    handleStarPicked() {
        this.game.gainScore(); // 计分
        cc.audioEngine.playEffect(this.picAudio, false);
        this.node.destroy();  // 销毁当前的节点
        this.game.spawnNewStar(); // 创建新节点
    }
});
