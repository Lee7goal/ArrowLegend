import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SysLevel from "../../sys/SysLevel";
    export default class TopUI extends ui.test.battleUI {
    
    constructor() { 
        super();
        Laya.stage.on(Game.Event_COINS,this,this.updateCoins);
        Laya.stage.on(Game.Event_EXP,this,this.updateExp);
    }

    updateExp():void
    {
        let lv:number = SysLevel.getLv(Game.hero.playerData.exp);
        Game.hero.playerData.level = lv;
        let maxExp: number = SysLevel.getMaxExpByLv(lv);
        let curExpSum: number = SysLevel.getExpSum(lv - 1);
        let curExp: number = Game.hero.playerData.exp - curExpSum;
        let ww:number = this.lvBar.width * curExp / maxExp;
        ww = Math.max(ww,1);
        this.lvBar.scrollRect = new Laya.Rectangle(0,0,ww,this.lvBar.height);
        this.shuzi.value = "" + lv;
    }

    updateCoins():void
    {
        this.jinbishu.value = "" + Game.coinsNum;
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}