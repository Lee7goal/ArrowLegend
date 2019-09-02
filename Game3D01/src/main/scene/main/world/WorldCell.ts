import { ui } from "../../../../ui/layaMaxUI";
import SysChapter from "../../../sys/SysChapter";
import GameEvent from "../../../GameEvent";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import FlyUpTips from "../../../FlyUpTips";
import SysMap from "../../../sys/SysMap";
export default class WorldCell extends ui.test.worldCellUI {
    constructor() { 
        super(); 
        this.mapBtn.clickHandler = new Laya.Handler(this,this.onClick);
        this.suo.visible = false;
        
    }

    private onClick():void
    {
        if(!this.suo.visible)
        {
            Laya.stage.event(GameEvent.START_BATTLE);
        }
        else
        {
            FlyUpTips.setTips("未开启");
        }
    }

    update(sysChapter:SysChapter):void
    {
        this.suo.visible = Session.homeData.chapterId < sysChapter.id;
        this.mapBtn.gray = this.suo.visible;
        this.cengshuTxt.text = "";
        if(!this.suo.visible)
        {
            let maxCeng:number =  SysMap.getTotal(Session.homeData.chapterId);
            if(sysChapter.id == Session.homeData.chapterId)
            {
                this.cengshuTxt.text = "最高层数:" + Session.homeData.mapIndex + "/" + maxCeng;
            }
            else
            {
                this.cengshuTxt.text = "最高层数:" + maxCeng + "/" + maxCeng;
            }
        }
    }

}