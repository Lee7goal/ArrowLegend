import { ui } from "./../../../../ui/layaMaxUI";
import Session from "../../../Session";
import Game from "../../../../game/Game";
import SysChapter from "../../../sys/SysChapter";
    export default class LvUpView extends ui.test.shengjiUI {
    clickHandler: Laya.Handler;
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.rebornBtn.clickHandler = new Laya.Handler(this, this.onHide);
    }

    private onHide(): void  {
        this.clickHandler && this.clickHandler.run();
    }

    private onDis(): void  {
        this.lvClip.value = "" + Session.homeData.level;
        this.lvLabel.text = "" + Session.homeData.level;
        
        this.lanBox.removeSelf();
        this.ziBox.removeSelf();
        this.coinBox.removeSelf();
        let hh = 780;
        if (SysChapter.blueNum > 0)  {
            this.lanzuan.value = "" + SysChapter.blueNum;
            this.addChild(this.lanBox);
            this.lanBox.x = 216;
            this.lanBox.y = hh;
            hh += 100;
        }
        if (SysChapter.redNum > 0)  {
            this.hongzuan.value = "" + SysChapter.redNum;
            this.addChild(this.ziBox);
            this.ziBox.x = 216;
            this.ziBox.y = hh;
            hh += 100;
        }
        if (Game.battleCoins > 0)  {
            this.coinClip.value = "+" + Game.battleCoins;
            this.addChild(this.coinBox);
            this.coinBox.x = 216;
            this.coinBox.y = hh;
            hh += 100;
        }

        this.rebornBtn.y = hh;

        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    removeSelf(): Laya.Node {
        Laya.timer.clear(this, this.onLoop);
        Game.state = 0;
        return super.removeSelf();
    }

    private onLoop(): void {
        this.lightView.rotation++;
    }
}
