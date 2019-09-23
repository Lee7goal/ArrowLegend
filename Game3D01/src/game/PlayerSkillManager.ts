
import SysSkill from "../main/sys/SysSkill";
import Game from "./Game";
import SysBuff from "../main/sys/SysBuff";
import App from "../core/App";
import SysNpc from "../main/sys/SysNpc";
import BuffID from "./buff/BuffID";
import Session from "../main/Session";

export default class PlayerSkillManager {

    clear(): void  {
        this.skillList.length = 0;
        this.arrowHeadId = 0;
        SysSkill.reset();
    }

    /**已经获得技能 */
    public skillList: SysSkill[] = [];

    get skills():string
    {
        let ss:string = "";
        for(let i = 0; i < this.skillList.length; i++)
        {
            ss += "," + this.skillList[i].id + "_" + this.skillList[i].curTimes
        }
        ss = ss.substring(1);
        return ss;
    }

    arrowHeadId: number = 0;

    skinsHeads: number[] = [2001, 2002, 2003, 2004];
    addArrowHead(id: number): void  {
        this.arrowHeadId = id;
        Laya.loader.create(["h5/bullets/skill/" + id + "/monster.lh"]);
    }

    constructor() { }

    skinSkills: number[] = [5001, 5002, 5003, 5004, 5005, 5009];

    addSkill(data?: SysSkill): void {
        if(data == null)
        {
            return;
        }
        if (this.skinsHeads.indexOf(data.id) != -1)  {
            this.addArrowHead(data.id);
            // return;
        }

        if (data) {
            let sys: SysSkill = this.isHas(data.id);
            if (sys) {
                if (sys.curTimes < sys.upperLimit) {
                    sys.curTimes++;
                }
            }
            else {
                this.skillList.push(data);
                data.curTimes++;
            }
            console.log(data.skillName, "添加技能");
        }

        if (this.skinSkills.indexOf(data.id) != -1)  {
            Laya.loader.create(["h5/bullets/skill/" + data.id + "/monster.lh"]);
        }

        if (data.id == BuffID.WUDI_5009)  {
            Game.hero.addBuff(BuffID.WUDI_5009);
        }

        this.addAttack();
        this.addAttackSpeed();
    }

    addAttack(): number {
        let buff: SysBuff;
        let attackNum:number = Session.heroData.curHeroData.atk;
        let sys3002: SysSkill = this.isHas(3002);
        if (sys3002) {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3002.skillEffect1);
            if (buff) {
                attackNum += sys3002.curTimes * buff.addAttack;
            }
        }
        buff = null;

        let sys3003: SysSkill = this.isHas(3003);
        if (sys3003) {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3003.skillEffect1);
            if (buff) {
                attackNum += sys3003.curTimes * buff.addAttack;
            }
        }
        return attackNum;
    }

    addAttackSpeed(): number {
        let buff: SysBuff;
        let attackSpeed:number = Session.heroData.curHeroData.atkSpeed;
        let sys3004: SysSkill = this.isHas(3004);
        if (sys3004) {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3004.skillEffect1);
            if (buff) {
                let rate: number = 1;
                for (let i = 0; i < sys3004.curTimes; i++)  {
                    attackSpeed = attackSpeed * (1 - buff.addSpeed / 1000);
                }

            }
        }

        buff = null;

        let sys3005: SysSkill = this.isHas(3005);
        if (sys3005) {
            buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3005.skillEffect1);
            if (buff) {
                let rate: number = 1;
                for (let i = 0; i < sys3005.curTimes; i++)  {
                    rate = rate * (buff.addSpeed / 1000);
                }
                attackSpeed = attackSpeed * (1 - rate);
            }
        }
        return attackSpeed;
    }

    isHas(id: number): SysSkill {
        for (let i = 0; i < this.skillList.length; i++) {
            if (this.skillList[i].id == id) {
                return this.skillList[i];
            }
        }
        return null;
    }

    removeSkill(id: number): void  {
        let sys: SysSkill = this.isHas(id);
        if (sys)  {
            let index: number = this.skillList.indexOf(sys);
            if (index >= 0)  {
                this.skillList.splice(index, 1);
            }
        }
    }

    getRotateSkills(): number[]  {
        let skillIds: number[] = [5001, 5002, 5003, 5004];
        let rt: number[] = [];
        for (let i = 0; i < skillIds.length; i++)  {
            if (this.isHas(skillIds[i]))  {
                rt.push(skillIds[i]);
            }
        }
        return rt;
    }


    getRandomSkillByNpcId(npcId: number): number  {
        let sysNpc: SysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME, npcId);
        let ary: string[] = sysNpc.skillRandom.split(",");


        for (let i = 0; i < this.skillList.length; i++)  {
            let sys: SysSkill = this.skillList[i];
            if (sys) {
                if (sys.curTimes >= sys.upperLimit) {
                    let flag: number = ary.indexOf(sys.id + "");
                    if (flag != -1)  {
                        ary.splice(flag, 1);
                    }
                }
            }
        }

        let rand = Math.floor(Math.random() * ary.length);

        return Number(ary[rand]);
    }
}