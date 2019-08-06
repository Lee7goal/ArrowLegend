import { ui } from "../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import Game from "../../../../game/Game";
    export default class WorldView extends ui.test.worldUI {
    constructor() { 
        super();
        this.height = GameBG.height;
        this.btn_start.clickHandler = new Laya.Handler(this,this.onStart); 
        this.baioti.text = "拉曼平原";
        this.biaoti2.text = "拉曼平原";
    }

    private onStart():void
    {
        Game.battleLoader.load();
    }
}