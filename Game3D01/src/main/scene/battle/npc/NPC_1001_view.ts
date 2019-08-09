import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
    export default class NPC_1001_view extends ui.test.tianshi_1UI {
    
    constructor() { 
        super(); 
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        this.removeSelf();
        Game.bg.clearNpc();
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}