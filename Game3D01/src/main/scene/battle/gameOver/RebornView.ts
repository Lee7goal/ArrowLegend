import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import App from "../../../../core/App";
export default class RebornView extends ui.test.ReborthUI {
    private shape: Laya.Sprite;

    constructor() {
        super();
        this.closeBtn.clickHandler = new Laya.Handler(this, this.onClose);
        this.rebornBtn.clickHandler = new Laya.Handler(this, this.onReborn);

        this.shape = new Laya.Sprite();

        this.on(Laya.Event.DISPLAY, this, this.onDis);
    }


    private _curTime: number;
    private onDis(): void  {
        this.txt.text = "" + Game.rebornTimes;

        this._curTime = 5;
        this.daojishi.text = "" + this._curTime;
        // this.onLoop();
        // this.timerLoop(1, this, this.onLoop);

        Laya.timer.loop(1000,this,this.onLoop2);
    }

    private onLoop2():void
    {
        this._curTime--;
        this.daojishi.text = "" + this._curTime;
        if(this._curTime <= 0)
        {
            Laya.timer.clear(this,this.onLoop2);
        }
    }

    private onLoop(): void  {
        if (this._curTime == 0)  {
            this.clearTimer(this, this.onLoop);
            return;
        }
        this._curTime--;
        console.log("------------", this._curTime);
        this.shape.graphics.clear();
        this.jindu.mask = this.shape;
        this.shape.graphics.drawPie(this.centerBox.x, this.centerBox.y, 81, 90, 90 + (5000 - this._curTime) / 5000 * 360, "#ff0000");
    }

    private onClose(): void  {
        this.removeSelf();
        Game.rebornTimes = 0;
        Laya.stage.event(Game.Event_MAIN_DIE);
    }

    private onReborn(): void  {
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