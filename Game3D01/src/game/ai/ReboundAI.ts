import BaseAI from "./BaseAi";
import Monster from "../player/Monster";
import GamePro from "../GamePro";
import Game from "../Game";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import BackMove from "../move/BackMove";

/**碰到东西反弹的ai */
export default class ReboundAI extends BaseAI{
    private cd:number = 0;
    private status:number = 0;
    private f:number[] = [];

    constructor(pro: Monster) {
        super(pro);
    }

    exeAI(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);
        this.checkHeroCollision();

        if(this.pro.isIce)
        {
            return;
        }
        if(this.status == 0){
            this.status = 1;
            this.pro.rotation(Math.PI/180 * 135);
            this.pro.play(GameAI.Run);
            // this.pro.setXY2DBox(this.pro.hbox.x + GameBG.ww,this.pro.hbox.y);
        }
        var bm = <BackMove>this.pro.getGameMove();
        this.pro.move2D(this.pro.face2d);
        if(bm && bm.rotation != this.pro.face2d){
            //this.facen2d_ = (2 * Math.PI - n);
            this.pro.rotation(2 * Math.PI - bm.rotation);
        }


        return false;
    }
}