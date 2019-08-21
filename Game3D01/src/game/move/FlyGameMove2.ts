import Game from "../Game";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove"

/**碰上墙后飞起来 */
export default class FlyGameMove2 extends GameMove {

    //private future:GameHitBox = new GameHitBox(2,2);

    move2d(n: number, pro: GamePro, speed: number): boolean {
        if (pro.gamedata.hp <= 0) {
            return;
        }

        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);

        var hits = Game.map0.Flyharr;

        if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
            if (vz != 0 && Game.map0.chechHitArrs(pro, vx, 0, hits)) {
                vx = 0;
                //vz = (vz<0?-1:1) * pro.speed;
            }
            if (vx != 0 && Game.map0.chechHitArrs(pro, 0, vz, hits)) {
                vz = 0;
                //vx = (vx<0?-1:1) * pro.speed;
            }
            if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                return false;
            }
        }

        pro.sp3d.transform.localPositionY = 0;
        var hits = Game.map0.Wharr;

        if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
            pro.sp3d.transform.localPositionY = 1;
        }

        if(!this.Blocking(pro,vx,vz)){
            return false;
        }


        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        return true;
    }
}
