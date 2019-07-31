import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
    export default class NPC_1002_view extends ui.test.mogui_1UI{
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