import Game from "./Game";

export default class GameExecut extends Laya.EventDispatcher {

    now:number = 0;
    st:number  = 0;
    stopt:number = 0;
    startt:number = 0;
    dt:number = 0;//时间轴静止时间

    isRun:boolean = false;

    constructor(){
        super();
        this.now = Laya.Browser.now();
        this.st  = this.now;
        // this.stop_();
    }

    public start():void{
        this.now = Laya.Browser.now();
        this.dt += ( this.now - this.stopt) ;
        var arr = Game.AiArr;
        for (let i = 0; i < arr.length; i++) {
            if( arr[i].animator ) arr[i].animator.speed = 1;
        }
        this.isRun = true;
        Laya.stage.frameLoop(1,this,this.ai);
    }

    public stop_():void{
        this.now = Laya.Browser.now();
        this.stopt = this.now;
        Laya.timer.clear(this,this.ai);
        //animator
        var arr = Game.AiArr;
        for (let i = 0; i < arr.length; i++) {
            if( arr[i].animator ) arr[i].animator.speed = 0;
        }
        this.isRun = false;
    }

    /**得到游戏世界的时间轴 */
    public getWorldNow():number{
        this.now = Laya.Browser.now();
        return (this.now - this.dt )//; - this.dt;
    }

    ai():void{
        var arr = Game.AiArr;
        for (let i = 0; i < arr.length; i++) {
            arr[i].ai();
        }

        var farr = Game.map0.Fharr;
        for (let i = 0; i < farr.length; i++) {
            var fhit = farr[i];
            var pro  = fhit.linkPro_;
            if( fhit.hit(fhit,Game.hero.hbox) ){
                pro.closeCombat(Game.hero);
                if(pro.gamedata.ammoClip==0){
                    farr.slice( farr.indexOf(fhit) , 1 );
                }
            }
        }
    }

}