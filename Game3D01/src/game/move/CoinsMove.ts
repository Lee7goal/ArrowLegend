import { GameMove } from "./GameMove";
import GamePro from "../GamePro";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameBG from "../GameBG";

export default class CoinsMove extends GameMove {
    
    constructor() { super(); }

    move2d(n: number, pro: GamePro, speed: number): boolean {
        if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            return true;
        }
        var vx: number = Math.cos(n) * speed;
        var vz: number = Math.sin(n) * speed;
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        return false;
    }
}