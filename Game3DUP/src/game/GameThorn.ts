import GameBG from "./GameBG";
import Game from "./Game";
import GameHitBox from "./GameHitBox";
import GamePro from "./GamePro";

export default class GameThorn extends Laya.Image{
    static TAG:string = "GameThorn";
    private lastTime:number = 0;
    public hbox:GameHitBox = new GameHitBox(GameBG.ww, GameBG.ww);
    static arr:GameThorn[] = [];
    public inDanger:boolean = false;

    private cd:number = 1500;

    diciPro:GamePro;
    constructor(){
        super();
        this.diciPro = new GamePro(8,0);
        this.diciPro.hurtValue = 150;
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDis);
    }

    static getOne():GameThorn
    {
        let one:GameThorn = Laya.Pool.getItemByClass(GameThorn.TAG,GameThorn);
        GameThorn.arr.push(one);
        return one;
    }

    static recover():void
    {
        while(GameThorn.length > 0)
        {
            let one:GameThorn = GameThorn.arr.shift();
            one.removeSelf();
            Laya.Pool.recover(GameThorn.TAG,one);
        }
    }


    private onDis():void
    {
        console.log("显示地刺");
        this.inDanger = false;
        Laya.timer.frameLoop(1,this,this.onLoop);
        this.onLoop();
    }

    private onLoop():void
    {
        let now = Game.executor.getWorldNow();
        if(now > this.lastTime)
        {
            this.inDanger = !this.inDanger;
            this.lastTime = now + this.cd;
            this.skin = this.inDanger ? GameBG.BG_TYPE + '/500.png' : GameBG.BG_TYPE + '/500_0.png';
        }
    }

    private onUnDis():void
    {
        this.inDanger = false;
        Laya.timer.clear(this,this.onLoop);
    }
}