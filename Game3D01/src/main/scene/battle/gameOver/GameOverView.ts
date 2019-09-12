import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
export default class GameOverView extends ui.test.GameOverUI {
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDis);

        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void{
        this.removeSelf();
        Game.showMain();
    }

    private onDis():void
    {
        this.jinbishu.value = "" + Game.battleCoins;

        let lastLv:number = Session.homeData.level;
        let sys:SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME,lastLv);
        let ww:number = this.expBar.width * Game.battleExp / sys.roleExp;
        ww = Math.max(1,ww);
        this.expBar.scrollRect = new Laya.Rectangle(0,0,ww,this.expBar.height);

        this.cengshu.value = Session.homeData.level + "";
        this.dengji.value = Session.homeData.level + "";

        Session.homeData.addPlayerExp(Game.battleExp);

        

        Game.addCoins = Game.battleCoins;
        Session.saveData();
        Game.addCoins = 0;
        Laya.timer.frameLoop(1,this,this.onLoop);
    }

    private onLoop():void
    {
        this.lightView.rotation++;
    }

    removeSelf():Laya.Node
    {
        Laya.timer.clear(this,this.onLoop);
        Game.state = 0;
        return super.removeSelf();
    }
}


