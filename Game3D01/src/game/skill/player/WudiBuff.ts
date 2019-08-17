import PlayerBuff from "./PlayerBuff";
import Game from "../../Game";
import App from "../../../core/App";
import SysBuff from "../../../main/sys/SysBuff";

/**无敌星星 */
export default class WudiBuff extends PlayerBuff {

    constructor() {
        super();
    }

    public exe(now: number): void  {
        this.skill = Game.skillManager.isHas(5009);
        if (this.skill)  {
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

}