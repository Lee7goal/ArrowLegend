import { GameAI } from "./GameAI";
import Coin from "../player/Coin";
import Game from "../Game";
import GameHitBox from "../GameHitBox";

export default class CoinsAI extends GameAI {
    constructor() { super(); }
    starAi() {
        this.run_ = true;
    }

    stopAi() {
        this.run_ = false;
    }

    hit(pro: Coin) {
    }


    exeAI(pro: Coin): boolean {
        if (!this.run_) {
            return false;
        }
        var a: number = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
        if(pro.move2D(2 * Math.PI - a))
        {
            // this.stopAi();
            pro.clear();
            this.run_ = false;
        }
        return false;
    }
}