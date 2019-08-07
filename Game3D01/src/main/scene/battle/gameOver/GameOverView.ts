import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
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
        this.info.visible = false;
        this.bg.ani1.play(0,false);

        this.info.cengshu.value = "" + Game.battleLoader.index;
    }

    private onCom(): void  {
        this.bg.ani1.stop();
        this.info.visible = true;
    }
}


