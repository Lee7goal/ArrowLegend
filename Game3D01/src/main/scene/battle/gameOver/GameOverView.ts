import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
export default class GameOverView extends ui.test.GameOverUI {
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDis);

        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void{
        this.removeSelf();
        Game.showMain();
    }

    private onDis():void
    {
        Game.addCoins = Game.battleCoins;
        Session.saveData();
        Game.addCoins = 0;
        Laya.timer.frameLoop(1,this,this.onLoop);
    }

    private onLoop():void
    {
        this.lightView.rotation++;
    }

    removeSelf():Laya.Node
    {
        Laya.timer.clear(this,this.onLoop);
        Game.state = 0;
        return super.removeSelf();
    }
}


