
import PlayerBuff from "./PlayerBuff";
import Game from "../../Game";
import App from "../../../core/App";
import SysBuff from "../../../main/sys/SysBuff";
import Monster from "../../player/Monster";
import SysSkill from "../../../main/sys/SysSkill";
import HeroBullet from "../../player/HeroBullet";
import GamePro from "../../GamePro";

/**冰冻*/
export default class IceBuff extends PlayerBuff{
    
    constructor(id:number) {
        super();
        this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME,id);
        this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
    }

    
    public exe(now: number): void  {
        let nt = now - this.startTime;
        nt = nt / this.buff.buffCD;

        if(nt >= 1)
        { 
            console.log("移除冰冻buff");
            Game.buffM.removeBuff(this);
            return;
        }

        let nt2 = now - this.startTime;
        nt2 = nt2 / this.buff.buffDot;
        if(nt2 >= 1)
        {
            (this.to as Monster).offCie();
        }
        this.onCie();
        
    }

    private isExe:boolean = false;
    private onCie():void
    {
        if(this.isExe)
        {
            return;
        }
        this.isExe = true;
        (this.to as Monster).onCie();
        if(this.buff.damagePercent > 0)
        {
            if(this.skill.skilltarget == 2)
            {
                this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
                this.to.hit(this.bullet,true);
            }
        } 
    }
}