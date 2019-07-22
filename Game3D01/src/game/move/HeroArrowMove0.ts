import Game from "../Game";
import GameProType from "../GameProType";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";
import MaoLineData from "../MaoLineData";

export default class HeroArrowMove0 extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);

    private linev:MaoLineData = new MaoLineData(0,0,1,0);
    private line0:MaoLineData = new MaoLineData(0,0,1,0);

    public move2d(n: number, pro: GamePro, speed: number): boolean {
        //pro.rotation(n);
        pro.setSpeed(speed);
        if (pro.speed <= 0) return;

        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        var x0: number = pro.hbox.cx;
        var y0: number = pro.hbox.cy;
        this.future.setVV(x0, y0, vx, vz);

        var ebh: GameHitBox;
        ebh = Game.map0.chechHit_arr(this.future, Game.map0.Eharr);
        if (ebh) {
            this.line0.reset(ebh.x,ebh.y,ebh.x,ebh.hh);


            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            pro.setSpeed(0);
            if (ebh.linkPro_) {
                ebh.linkPro_.event(Game.Event_Hit, pro);
                pro.event(Game.Event_Hit, ebh.linkPro_);
            }
            return false;
        }


        var hits = Game.map0.Aharr;
        ebh = Game.map0.chechHit_arr(this.future, hits);
        if (ebh) {
            if (pro.gamedata.bounce <= 0) {
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                pro.setSpeed(0);
                return false;
            }
            pro.gamedata.bounce--;
            if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, -1 * vx, vz), hits)) {
                vx = -1 * vx;
                //this.fcount++;
            } else if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, vx, -1 * vz), hits)) {
                vz = -1 * vz;
                //this.fcount++;
            } else {
                return false;
            }
            //this.facen2d_ = (2*Math.PI - n);
            n = 2 * Math.PI - Math.atan2(vz, vx);
            pro.rotation(n);
        }
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

        return true;
    }
}

