
import SysSkill from "../main/sys/SysSkill";
import Game from "./Game";
import SysBuff from "../main/sys/SysBuff";
import App from "../core/App";
import SysNpc from "../main/sys/SysNpc";
import BuffID from "./buff/BuffID";

export default class PlayerSkillManager {
    /**已经获得技能 */
    public skillList: SysSkill[] = [];
    constructor() { }

    addSkill(data?: SysSkill): void {
        if (data)  {
            let sys: SysSkill = this.isHas(data.id);
            if (sys)  {
                if (sys.curTimes < sys.upperLimit)  {
                    sys.curTimes++;
                }
            }
            else  {
                this.skillList.push(data);
                data.curTimes++;
            }
            console.log(data.skillName,"添加技能");
        }
       
        if(data.id == BuffID.WUDI_5009)
        {
            Game.hero.addBuff(BuffID.WUDI_5009);
        }

        this.addAttack();
        this.addAttackSpeed();
    }

    addAttack(): number  {
        let buff: SysBuff;
        Game.hero.playerData.baseAttackPower = 150;
        let sys3002: SysSkill = this.isHas(3002);
        if (sys3002)  {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3002.skillEffect1);
            if (buff)  {
                Game.hero.playerData.baseAttackPower += sys3002.curTimes * buff.addAttack;
            }
        }
        buff = null;

        let sys3003: SysSkill = this.isHas(3003);
        if (sys3003)  {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3003.skillEffect1);
            if (buff)  {
                Game.hero.playerData.baseAttackPower += sys3003.curTimes * buff.addAttack;
            }
        }
        return Game.hero.playerData.baseAttackPower;
    }

    addAttackSpeed(): number  {
        let buff: SysBuff;
        Game.hero.playerData.attackSpeed = 650;
        let sys3004: SysSkill = this.isHas(3004);
        if (sys3004)  {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3004.skillEffect1);
            if (buff)  {
                let rate:number = 1;
                for(let i = 0 ; i < sys3004.curTimes; i++)
                {
                    Game.hero.playerData.attackSpeed = Game.hero.playerData.attackSpeed * (1 - buff.addSpeed / 1000);
                }
                
            }
        }

        buff = null;

        let sys3005: SysSkill = this.isHas(3005);
        if (sys3005)  {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3005.skillEffect1);
            if (buff)  {
                let rate:number = 1;
                for(let i = 0 ; i < sys3005.curTimes; i++)
                {
                    rate = rate * (buff.addSpeed / 1000);
                }
                Game.hero.playerData.attackSpeed = Game.hero.playerData.attackSpeed * (1 - rate);
            }
        }
        return Game.hero.playerData.attackSpeed;
    }

    isHas(id: number): SysSkill  {
        for (let i = 0; i < this.skillList.length; i++)  {
            if (this.skillList[i].id == id)  {
                return this.skillList[i];
            }
        }
        return null;
    }

    removeSkill(id: number):void
    {
        let sys:SysSkill = this.isHas(id);
        if(sys)
        {
            let index:number = this.skillList.indexOf(sys);
            if(index >= 0)
            {
                this.skillList.splice(index,1);
            }
        }
    }


    getRandomSkillByNpcId(npcId:number):number
    {
        let sysNpc:SysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME,npcId);
        let ary:string[] = sysNpc.skillRandom.split(",");

        
        for(let i = 0; i < this.skillList.length; i++)
        {
            let sys: SysSkill = this.skillList[i];
            if (sys)  {
                if (sys.curTimes >= sys.upperLimit)  {
                    let flag:number = ary.indexOf(sys.id + "");
                    if(flag != -1)
                    {
                        ary.splice(flag,1);
                    }
                }
            }
        }
        
        let rand = Math.floor(Math.random() * ary.length);

        return Number(ary[rand]);
    }
}