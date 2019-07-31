import Game from "../Game";
import { GameMove } from "./GameMove";
import Monster from "../player/Monster";
import GameHitBox from "../GameHitBox";

export default class MonsterMove extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);
    move2d(n: number, pro: Monster, speed: number): boolean {
        if (pro.gamedata.hp <= 0) {
            return;
        }
        if (pro.moveLen > 0) {
            pro.curLen += speed;
            if (pro.curLen >= pro.moveLen) {
                pro.curLen = pro.moveLen;
                return true;
            }
            var nn = pro.curLen / pro.moveLen;
            var vx = speed * Math.cos(n);
            var vz = speed * Math.sin(n);
            var x0: number = pro.hbox.cx;
            var y0: number = pro.hbox.cy;
            this.future.setVV(x0, y0, vx, vz);
            var hits = Game.map0.Aharr;
            var ebh = Game.map0.chechHit_arr(this.future, hits);
            if (ebh) {
                if (pro.gamedata.bounce <= 0) {
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    pro.setSpeed(0);
                    return false;
                }
                pro.gamedata.bounce--;
                if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, -1 * vx, vz), hits)) {
                    vx = -1 * vx;
                } else if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, vx, -1 * vz), hits)) {
                    vz = -1 * vz;
                } else {
                    return false;
                }
                n = 2 * Math.PI - Math.atan2(vz, vx);
                pro.rotation(n);
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        }
        else {
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
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

            if(!this.Blocking(pro,vx,vz)){
                return false;
            }


            return true;
        }

    }
}