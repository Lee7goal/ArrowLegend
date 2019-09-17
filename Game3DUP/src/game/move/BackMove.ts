import Game from "../Game";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove"
import MaoLineData from "../MaoLineData";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";

/***碰到东西反弹 */
export default class BackMove extends GameMove {

    private future:GameHitBox = new GameHitBox(1,1);

    rotation = Math.PI*-1;

    move2d(n: number, pro: GamePro, speed: number): boolean {
        if (pro.gamedata.hp <= 0) {
            return;
        }
        this.rotation = n;        
        var vx: number = Math.cos(n) * speed;
        var vz: number = Math.sin(n) * speed;

        var hits = Game.map0.Wharr;
        this.future.setXY(pro.hbox.x + vx,pro.hbox.y + vz);
        if (Game.map0.chechHit_arr(this.future,hits)) {

            this.future.setXY(pro.hbox.x + vx,pro.hbox.y);
            var ex = Game.map0.chechHit_arr(this.future,hits);
            //var ex = Game.map0.chechHit(pro, vx, 0);

            this.future.setXY(pro.hbox.x,pro.hbox.y + vz);
            var ez = Game.map0.chechHit_arr(this.future,hits);
            //var ez = Game.map0.chechHit(pro, 0, vz);

            if (ex!=null) {
                vx = vx*-1;                
            }
            else if (ez!=null) {
                vz = vz*-1;
            }
            this.future.setXY(pro.hbox.x + vx,pro.hbox.y + vz);
            if( Game.map0.chechHit_arr(this.future,hits) ){
                   vx = vx*-1;
                   vz = vz*-1;
            }

            // else{
            //     vx = vx*-1;
            //     vz = vz*-1;
            // }
            this.rotation = Math.atan2(vz,vx);
            //pro.rotation( Math.);
        }
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        return true;
    }
}
