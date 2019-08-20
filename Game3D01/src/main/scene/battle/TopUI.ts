import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SysLevel from "../../sys/SysLevel";
import DisplayUtils, { MaskObj } from "../../../core/utils/DisplayUtils";
import App from "../../../core/App";
    export default class TopUI extends ui.test.battleUI {
    
    constructor() { 
        super();
        Laya.stage.on(Game.Event_COINS,this,this.updateCoins);
        Laya.stage.on(Game.Event_EXP,this,this.updateExp);

        this.y = App.top;
    }

    private lastWidth:number = 0;
    private isTwo:boolean = false;
    updateExp():void
    {
        let lv:number = SysLevel.getLv(Game.hero.playerData.exp);
        let maxExp: number = SysLevel.getMaxExpByLv(lv);
        let curExpSum: number = SysLevel.getExpSum(lv - 1);
        let curExp: number = Game.hero.playerData.exp - curExpSum;
        let vv = curExp / maxExp;

        this.isTwo = lv > Game.hero.playerData.level;
        Laya.timer.frameLoop(1,this,this.onLoop,[vv]);

        Game.hero.playerData.level = lv;
        if(!this.isTwo)
        {
            this.shuzi.value = "" + Game.hero.playerData.level;
        }
        

        // let ww:number = this.lvBar.width * curExp / maxExp;
        // ww = Math.max(ww,1);
        // this.lastWidth = ww;
        
    }

    private onLoop(vv:number):void
    {
        this.lastWidth += 15;
        if(this.isTwo)
        {
            if(this.lastWidth >= this.lvBar.width)
            {
                this.lastWidth = 0;
                this.isTwo = false;
                this.shuzi.value = "" + Game.hero.playerData.level;
            }
        }
        else
        {
            if(this.lastWidth >= this.lvBar.width * vv)
            {
                this.lastWidth = this.lvBar.width * vv;
                Laya.timer.clear(this,this.onLoop);
            }
        }
        this.lastWidth = Math.max(1,this.lastWidth);
        this.lvBar.scrollRect = new Laya.Rectangle(0,0,this.lastWidth,this.lvBar.height);
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