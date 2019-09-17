import FlowerAI from "./FlowerAI";
import Monster from "../player/Monster";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import { GameAI } from "./GameAI";

export default class ShitouAI extends FlowerAI{
    
    /**普通石头人 */
    constructor(pro: Monster) {
        super(pro);
    }

    /** 石头姨儿AI优化 */
    onExe():void{
        this.checkHeroCollision();

        if(this.status == 0 && this.now >= this.nextTime)
        {//攻击主角   
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.startAttack();            
            this.nextTime = this.now + this.shooting.shootCd;
            if(Math.random()>0.7){//3成几率移动
                this.status = 1;
            }
        }
        else if(this.status == 1 && this.now >= this.nextTime){
            //移动1秒 随机方向
            this.nextTime = this.now + 1000;
            this.status = 2
            this.pro.rotation(Math.floor(Math.random()*8) * (Math.PI/4));
        }
        else if(this.status == 2 && this.now >= this.nextTime){
            //移动完毕500毫秒后，发射子弹
            this.pro.play(GameAI.Idle);
            this.nextTime = this.now + 500;
            this.status = 0;
        }

        if(this.status == 2)
        {
            this.pro.move2D(this.pro.face2d);
            this.pro.play(GameAI.Run);
        }
    }

}