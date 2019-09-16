import { GameMove } from "./GameMove";
import Monster from "../player/Monster";
import GameBG from "../GameBG";
import Game from "../Game";
import MoveType from "./MoveType";

export default class JumpMove extends GameMove {
    constructor() { super(); }
    private pro: Monster;


    move2d(n: number, monster: Monster, speed: number): boolean {
        this.pro = monster;
        monster.curLen += speed;
        if (monster.curLen >= monster.moveLen) {
            monster.curLen = monster.moveLen;
            return true;
        }
        var nn = monster.curLen / monster.moveLen;
        var vx = speed * Math.cos(n);
        var vz = speed * Math.sin(n);
        var dy = Math.sin((Math.PI * nn)) * 2;
        monster.sp3d.transform.localPositionY = 0.1 + dy * 2;
        monster.setXY2D(monster.pos2.x + vx, monster.pos2.z + vz);
        if(monster.hbox.x == null || monster.hbox.y == null)
        {
            console.log("跳出问题了");
        }
        return false;
    }
}