// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 声明星星的预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点用于判断生成星星的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点
        player: {
            default: null,
            type: cc.Node
        },
        // score label 节点
        scoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.timer = 0;// 初始化定时器
        this.starDuration = 0;
        this.score = 0; // 初始化成绩
        this.groundY = this.ground.y + this.ground.height / 2; // 获取地面高度
        this.spawnNewStar(); // 先生成一个 star
    },

    start() {

    },
    update(dt) {
        // 判断时间是否超过限制
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },
    // 随机增加星星
    spawnNewStar() {
        // 创建一个新节点
        this.starNode = cc.instantiate(this.starPrefab);
        // console.log(newStar);
        // 在 canvas 挂载新节点
        this.node.addChild(this.starNode);
        // 设置随机位置
        this.starNode.setPosition(this.initNewStarPosition());
        // 將當前的 gameControl 引用掛載到 star 中
        this.starNode.getComponent('star').game = this;
        // 每次生成完新的 star 后需要重置计时器
        this.timer = 0;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
    },
    // 随机生成星星的位置
    initNewStarPosition() {
        // console.log(this.player.getComponent('player'));
        // 通过地面x轴位置和跳跃高度，随机生成 y 坐标
        const randY = this.groundY + Math.random() * this.player.getComponent('player').jumpHeight + 50;
        // 最大宽度是屏幕宽度，因为锚点在中间  X 坐标需要屏幕宽度的一半
        const maxX = this.node.width - 48; // padding 24
        const randX = (Math.random() - 0.5) * maxX;
        return cc.v2(randX, randY);
    },
    // update (dt) {},
    // 处理 score --- 这个方法还是在 star 得分的时候调用
    gainScore() {
        this.score += 1;
        // 更新文案
        this.scoreLabel.string = 'Score: ' + this.score;
    },
    // game over
    gameOver() {
        this.player.stopAllActions(); // 停止所有的 action
        cc.director.loadScene('game');
    }

});
