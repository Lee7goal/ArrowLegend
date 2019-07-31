import BaseAI from "./BaseAi";
import Monster from "../player/Monster";
import GamePro from "../GamePro";
import GameBG from "../GameBG";
import Game from "../Game";
import { GameAI } from "./GameAI";

export default class RandMoveAI extends BaseAI {
    private cd:number = 0;
    private status:number = 0;

    private static timdex:number = 0;

    constructor(pro: Monster) {
        super(pro);
        pro.setSpeed(this.sysEnemy.moveSpeed);
        if(RandMoveAI.timdex>=4){
            RandMoveAI.timdex = 0;
        }
        this.cd = Game.executor.getWorldNow() + RandMoveAI.timdex*2000;
        RandMoveAI.timdex++;
    }

    exeAI(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);
        this.checkHeroCollision();

        if(this.status == 0 && this.now >= this.cd)
        {
            
            this.status = 1;
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.pro.rotation((Math.PI/8) * Math.floor(Math.random()*16) );
            this.pro.play(GameAI.Run);
        }
        else if(this.status == 1 && this.now >= this.cd)
        {   
            
            this.status = 0;
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.pro.play(GameAI.Idle);
            
        }

        if(this.status == 1)
        {
            this.pro.move2D(this.pro.face2d);
        }

    }
    

    exeAI0(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);

        this.checkHeroCollision();

        if(this.status == 0 && this.now >= this.cd)
        {
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.status = 1;
            // this.pro.rotation(Math.PI * 0.5 * Math.ceil(4 * Math.random()) + Math.PI * 0.5 * Math.random());
            // this.pro.curLen = 0;
            // this.pro.moveLen = GameBG.ww * 4;
            //随机一个可以移动的位置
            let toArr:number[] = Game.getRandPos(this.pro);
            let toX = toArr[0] * GameBG.ww;
            let toY = toArr[1] * GameBG.ww;
            this.pro.curLen = 0;
            this.pro.moveLen = Math.sqrt((this.pro.hbox.y - toY) * (this.pro.hbox.y - toY) + (this.pro.hbox.x - toX) * (this.pro.hbox.x - toX));
            var xx:number = toX -this.pro.hbox.x;
            var yy:number = this.pro.hbox.y - toY;
            this.pro.rotation(Math.atan2(yy,xx));
        }
        else if(this.status == 1 && this.now >= this.cd)
        {
            this.cd = this.now + this.sysEnemy.enemySpeed;
            this.status = 0;
        }

        if(this.status == 1)
        {
            this.pro.move2D(this.pro.face2d);
        }
    }
}