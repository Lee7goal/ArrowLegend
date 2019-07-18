import GamePro from "../GamePro";

export abstract class GameMove {
    move2d(n: number, pro: GamePro, speed: number): boolean{return false}
}
