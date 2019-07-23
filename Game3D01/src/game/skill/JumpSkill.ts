import { BaseSkill } from "./BaseSkill";
import Monster from "../player/Monster";
import GameBG from "../GameBG";
import Game from "../Game";

export default class JumpSkill extends BaseSkill {

    constructor() { super(); }

    exeSkill(monster: Monster): void {
        let mRow: number = Math.floor(monster.hbox.cy / GameBG.ww);
        let mCol: number = Math.floor(monster.hbox.cx / GameBG.ww);

        let range: number = 2;

        let minRow = mRow - range;
        minRow = Math.max(minRow, 1);
        let maxRow = mRow + range;
        maxRow = Math.min(maxRow, 12);

        let minCol = mCol - range;
        minCol = Math.max(minCol, 10);
        let maxCol = mCol + range;
        maxCol = Math.min(maxCol, Game.map0.endRowNum);


        var arr: number[][] = [];
        for (let i = minRow; i <= maxRow; i++)  {
            for (let j = minCol; i <= maxCol; j++)  {
                var key: number = Game.map0.info[i + "_" + j];
                if (key && key == 0)  {
                    arr.push([i, j]);
                }
            }
        }

        var toArr: number[] = arr[Math.floor(arr.length * Math.random())];
        monster.setXY2D(toArr[1] * GameBG.ww, toArr[0] * GameBG.ww);

    }
}