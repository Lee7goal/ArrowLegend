import { ui } from "../../../../ui/layaMaxUI";
import AcheievementCell from "./AcheievementCell";
    export default class AchievementsView extends ui.test.chengjiuUI {
        private list:Laya.List;
    constructor() { 
        super(); 
        this.list = new Laya.List();
        this.list.pos(this.listBox.x,this.listBox.y);
        this.addChild(this.list);
        this.list.itemRender = AcheievementCell;
        this.list.repeatX = 1;
        this.list.repeatY = 4;
        this.list.vScrollBarSkin = "";
        // this.list.selectEnable = true;
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.list.array = [,,,,,,,];
    }

    private updateItem():void{

    }
}