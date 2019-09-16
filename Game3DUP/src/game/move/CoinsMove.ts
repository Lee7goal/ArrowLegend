import { GameMove } from "./GameMove";
import GamePro from "../GamePro";
import GameHitBox from "../GameHitBox";
import Game from "../Game";
import GameBG from "../GameBG";
import Coin from "../player/Coin";

export default class CoinsMove extends GameMove {

    constructor() { super(); }

    move2d(n: number, pro: Coin, speed: number): boolean {
        if (pro.status == 0) {
            
        }
        else if(pro.status == 1)
        {
            var vx: number = Math.cos(n) * speed;
            var vz: number = Math.sin(n) * speed;

            if (pro.curLen >= 0 && pro.moveLen >= 0) {
                pro.curLen += speed;
                if (pro.curLen >= pro.moveLen) {
                    pro.curLen = pro.moveLen;
                }
                var nn = pro.curLen / pro.moveLen;

                var dy = Math.sin((Math.PI * nn)) * 2;
                pro.sp3d.transform.localPositionY = 0.1 + dy;
            }

            if(pro.curLen >= pro.moveLen)
            {
                pro.status = 0;
            }

            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        }
        else if (pro.status == 2) {
            var a: number = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
            pro.rotation(a);
            
            if (speed <= 0) {
                return false;
            }
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) < GameBG.ww2) {
                return true;
            }
            var vx: number = Math.cos(n) * speed;
            var vz: number = Math.sin(n) * speed;

            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        }

        return false;
    }
}