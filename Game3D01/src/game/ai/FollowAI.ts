import BaseAI from "./BaseAi";
import Monster from "../player/Monster";
import GamePro from "../GamePro";
import Game from "../Game";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";

export default class FollowAI extends BaseAI{
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
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.pro.setSpeed(this.sysEnemy.moveSpeed * 2);
            this.pro.play(GameAI.Run);
        }
        else if(this.status == 1 && this.now >= this.cd)
        {
            // this.cd = this.now + this.sysEnemy.enemySpeed;
            this.cd = this.now + 100;
            this.pro.setSpeed(0)
            this.status = 0;
            // this.pro.play(GameAI.Idle);
        }

        if(this.status == 1)
        {
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.pro.move2D(this.pro.face2d);
        }
    }

}