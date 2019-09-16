import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";
import Monster from "../player/Monster";
import BaseAI from "./BaseAi";
import SysEnemy from "../../main/sys/SysEnemy";


export default class MoveAndHitAi extends BaseAI {
    
    private status:number = 0;
    private cd:number = 0;

    static index:number = 0;
    constructor(pro:Monster){
        super(pro);
        MoveAndHitAi.index++;
        if(MoveAndHitAi.index > 4)
        {
            MoveAndHitAi.index = 0;
        }
        this.cd = Game.executor.getWorldNow() + MoveAndHitAi.index * 1500;
    }

    exeAI(pro: GamePro): boolean {
        if(!this.run_)return;
        super.exeAI(pro);
        this.checkHeroCollision();
        if(this.pro.isIce)
        {
            return;
        }
        var sys:SysEnemy = this.pro.sysEnemy;        
        if(this.status==0 && this.now>=this.cd){
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.cd = this.now + sys.enemySpeed;
            this.status = 1;
            if (this.pro.acstr != GameAI.NormalAttack) {
                this.pro.play(GameAI.NormalAttack);
            }
        }
        else if(this.status ==1 && this.now>=this.cd){
            this.pro.setSpeed(sys.moveSpeed);
            this.cd = this.now + sys.enemySpeed;
            this.status = 0;
            this.pro.play(GameAI.Run);
        }

        if(this.status==1){
            if (this.pro.normalizedTime > 0.4) {
                this.pro.setSpeed(8);
                this.pro.move2D(this.pro.face2d);  
            }else{
                this.pro.setSpeed(1);
                this.pro.move2D(this.pro.face2d + Math.PI);   
            }           
        }else{
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww * 5) {
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