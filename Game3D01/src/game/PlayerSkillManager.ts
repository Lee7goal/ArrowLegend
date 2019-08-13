
import SysSkill from "../main/sys/SysSkill";
import Game from "./Game";
import SysBuff from "../main/sys/SysBuff";
import App from "../core/App";

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
       

        this.addAttack();
        this.addAttackSpeed();
        this.addHp();
    }

    addAttack(): void  {
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
    }

    addAttackSpeed(): void  {
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
    }

    addHp(): void  {

    }

    isHas(id: number): SysSkill  {
        for (let i = 0; i < this.skillList.length; i++)  {
            if (this.skillList[i].id == id)  {
                return this.skillList[i];
            }
        }
        return null;
    }
}