import { ui } from "../../../../ui/layaMaxUI";
import SysChapter from "../../../sys/SysChapter";
import GameEvent from "../../../GameEvent";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import FlyUpTips from "../../../FlyUpTips";
import SysMap from "../../../sys/SysMap";
export default class WorldCell extends ui.test.worldCellUI {
    private sys:SysChapter;
    constructor() { 
        super(); 
        this.mapBtn.clickHandler = new Laya.Handler(this,this.onClick);
        this.suo.visible = false;
        
    }

    private onClick():void
    {
        if(!this.suo.visible)
        {
            Game.battleLoader.chapterId = this.sys.id;
            SysChapter.randomDiamond(Game.battleLoader.chapterId);
            Game.battleCoins = 0;
            Game.battleExp = 0;
            Laya.stage.event(GameEvent.START_BATTLE);
        }
        else
        {
            FlyUpTips.setTips("未开启");
        }
    }

    update(sysChapter:SysChapter):void
    {
        this.sys = sysChapter;
        this.suo.visible = Session.homeData.chapterId < sysChapter.id;
        this.mapBtn.gray = this.suo.visible;
        this.cengshuTxt.text = "";
        if(!this.suo.visible)
        {
            let maxCeng:number =  SysMap.getTotal(this.sys.id);
            if(sysChapter.id == Session.homeData.chapterId)
            {
                this.cengshuTxt.text = "最高层数:" + Session.homeData.mapIndex + "/" + maxCeng;
            }
            else
            {
                this.cengshuTxt.text = "最高层数:" + maxCeng + "/" + maxCeng;
            }
        }
        console.log("刷新大关卡");
    }

}