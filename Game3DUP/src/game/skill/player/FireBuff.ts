
import PlayerBuff from "./PlayerBuff";
import Game from "../../Game";
import App from "../../../core/App";
import SysBuff from "../../../main/sys/SysBuff";
import Monster from "../../player/Monster";
import SysSkill from "../../../main/sys/SysSkill";
import HeroBullet from "../../player/HeroBullet";
import GamePro from "../../GamePro";

/**火焰和淬毒*/
export default class FireBuff extends PlayerBuff{
    
    constructor(id:number) {
        super();
        this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME,id);
        this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
    }

    public exe(now: number): void  {
        if(this.buff.times > 0 && this.curTimes > this.buff.times)
        {
            console.log("移除火焰buff");
            Game.buffM.removeBuff(this);
            return;
        }
        if (now > this.nextTime) {
            this.curTimes++; 
            this.nextTime = this.startTime + this.buff.buffCD * this.curTimes;
            this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
            if(this.skill.skilltarget == 2)
            {
                (this.to as Monster).hit(this.bullet,true);  
            }
        }
    }
}