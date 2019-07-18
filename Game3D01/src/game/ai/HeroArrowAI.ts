import Game from "../Game";
import GamePro from "../GamePro";
import { GameAI } from "./GameAI";

export default class HeroArrowAI extends GameAI {

    private pro: GamePro;
    // private trail:Laya.TrailSprite3D;
    // private trail_parent:Laya.Sprite3D;

    constructor(pro: GamePro) {
        super();
        this.pro = pro;
        //this.trail = pro.sp3d.getChildByName("Arrow-Blue").getChildByName("Trail") as Laya.TrailSprite3D;            
        //console.log(trail);

    }

    // private trail_off():void{        
    //     if(this.trail.parent){
    //         this.trail_parent = this.trail.parent as Laya.Sprite3D;
    //         this.trail_parent.removeChild(this.trail);
    //     }
    // }

    // private trail_on():void{
    //     if(this.trail.parent){
    //         //this.trail_parent = this.trail.parent;
    //         this.pro.sp3d.getChildByName("Arrow-Blue").addChild(this.trail);
    //     }
    // }

    hit(pro: GamePro) {
        this.i = 25;
        this.pro.sp3d.transform.localPositionX -= pro.sp3d.transform.localPositionX;
        this.pro.sp3d.transform.localPositionZ -= pro.sp3d.transform.localPositionZ;
        this.pro.sp3d.transform.localRotationEulerY -= pro.sp3d.transform.localRotationEulerY;
        pro.sp3d.addChild(this.pro.sp3d);
        //this.trail_off();
    }

    private i: number = 0;
    exeAI(pro: GamePro): boolean {

        if (this.i == 0 && !pro.move2D(pro.face2d)) {
            this.i = 1;
            return false;
        }

        if (this.i > 0) {
            this.i++;
            if (this.i > 30) {
                pro.stopAi();
                if (pro.sp3d.parent) {
                    pro.sp3d.parent.removeChild(pro.sp3d);
                    Game.HeroArrows.push(pro);
                    this.pro.stopAi();
                }
            }
        }

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
        //this.trail_on();
    }
}
