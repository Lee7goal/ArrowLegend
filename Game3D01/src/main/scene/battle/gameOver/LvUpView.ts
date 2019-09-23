import { ui } from "./../../../../ui/layaMaxUI";
import Session from "../../../Session";
import Game from "../../../../game/Game";
import SysChapter from "../../../sys/SysChapter";
    export default class LvUpView extends ui.test.shengjiUI {
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.rebornBtn.clickHandler = new Laya.Handler(this, this.onCloseView);
    }
    
    private onCloseView(): void {
        this.removeSelf();
        Game.showMain();
    }

    private onDis(): void  {
        this.lvClip.value = "" + Session.homeData.playerLv;
        this.lvLabel.text = "" + Session.homeData.playerLv;
        
        this.lanBox.removeSelf();
        this.ziBox.removeSelf();
        this.coinBox.removeSelf();
        let hh = 780;
        if (Game.showBlueNum > 0)  {
            this.lanzuan.value = "+" + Game.showBlueNum ;
            this.addChild(this.lanBox);
            this.lanBox.x = 216;
            this.lanBox.y = hh;
            hh += 100;
        }
        if (Game.showRedNum > 0)  {
            this.hongzuan.value = "+" + Game.showRedNum;
            this.addChild(this.ziBox);
            this.ziBox.x = 216;
            this.ziBox.y = hh;
            hh += 100;
        }
        if (Game.showCoinsNum > 0)  {
            this.coinClip.value = "+" + Game.showCoinsNum;
            this.deltaCoin.value = "+" + Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
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
