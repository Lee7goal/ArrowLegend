import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import App from "../../../../core/App";
    export default class RebornView extends ui.test.ReborthUI {
    constructor() { super(); 
        this.closeBtn.clickHandler = new Laya.Handler(this,this.onClose);
        this.rebornBtn.clickHandler = new Laya.Handler(this,this.onReborn);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.txt.text = "" + Game.rebornTimes;
    }

    private onClose():void
    {
        this.removeSelf();
        Game.showMain();
    }

    private onReborn():void
    {
        this.removeSelf();
        Game.hero.reborn();
        // let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
        // new BP().onShare();
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}