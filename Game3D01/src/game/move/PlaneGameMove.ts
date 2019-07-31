import Game from "../Game";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";

export default class PlaneGameMove extends GameMove {
    move2d(n: number, pro: GamePro, speed: number): boolean {
        if (pro.gamedata.hp <= 0) {
            return;
        }
        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        if (Game.map0.chechHit(pro, vx, vz)) {
            if (vz != 0 && Game.map0.chechHit(pro, vx, 0)) {
                vx = 0;
                vz = (vz < 0 ? -1 : 1) * pro.speed;
            }
            if (vx != 0 && Game.map0.chechHit(pro, 0, vz)) {
                vz = 0;
                vx = (vx < 0 ? -1 : 1) * pro.speed;
            }
            if (Game.map0.chechHit(pro, vx, vz)) {
                return false;
            }
        }

        if(!this.Blocking(pro,vx,vz)){
            return false;
        }


        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        return true;
    }
}