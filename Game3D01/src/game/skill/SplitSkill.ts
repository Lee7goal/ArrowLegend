import BaseSkill from "./BaseSkill";
import SysBullet from "../../main/sys/SysBullet";
import GamePro from "../GamePro";
import Monster from "../player/Monster";
import GameBG from "../GameBG";
import Game from "../Game";

export default class SplitSkill extends BaseSkill {

    private pro:Monster;
    constructor(sys: SysBullet) { super(sys); }

    exeSkill(now: number, pro: Monster): boolean  {
        this.pro = pro;
        if (pro.splitTimes < this.sysBullet.splitNum)
        {
            this.onDieSplit();
            return true;
        }
        return false;
    }

    /**死亡分裂 */
    private onDieSplit(): void {
        console.log("分裂");
        let flag: number = this.pro.splitTimes + 1;
        let hp: number = this.pro.gamedata.maxhp / 2;

        let toArr:number[] = Game.getRandPos(this.pro,1);
        let toX = toArr[0] * GameBG.ww;
        let toY = toArr[1] * GameBG.ww;
        let monster1: Monster = Monster.getMonster(this.pro.sysEnemy.id, toX, toY, 1, hp);
        monster1.splitTimes = flag;

        let toArr1:number[] = Game.getRandPos(this.pro,1);
        let toX1 = toArr1[0] * GameBG.ww;
        let toY1 = toArr1[1] * GameBG.ww;
        let monster2: Monster = Monster.getMonster(this.pro.sysEnemy.id, toX1,toY1, 1, hp);
        monster2.splitTimes = flag;
    }
}