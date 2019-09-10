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
        // let mRow: number = Math.floor(this.pro.hbox.cy / GameBG.ww);
        // let mCol: number = Math.floor(this.pro.hbox.cx / GameBG.ww);
        // let row1: number;
        // let col1: number;
        // let row2: number;
        // let col2: number;
        // row1 = mRow;
        // col1 = mCol + 1;
        // row2 = mRow + 1;
        // col2 = mCol;
        // if (mRow <= 10) {
        //     row1 = 10;
        //     row2 = 11;
        // }
        // else if (mRow >= Game.map0.endRowNum) {
        //     row1 = Game.map0.endRowNum;
        //     row2 = Game.map0.endRowNum - 1;
        // }
        // if (mCol <= 1) {
        //     col1 = 1;
        //     col2 = 2;
        // }
        // else if (mCol >= 11) {
        //     col1 = 11;
        //     col2 = 10;
        // }
        let flag: number = this.pro.splitTimes + 1;
        let hp: number = this.pro.gamedata.maxhp / 2;
        let monster1: Monster = Monster.getMonster(this.pro.sysEnemy.id, this.pro.hbox.cx, this.pro.hbox.cy, 0.5, hp);
        monster1.splitTimes = flag;
        let monster2: Monster = Monster.getMonster(this.pro.sysEnemy.id, this.pro.hbox.cx,this.pro.hbox.cy, 0.5, hp);
        monster2.splitTimes = flag;
    }
}