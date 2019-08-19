import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";
import Monster from "../player/Monster";
import BaseAI from "./BaseAi";


export default class MoveAndHitAi extends BaseAI {
    
    private status:number = 0;
    private cd:number = 0;

    constructor(pro:Monster){
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
        var sys = this.pro.sysEnemy;        
        if(this.status==0 && this.now>=this.cd){
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            //this.ms.setSpeed(8);
            this.cd = this.now + 1000;
            this.status = 1;
            if (this.pro.acstr != GameAI.NormalAttack) {
                this.pro.play(GameAI.NormalAttack);
            }
        }
        else if(this.status ==1 && this.now>=this.cd){
            this.pro.setSpeed(sys.moveSpeed);
            // this.cd = this.now + sys.enemySpeed;
            this.cd = this.now + 1000;
            this.status = 0;
            this.pro.play(GameAI.Run);
        }

        if(this.status==1){
            if (this.pro.normalizedTime > 0.4) {
                this.pro.setSpeed(10);
                this.pro.move2D(this.pro.face2d);    
            }else{
                this.pro.setSpeed(1);
                this.pro.move2D(this.pro.face2d + Math.PI);   
            }           
        }else{
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
                let a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.move2D(this.pro.face2d);
            }
        }

        

    }
    
    hit(pro: GamePro) {
        super.hit(pro);
    }
}