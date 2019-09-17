import GamePro from "../GamePro";
import { GameMove } from "./GameMove";

export default class SimpleGameMove extends GameMove {
    move2d(n: number, pro: GamePro, speed: number): boolean {
        //pro.rotation(n);
        pro.setSpeed(speed);
        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
        return true;
    }
}