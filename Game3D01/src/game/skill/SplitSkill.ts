import { BaseSkill } from "./BaseSkill";
import GamePro from "../GamePro";
import Game from "../Game";
import GameBG from "../GameBG";
import SysSkill from "../../main/sys/SysSkill";
import App from "../../core/App";
import SkillType from "./SkillType";

export default class SplitSkill extends BaseSkill {

    private isExe: boolean = false;
    exeSkill(monster: GamePro): void {
        // if(this.isExe)
        // {
        //     return;
        // }
        // this.isExe = true;

        if (monster.sysEnemy.skillId > 0)  {
            let sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, monster.sysEnemy.skillId);
            if (sysSkill.effectType == SkillType.SPLIT)  {
                if (monster.splitTimes >= sysSkill.effect1)  {
                    return;
                }
            }
        }

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


        if (mRow <= 10)  {
            row1 = 10;
            row2 = 11;
        }
        else if (mRow >= Game.map0.endRowNum)  {
            row1 = Game.map0.endRowNum;
            row2 = Game.map0.endRowNum - 1;
        }

        if (mCol <= 1)  {
            col1 = 1;
            col2 = 2;
        }
        else if (mCol >= 11)  {
            col1 = 11;
            col2 = 10;
        }
        let flag: number = monster.splitTimes + 1;
        let hp: number = monster.gamedata.maxhp / 2;
        let monster1: GamePro = Game.getMonster(monster.sysEnemy.id, col1 * GameBG.ww, row1 * GameBG.ww, 0.5, hp);
        monster1.splitTimes = flag;
        let monster2: GamePro = Game.getMonster(monster.sysEnemy.id, col2 * GameBG.ww, row2 * GameBG.ww, 0.5, hp);
        monster2.splitTimes = flag;
        // Game.e0_ = monster2;
    }
}