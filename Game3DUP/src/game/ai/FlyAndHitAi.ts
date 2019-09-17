import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";
import Monster from "../player/Monster";
import BaseAI from "./BaseAi";

/**飞行撞击ai */
export default class FlyAndHitAi extends BaseAI {

    private status:number = 0;
    private cd:number = 0;

    //private static times:number[] = [0,1500,3000,4500];
    private static timdex:number = 0;

    constructor(pro:Monster){
        super(pro);
        pro.sp3d.transform.localPositionY = 1;
        
        if(FlyAndHitAi.timdex>=4){
            FlyAndHitAi.timdex = 0;
        }

        this.cd = Game.executor.getWorldNow() + FlyAndHitAi.timdex*2000;
        FlyAndHitAi.timdex++;
        pro.setSpeed(1);
    }

    

    exeAI(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);
        this.checkHeroCollision();
        var sys = this.pro.sysEnemy;
        
        if(this.pro.isIce)
        {
            return;
        }

        if(this.status==0 && this.now>=this.cd){
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            //this.ms.setSpeed(8);
            this.cd = this.now + 1000;
            this.status = 1;
           
            if (this.pro.acstr != GameAI.NormalAttack) {
                this.pro.play(GameAI.NormalAttack);
                this.pro.unBlocking = true;
            }
        }
        else if(this.status ==1 && this.now>=this.cd){
            this.pro.setSpeed(sys.moveSpeed);
            this.cd = this.now + sys.enemySpeed;
            this.status = 0;
            this.pro.unBlocking = false;
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
        }else if(this.status == 0){
            this.traceHero();
        }
    }

    private traceHero():void{
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
            let a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.pro.move2D(this.pro.face2d);
        }
    }


    
    hit(pro: GamePro) {
        super.hit(pro);
    }
   
}