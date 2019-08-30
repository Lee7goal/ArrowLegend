import { ui } from "../../../../ui/layaMaxUI";
import SysChapter from "../../../sys/SysChapter";
import GameEvent from "../../../GameEvent";
export default class WorldCell extends ui.test.worldCellUI {
    constructor() { 
        super(); 
        this.mapBtn.clickHandler = new Laya.Handler(this,this.onClick);
        this.suo.visible = false;
    }

    private onClick():void
    {
        Laya.stage.event(GameEvent.START_BATTLE);
    }

    update(sysChapter:SysChapter):void
    {
        // this.titleTxt.text = sysChapter.name;
    }

}