import GamePro from "../GamePro";
import { GameAI } from "./GameAI";

export default class MonsterBulletAI extends GameAI {
    private pro: GamePro;
    constructor(pro: GamePro) {
        super();
        this.pro = pro;

    }

    hit(pro: GamePro) {
        // this.i = 25;
        // this.pro.sp3d.transform.localPositionX -= pro.sp3d.transform.localPositionX;
        // this.pro.sp3d.transform.localPositionZ -= pro.sp3d.transform.localPositionZ;
        // this.pro.sp3d.transform.localRotationEulerY -= pro.sp3d.transform.localRotationEulerY;
        // pro.sp3d.addChild(this.pro.sp3d);

        // this.pro.stopAi();
        // if (this.pro.sp3d.parent) {
        //     this.pro.sp3d.parent.removeChild(this.pro.sp3d);
        // }
    }

    private i: number = 0;
    exeAI(pro: GamePro): boolean {
        if (!pro.move2D(pro.face2d))  {
            pro.die();
            return false;
        }
        // if (this.i == 0 && !pro.move2D(pro.face2d)) {
        //     this.i = 1;
        //     return false;
        // }

        // if (this.i > 0) {
        //     this.i++;
        //     if (this.i > 30) {
        //         pro.stopAi();
        //         if (pro.sp3d.parent) {
        //             pro.sp3d.parent.removeChild(pro.sp3d);
        //             // Game.HeroArrows.push(pro);
        //             this.pro.stopAi();
        //         }
        //     }
        // }

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
    }
}