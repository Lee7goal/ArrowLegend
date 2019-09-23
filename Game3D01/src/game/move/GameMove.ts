import GamePro from "../GamePro";
import Game from "../Game";

export abstract class GameMove {

    move2d(n: number, pro: GamePro, speed: number,hitStop:boolean): boolean{return false}

    Blocking(pro:GamePro,vx:number,vz:number):boolean{
        // if(!pro.unBlocking){
        //     var hits = Game.map0.Eharr;
        //     if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
        //         return false;
        //     }
        // }
        return true;
    }
}
