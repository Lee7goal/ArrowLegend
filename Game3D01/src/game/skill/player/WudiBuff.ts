import PlayerBuff from "./PlayerBuff";
import Game from "../../Game";
import App from "../../../core/App";
import SysBuff from "../../../main/sys/SysBuff";
import SysSkill from "../../../main/sys/SysSkill";

/**无敌星星 */
export default class WudiBuff extends PlayerBuff {

    constructor(id: number) {
        super();
        this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
        this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
    }

    public exe(now: number): void {
        this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        if (now > this.skillCD) {
            this.skillCD = now + this.buff.buffCD;
            this.chixuCD = now + this.buff.buffDot;
            Game.hero.setWudi(true);
        }
        else if (now > this.chixuCD) {
            Game.hero.setWudi(false);
        }
    }

}