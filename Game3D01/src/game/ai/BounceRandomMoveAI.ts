import BaseAI from "./BaseAi";
import Monster from "../player/Monster";
import GamePro from "../GamePro";
import GameBG from "../GameBG";

export default class BounceRandomMoveAI extends BaseAI {
    private cd:number = 0;
    private status:number = 0;
    constructor(pro: Monster) {
        super(pro);
    }

    

    exeAI(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);

        this.checkHeroCollision();

        if(this.status == 0 && this.now >= this.cd)
        {
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.status = 1;
            this.pro.rotation(2 * Math.PI * Math.random());
            this.pro.curLen = 0;
            this.pro.moveLen = GameBG.ww * 6;
            pro.setSpeed(this.sysEnemy.moveSpeed);
            pro.gamedata.bounce = 2;
        }
        else if(this.status == 1 && this.now >= this.cd)
        {
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.cd = this.now + 500;
            this.status = 0;
            // pro.setSpeed(this.sysEnemy.moveSpeed);
        }

        if(this.status == 1)
        {
            this.pro.move2D(this.pro.face2d);
        }
    }
}