import FlowerAI from "./FlowerAI";
import GamePro from "../GamePro";
import Monster from "../player/Monster";
import { GameAI } from "./GameAI";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameInfrared from "../GameInfrared";

//ArcherAI

export default class ArcherAI extends FlowerAI {

    private gi:GameInfrared;

    constructor(pro:Monster){
        super(pro);
         if(!this.gi){
             //这里要加入反弹次数
            this.gi = new GameInfrared(Game.hero,1);
            this.gi.show = false;
        }
    }


    onExe():void
    {

        this.checkHeroCollision();
        
        
        if(this.status == 0 && this.now >= this.nextTime){
            //status=1 走1.5秒
            this.nextTime = this.now + 1500;
            this.status = 1;
            this.pro.play(GameAI.Run);
        }        
        else if(this.status == 1 && this.now >= this.nextTime){
            //status=2 瞄1.5秒           
            this.nextTime = this.now + 1500;
            this.status = 2;
            
            this.pro.play(GameAI.Idle);                        
            var a: number = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
            Game.hero.rotation(a);
            this.gi.show = true;
            this.gi.drawMoveline();
        }
        else if(this.status == 2 && this.now >= this.nextTime){
            //射击前            
            //status=3 500毫秒 不转向
            this.nextTime = this.now + 500;
            this.status = 3;
        }
        else if(this.status == 3 && this.now >= this.nextTime){
            //射击
            this.startAttack();            
            //status=0 //想1秒
            this.nextTime = this.now + 1000;
            this.status = 0;
        }

        if(this.status == 1)
        {
            this.pro.move2D(this.pro.face2d);
            
        }
        else if(this.status == 2)
        {
            var a: number = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
            Game.hero.rotation(a);
            this.gi.show = true;
            this.gi.drawMoveline();
        }
        
    }
}