import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
    export default class NPC_1003_view extends ui.test.zhuanpanUI{
        constructor() { 
            super(); 
            this.on(Laya.Event.CLICK,this,this.onClick);
        }
    
        private onClick():void
        {
            this.removeSelf();
            Game.bg.clearNpc();
        }
}