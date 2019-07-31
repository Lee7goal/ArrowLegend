import Game from "../Game";
import GamePro from "../GamePro";
import { GameAI } from "./GameAI";
import HeroBullet from "../player/HeroBullet";
import MaoLineData from "../MaoLineData";
import GameBG from "../GameBG";

export default class HeroArrowAI0 extends GameAI {

    private pro: GamePro;

    constructor(pro: GamePro) {
        super();
        this.pro = pro;
    }

    hit(pro: HeroBullet) {
        // this.i = 25;
        //this.pro.sp3d.transform.localPositionX -= pro.sp3d.transform.localPositionX;
        //this.pro.sp3d.transform.localPositionZ -= pro.sp3d.transform.localPositionZ;
        //this.pro.sp3d.transform.localRotationEulerY -= pro.sp3d.transform.localRotationEulerY;
        //pro.sp3d.addChild(this.pro.sp3d);
        this.pro.die();
    }

    
    private i: number = 0;
    exeAI(pro: HeroBullet): boolean {

        var box = this.pro.hbox;
       
        //Game.map0.addChild( this.pro.sp2d );

        if (this.i == 0 && !pro.move2D(pro.face2d)) {
            this.i = 1;
            return false;
        }

        // this.pro.die();
        // if (this.i > 0) {
        //     this.i++;
        //     if (this.i > 30) {
            
        //     }
        // }
        return false;

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
        //this.trail_on();
    }
}
