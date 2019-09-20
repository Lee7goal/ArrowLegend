import Monster from "../player/Monster";
import GameHitBox from "../GameHitBox";
import Game from "../Game";

export default class GameScaleAnimator{
    sp       :Laya.Point;
    futureBox:GameHitBox;
    starttime:number = 0;
    playtime :number = 0;
    movelen  :number = 0;
    ms       :Monster = null;
    rad      :number = 0;
    
    public ai(ms:Monster):void{};

    now      :number = 0;
    cd      :number = 1300;
    public isOk():boolean
    {
        return Game.executor.getWorldNow() >= this.now + this.cd;
    }
}