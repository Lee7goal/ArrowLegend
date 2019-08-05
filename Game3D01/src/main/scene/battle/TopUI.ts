import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
    export default class TopUI extends ui.test.battleUI {
    
    constructor() { 
        super();

        this.shuzi.value = "" + 1;
        this.jinbishu.value = "" + Game.coinsNum;
        this.setExp();
        Laya.stage.on(Game.Event_COINS,this,this.updateCoins);
    }

    setExp():void
    {
        this.lvBar.scrollRect = new Laya.Rectangle(0,0,this.lvBar.width * 0.6,this.lvBar.height);
    }

    private updateCoins():void
    {
        Game.coinsNum++;
        this.jinbishu.value = "" + Game.coinsNum;
    }
}