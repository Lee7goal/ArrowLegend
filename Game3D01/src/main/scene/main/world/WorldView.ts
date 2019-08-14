import { ui } from "../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import Game from "../../../../game/Game";
import GameEvent from "./../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
import App from "../../../../core/App";
import Session from "../../../Session";
import SysMap from "../../../sys/SysMap";
    export default class WorldView extends ui.test.worldUI {
    constructor() { 
        super();
        this.height = GameBG.height;
        this.btn_start.clickHandler = new Laya.Handler(this,this.onStart); 

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void{
        let sys:SysChapter = App.tableManager.getDataByNameAndId(SysChapter.NAME,Session.homeData.chapterId);
        this.baioti.text = Session.homeData.chapterId + "." + sys.name;
        this.biaoti2.text = this.baioti.text;
        this.zuigao.text = "最高层数:" + Session.homeData.mapIndex + "/" + SysMap.getTotal(Session.homeData.chapterId);
    }


    private onStart():void
    {
        Laya.stage.event(GameEvent.START_BATTLE);
    }
}