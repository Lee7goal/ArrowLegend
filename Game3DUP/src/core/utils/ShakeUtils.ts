/*
* name;
*/
export default class ShakeUtils {
    public static shake: ShakeUtils = new ShakeUtils();

    private sp:Laya.Sprite;
    private time:number;
    private startPo:Laya.Point = new Laya.Point();
    public shakeAni:Laya.FrameAnimation;
    public shakeBox:Laya.Box;
    constructor() {

    }

    public static setShakeUI(ani: Laya.FrameAnimation, box: Laya.Box): void {
        ShakeUtils.shake.shakeAni = ani;
        ShakeUtils.shake.shakeBox = box;
    }

    public static execute(sp: Laya.Sprite, time: number, moveLen: number): void {
        ShakeUtils.shake.exe(sp, time, moveLen);
    }

    public static execute2(sp: Laya.Sprite, time: number, rotateNum: number): void {
        ShakeUtils.shake.exe2(sp, time, rotateNum);
    }

    public startTime: number;

    private rotateNum:number;
    public exe2(sp: Laya.Sprite, delay: number, rotateNum: number):void
    {
        this.flag = false;
        this.rotateNum = rotateNum;
        this.sp = sp;
        Laya.timer.loop(delay, this, this.loopFun2);
        this.now = 0;
    }

    private flag:boolean = false;
    private loopFun2():void
    {
        if (this.rotateNum <= 0) {
            Laya.timer.clear(this, this.loopFun2);
            this.sp.rotation = 0;
            this.sp = null;
            return;
        }
        this.flag = !this.flag;
        this.rotateNum--;
        this.sp.rotation = this.rotateNum * (this.flag ? -1 : 1);
    }

    public exe(sp: Laya.Sprite, time: number, moveLen: number): void {
        this.moveLen = moveLen;
        this.time = time;
        this.sp = sp;
        this.startPo.setTo(sp.x, sp.y);
        Laya.timer.clear(this, this.loopFun);
        Laya.timer.frameLoop(1, this, this.loopFun);
        this.startTime = Laya.Browser.now();
        this.now = 0;
    }

    private arr: number[] = [-1, -1,-1, 1, 1, 1,1, -1];
    private now: number = 0;
    private moveLen: number;

    private loopFun(): void {
        if ((Laya.Browser.now() - this.startTime) > this.time) {
            Laya.timer.clear(this, this.loopFun);
            this.sp.pos(this.startPo.x, this.startPo.y);
            this.sp = null;
            return;
        }
        if (this.now >= this.arr.length) {
            this.now = 0;
        }
        this.sp.pos(this.startPo.x + this.arr[this.now] * this.moveLen, this.startPo.y + this.arr[this.now + 1] * this.moveLen);
        this.now += 2;
    }

    public static shakeByUI(sp: Laya.Sprite): void {
        ShakeUtils.shake.exeByUI(sp);
    }

    public exeByUI(sp: Laya.Sprite): void {
        this.sp = sp;
        this.startPo.setTo(sp.x, sp.y);
        Laya.timer.frameLoop(1, this, this.enterFun);
    }
    private nowIndex: number = 0;
    private enterFun(): void {
        if (this.nowIndex >= this.shakeAni.count) {
            this.stopShakeByUI();
            return;
        }
        this.shakeAni.index = this.nowIndex;
        this.sp.pos(this.startPo.x + this.shakeBox.x, this.startPo.y + this.shakeBox.y);
        this.nowIndex++;
    }

    private stopShakeByUI(): void {
        this.sp.pos(this.startPo.x, this.startPo.y);
        Laya.timer.clear(this, this.enterFun);
        this.nowIndex = 0;
    }



}
