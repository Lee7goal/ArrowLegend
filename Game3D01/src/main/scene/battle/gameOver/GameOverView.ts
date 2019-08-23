import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
export default class GameOverView extends ui.test.GameOverUI {
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.bg.ani1.on(Laya.Event.COMPLETE, this, this.onCom);

        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void{
        this.removeSelf();
        Game.showMain();
    }

    private onDis():void
    {
        Game.addCoins = Game.battleCoins;
        this.info.visible = false;
        this.bg.ani1.play(0,false);

        this.info.cengshu.value = "" + Game.battleLoader.index;

        Session.saveData();
        Game.addCoins = 0;
    }

    private onCom(): void  {
        this.bg.ani1.stop();
        this.info.visible = true;
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}


