import { GameAI } from "../game/GameAI";
import GamePro from "../game/GamePro";
import GameHitBox from "../game/GameHitBox";
import Game from "../game/Game";
import GameBG from "../game/GameBG";

export class FlyAndHitAi extends GameAI {

    private pro: GamePro;
    private st:number = 0;
    private status:number = 0;

    exeAI(pro: GamePro): boolean {
        var now = Game.executor.getWorldNow();
        if(now < this.st){
            if(GameHitBox.faceToLenth(this.pro.hbox ,Game.hero.hbox)>GameBG.ww2){
                var a:number = GameHitBox.faceTo3D(this.pro.hbox ,Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.move2D(this.pro.face2d);
            }
        }
        else{
            if(this.status==0){
                if(this.pro.acstr!=GameAI.NormalAttack){
                    this.pro.play(GameAI.NormalAttack);
                    this.status = 1;
                    //this.pro.setKeyNum(0.5);
                    return;
                }
            }
            else if(this.status==1){                              
                if(this.pro.acstr!=GameAI.NormalAttack){
                    this.pro.setSpeed(2);
                    this.pro.play(GameAI.Idle);
                    this.status = 0;
                    this.st = now + 3500;
                    return;
                }
            }
            if( this.pro.normalizedTime >0.5 ){
                this.pro.setSpeed(6);
                this.pro.move2D(this.pro.face2d);
            }
        }



        return false;
    }

    starAi() {
        this.pro.play(GameAI.Idle);
        this.st = Game.executor.getWorldNow() + 3500;
        this.pro.setSpeed(2);
    }

    stopAi(){

    }

    hit(pro:GamePro){
    
    }
    
    constructor(pro: GamePro){
        super();
        this.pro = pro;
        this.pro.sp3d.transform.localPositionY = 1;
        this.pro.sp3d.transform.scale = new Laya.Vector3(0.5,0.5,0.5);
    }
}