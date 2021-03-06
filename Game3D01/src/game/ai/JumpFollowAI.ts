import BaseAI from "./BaseAi";
import SysEnemy from "../../main/sys/SysEnemy";
import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import Monster from "../player/Monster";
import SysBullet from "../../main/sys/SysBullet";
import FlowerAI from "./FlowerAI";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameBG from "../GameBG";
import { ui } from "./../../ui/layaMaxUI";
import CallSkill from "../skill/CallSkill";
import AOESkill from "../skill/AOESkill";
import BoomEffect from "../effect/BoomEffect";

export default class JumpFollowAI extends FlowerAI {
    
    private callBullet: SysBullet;
    private xuanfengBullet: SysBullet;

    private callSkill:CallSkill;
    private aoeSkill:AOESkill;

    private cd:number = 0;

    private skillcd:number = 0;
    
    private windCd:number = 0;
    constructor(pro: Monster) {
        super(pro);

        this.callSkill = new CallSkill(this.skillISbs[0]);
        this.aoeSkill = new AOESkill(this.skillISbs[1]);
        this.cd = this.sysEnemy.enemySpeed;
        this.nextTime = Game.executor.getWorldNow() + this.cd;
    }

    

    exeAI(pro: GamePro): boolean {
        if (!this.run_) return;
        //super.exeAI(pro);
        if(this.pro.isIce)
        {
            return;
        }
        this.setShader();
        this.now = Game.executor.getWorldNow(); 
        if(this.now >= this.nextTime){
            this.onExe2(this.now);
            this.nextTime = this.now + this.cd;
        }


        if(this.pro.moveLen > 0)
        {
            if(this.pro.move2D(this.pro.face2d))
            {
                this.aoeSkill.showEff(this.pro);
            }
        }
        return false;
    }

    onExe2(now:number):void{
        let isCall:boolean = this.callSkill.exeSkill(now,this.pro);
        if(!isCall)
        {
            let isWind:boolean = this.aoeSkill.exeSkill(now,this.pro);
            if(!isWind)
            {
                this.normalAttack();
            }
        }
    }

    private normalAttack():void
    {
        if(this.status == 0 && this.now >= this.nextTime)
        {
            this.pro.play(GameAI.Idle);
            this.nextTime = this.now + this.sysEnemy.enemySpeed;
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.status = 1;
        }
        else if(this.status == 1 && this.now >= this.nextTime)
        {
            this.startAttack();
            this.status = 0;
            this.nextTime = this.now + this.shooting.shootCd;
        }
    }

    public onJump():void{
        
    }
}