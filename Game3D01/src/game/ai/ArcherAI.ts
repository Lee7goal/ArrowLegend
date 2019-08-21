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
            var i = pro.sysBullet.ejectionNum + 1;
            if(i<1)i=1;
            this.gi = new GameInfrared(pro,i);
            this.gi.show = false;
        }
    }

    public faceToHero(){
        //射击前不在追踪英雄
        return;
    }


    onExe():void
    {

        if(this.pro.gamedata.hp <= 0)
        {
            return;
        }
        this.checkHeroCollision();
        
        
        if(this.status == 0 && this.now >= this.nextTime){
            //status=1 走1.5秒
            this.pro.rotation((Math.PI/4) * Math.ceil(Math.random()*8));
            this.nextTime = this.now + 1500;
            this.status = 1;
            this.pro.play(GameAI.Run);
        }        
        else if(this.status == 1 && this.now >= this.nextTime){
            //status=2 瞄1.5秒           
            this.nextTime = this.now + 1500;
            this.status = 2;
            
            this.pro.play(GameAI.Idle);                        
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.gi.show = true;
            this.gi.drawMoveline();
        }
        else if(this.status == 2 && this.now >= this.nextTime){
            //射击前            
            //status=3 500毫秒 不转向
            this.gi.show = false;
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
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.gi.show = true;
            this.gi.drawMoveline();
        }
        
    }

    hit(pro: GamePro)
    {
        super.hit(pro);
        if(this.pro.gamedata.hp <= 0)
        {
            this.gi.show = false;
        }
    }
}