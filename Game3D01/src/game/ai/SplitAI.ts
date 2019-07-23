import { GameAI } from "./GameAI";
import GamePro from "../GamePro";
import Monster from "../player/Monster";
import GameBG from "../GameBG";
import Game from "../Game";
import App from "../../core/App";
import SysBullet from "../../main/sys/SysBullet";
import AttackType from "./AttackType";

export default class SplitAI extends GameAI {

    constructor() { super(); }

    starAi() {

    }

    stopAi() {

    }

    exeAI(monster: Monster): boolean {
        if (monster.sysBullet.bulletType == AttackType.SPLIT) {

            let mRow: number = Math.floor(monster.hbox.cy / GameBG.ww);
            let mCol: number = Math.floor(monster.hbox.cx / GameBG.ww);

            let row1: number;
            let col1: number;

            let row2: number;
            let col2: number;

            row1 = mRow;
            col1 = mCol + 1;

            row2 = mRow + 1;
            col2 = mCol;


            if (mRow <= 10) {
                row1 = 10;
                row2 = 11;
            }
            else if (mRow >= Game.map0.endRowNum) {
                row1 = Game.map0.endRowNum;
                row2 = Game.map0.endRowNum - 1;
            }

            if (mCol <= 1) {
                col1 = 1;
                col2 = 2;
            }
            else if (mCol >= 11) {
                col1 = 11;
                col2 = 10;
            }
            let flag: number = monster.splitTimes + 1;
            let hp: number = monster.gamedata.maxhp / 2;
            let monster1: Monster = Monster.getMonster(monster.sysEnemy.id, col1 * GameBG.ww, row1 * GameBG.ww, 0.5, hp);
            monster1.splitTimes = flag;
            let monster2: Monster = Monster.getMonster(monster.sysEnemy.id, col2 * GameBG.ww, row2 * GameBG.ww, 0.5, hp);
            monster2.splitTimes = flag;
            return true;
        }


    }
    hit(pro: GamePro) {

    }
}