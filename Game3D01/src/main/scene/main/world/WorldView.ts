import { ui } from "../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
    export default class WorldView extends ui.test.worldUI {
    constructor() { 
        super();
        this.height = GameBG.height;
        this.btn_start.clickHandler = new Laya.Handler(this,this.onStart); 
    }

    private onStart():void
    {
        Laya.Scene.open("test/TestScene.scene");
    }
}