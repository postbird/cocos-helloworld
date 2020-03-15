// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,    // 主角跳跃高度
        jumpDuration: 0,  // 主角跳跃持续时间
        maxMoveSpeed: 0,  // 最大移动速度
        accel: 0,         // 加速度
        jumpAudio: { // 跳跃声音
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initKeyEvent();
        this.jumpAction = this.initJumpAction();
        this.accLeft = false; // 向左移动
        this.accRight = false; // 向右移动
        this.xSpeed = 0; // 水平方向速度
        // 动作执行
        this.node.runAction(this.jumpAction);
    },

    start() {
    },
    update(dt) {
        this.updatePlayerPosition(dt);
    },
    // 初始化键盘事件
    initKeyEvent() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    // 初始化跳跃
    initJumpAction() {
        // 跳跃上升  
        const jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落 
        const jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 不断重复动作
        const callback = cc.callFunc(this.playJumpSound, this);// 每次动作结束 都进行音频的播放
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    onKeyDown(ev) {
        switch (ev.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },
    onKeyUp(ev) {
        switch (ev.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },
    // 通过速度和方向 更新位置
    updatePlayerPosition(dt) {
        // 通过方向来更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制最大移动速度
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // 根据当前的速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    },
    //播放跳跃的音频
    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }
});
