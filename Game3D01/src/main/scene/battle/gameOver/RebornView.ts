import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import App from "../../../../core/App";
import { AD_TYPE } from "../../../../ADType";
import CookieKey from "../../../../gameCookie/CookieKey";
export default class RebornView extends ui.test.ReborthUI {
    private shape: Laya.Sprite;

    constructor() {
        super();
        this.closeBtn.clickHandler = new Laya.Handler(this, this.onClose);
        this.fuhuo.clickHandler = new Laya.Handler(this,this.onFuhuo);
        App.sdkManager.initAdBtn(this.fuhuo,AD_TYPE.AD_REBORTH);
        this.shape = new Laya.Sprite();

        this.on(Laya.Event.DISPLAY, this, this.onDis);
    }

    private onFuhuo():void
    {
        Laya.timer.clear(this,this.onLoop2);
        App.sdkManager.playAdVideo(AD_TYPE.AD_REBORTH,new Laya.Handler(this,this.onReborn));
    }


    private _curTime: number;
    private onDis(): void  {
        this.txt.text = "" + Game.rebornTimes;

        this._curTime = 5;
        this.daojishi.text = "" + this._curTime;

        Laya.timer.loop(1000,this,this.onLoop2);
    }

    private onLoop2():void
    {
        this._curTime--;
        this.daojishi.text = "" + this._curTime;
        if(this._curTime <= 0)
        {
            Laya.timer.clear(this,this.onLoop2);
            this.onClose();
        }
    }
    
    private onClose(): void  {
        Laya.timer.clear(this,this.onLoop2);
        Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        this.removeSelf();
        Game.rebornTimes = 0;
        Laya.stage.event(Game.Event_MAIN_DIE);
    }

    private onReborn(): void  {
        Laya.timer.clear(this,this.onLoop2);
        this.removeSelf();
        Game.hero.reborn();
        // let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
        // new BP().onShare();
    }

    removeSelf(): Laya.Node  {
        Game.state = 0;
        return super.removeSelf();
    }
}