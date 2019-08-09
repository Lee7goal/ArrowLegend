import Game from "../Game";
import GameProType from "../GameProType";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";
import MaoLineData from "../MaoLineData";
import GameBG from "../GameBG";

export default class ArrowRoateMove extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);
    private angle: number = 0;
    private zhuanLine: MaoLineData = new MaoLineData(0, 0, GameBG.ww * 3, 0);
    private cd: number = 0;
    public move2d(n: number, pro: GamePro, speed: number): boolean {

        this.angle += 5;
        if (this.angle > 360)  {
            this.angle = 0;
        }
        let hudu: number = this.angle / 180 * Math.PI;
        this.zhuanLine.rad(n + hudu);
        pro.setXY2D(Game.hero.pos2.x + this.zhuanLine.x_len, Game.hero.pos2.z + this.zhuanLine.y_len);

        if (Game.executor.getWorldNow() > this.cd)  {
            var ebh: GameHitBox = Game.map0.chechHit_arr(pro.hbox, Game.map0.Eharr);

            if (ebh) {
                if (ebh.linkPro_) {
                    ebh.linkPro_.event(Game.Event_Hit, pro);
                    pro.event(Game.Event_Hit, ebh.linkPro_);
                    this.cd = Game.executor.getWorldNow() + 1000;
                }
            }
        }
        return true;
    }
}

