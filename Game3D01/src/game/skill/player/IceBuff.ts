
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

        if(this.to.gamedata.hp <= 0)
        {
            Game.buffM.removeBuff(this);
            if(this.skill.skilltarget == 2)
            {
                let buffIndex:number = (this.to as Monster).buffAry.indexOf(this.skill.id); 
                if(buffIndex != -1)
                {
                    (this.to as Monster).buffAry.splice(buffIndex,1);
                }
            }
        }
        

        if (now > this.skillCD) {
            this.skillCD = now + this.buff.buffCD;
            this.chixuCD = now + this.buff.buffDot;
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
        else if (now > this.chixuCD) {     
            (this.to as Monster).offCie();
        }
    }
}