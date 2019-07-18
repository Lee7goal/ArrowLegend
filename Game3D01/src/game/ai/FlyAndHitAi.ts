import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";


export default class FlyAndHitAi extends GameAI {

    private pro: GamePro;
    private st:number = 0;
    private status:number = 0;
    private collisionCd:number = 0;

    exeAI(pro: GamePro): boolean {
        var now = Game.executor.getWorldNow();
        if(now < this.st){
            if(GameHitBox.faceToLenth(this.pro.hbox ,Game.hero.hbox)>GameBG.ww2){
                var a:number = GameHitBox.faceTo3D(this.pro.hbox ,Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.move2D(this.pro.face2d);
            }
            else{
                if(now > this.collisionCd)
                {
                    if( Game.hero.hbox.linkPro_ ){
                        // Game.hero.hbox.linkPro_.event(Game.Event_Hit,pro);
                        pro.event(Game.Event_Hit,Game.hero.hbox.linkPro_);
                        this.collisionCd = now +1000;
                    }
                }
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
                this.pro.setSpeed(10);
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
        this.run_ = false;
    }

    hit(pro:GamePro){
        this.pro.hurt(10);
        if(this.pro.gamedata.hp<=0){
            this.pro.play(GameAI.Die);
            this.pro.stopAi();
            if(Game.map0.Eharr.indexOf( this.pro.hbox )>=0){
                Game.map0.Eharr.splice( Game.map0.Eharr.indexOf( this.pro.hbox ) , 1 );
            }
        }else{
            if(this.pro.acstr == GameAI.Idle){
                this.pro.play(GameAI.TakeDamage);
            }
        }
    }
    
    constructor(pro: GamePro){
        super();
        this.pro = pro;
        // this.pro.sp3d.transform.localPositionY = 1;
        // this.pro.sp3d.transform.scale = new Laya.Vector3(0.5,0.5,0.5);
    }
}