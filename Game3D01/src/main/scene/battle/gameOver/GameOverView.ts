import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
export default class GameOverView extends ui.test.GameOverUI {
    private maskSpr: Laya.Sprite = new Laya.Sprite();
    private lvupView: LvUpView;
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);

        // this.on(Laya.Event.CLICK, this, this.onCloseView);
    }

    private onCloseView(): void {
        this.lvupView && this.lvupView.removeSelf();
        this.removeSelf();
        Game.showMain();
    }

    private onDis(): void {
        this.lanBox.removeSelf();
        this.ziBox.removeSelf();
        this.coinBox.removeSelf();
        this.lightView.visible = false;
        this.topBox.visible = false;
        this.expBox.visible = false;
        this.lingqu.visible = false;
        this.fuhuo.visible = false;

        this.topBox.visible = true;
        this.topBox.scale(2.5, 2.5);
        Laya.Tween.to(this.topBox, { scaleX: 1, scaleY: 1 }, 200, null, new Laya.Handler(this, this.onNext));


        this.coinClip.value = "" + Game.battleCoins;

        this.cengshu.value = Session.homeData.level + "";
        this.dengji.value = Session.homeData.level + "";

        Game.addCoins = Game.battleCoins;
        Session.saveData();
        Game.addCoins = 0;
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    private onNext(): void {
        this.lightView.visible = true;
        setTimeout(() => {
            this.expBox.visible = true;

            let lastLv: number = Session.homeData.level;
            let sys: SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME, lastLv);
            let ww: number = this.expBar.width * Game.battleExp / sys.roleExp;
            ww = Math.max(1, ww);
            this.expBar.scrollRect = new Laya.Rectangle(0, 0, ww, this.expBar.height);

            let vv: number = Session.homeData.playerExp / sys.roleExp;
            Laya.timer.frameLoop(1, this, this.onLoopExp, [vv]);

            Session.homeData.addPlayerExp(Game.battleExp);

            if (lastLv != Session.homeData.level)  {
                if (this.lvupView == null)  {
                    this.lvupView = new LvUpView();
                    this.lvupView.clickHandler = new Laya.Handler(this, this.onCloseView);
                }
                this.addChild(this.lvupView);
            }
        }, 100);
        let hh = 866;
        setTimeout(() => {
            this.lingqu.visible = true;
            if (Game.battleCoins > 0)  {
                this.addChild(this.lanBox);
                this.lanBox.x = 260;
                this.lanBox.y = hh;
                hh += 100;
            }
            if (Game.battleCoins > 0)  {
                this.addChild(this.ziBox);
                this.ziBox.x = 260;
                this.ziBox.y = hh;
                hh += 100;
            }
            if (Game.battleCoins > 0)  {
                this.addChild(this.coinBox);
                this.coinBox.x = 260;
                this.coinBox.y = hh;
                hh += 100;
            }

            this.fuhuo.y = hh;
        }, 200);
        setTimeout(() => {
            this.fuhuo.visible = true;
        }, 300);
    }

    private lastWidth: number = 0;
    private isTwo: boolean = false;
    private onLoopExp(vv: number): void  {
        this.lastWidth += 15;
        if (this.isTwo)  {
            if (this.lastWidth >= this.expBar.width)  {
                this.lastWidth = 0;
                this.isTwo = false;
            }
        }
        else  {
            if (this.lastWidth >= this.expBar.width * vv)  {
                this.lastWidth = this.expBar.width * vv;
                Laya.timer.clear(this, this.onLoopExp);
            }
        }
        this.lastWidth = Math.max(1, this.lastWidth);
        this.maskSpr.graphics.clear();
        this.maskSpr.graphics.drawRect(0, 0, this.lastWidth, this.expBar.height, "#fff000");
        this.expBar.mask = this.maskSpr;
    }

    private onLoop(): void {
        this.lightView.rotation++;
    }

    removeSelf(): Laya.Node {
        Laya.timer.clear(this, this.onLoop);
        Game.state = 0;
        return super.removeSelf();
    }
}

export class LvUpView extends ui.test.shengjiUI {
    clickHandler: Laya.Handler;
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
        this.rebornBtn.clickHandler = new Laya.Handler(this, this.onHide);
    }

    private onHide(): void  {
        this.clickHandler && this.clickHandler.run();
    }

    private onDis(): void  {
        this.lvClip.value = "" + Session.homeData.level;
        this.lvLabel.text = "" + Session.homeData.level;
        this.coinClip.value = "+" + Game.battleCoins;
        this.lanBox.removeSelf();
        this.ziBox.removeSelf();
        this.coinBox.removeSelf();
        let hh = 780;
        if (Game.battleCoins > 0)  {
            this.addChild(this.lanBox);
            this.lanBox.x = 216;
            this.lanBox.y = hh;
            hh += 100;
        }
        if (Game.battleCoins > 0)  {
            this.addChild(this.ziBox);
            this.ziBox.x = 216;
            this.ziBox.y = hh;
            hh += 100;
        }
        if (Game.battleCoins > 0)  {
            this.addChild(this.coinBox);
            this.coinBox.x = 216;
            this.coinBox.y = hh;
            hh += 100;
        }

        this.rebornBtn.y = hh;

        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    private onUndis(): void  {
        Laya.timer.clear(this, this.onLoop);
    }

    private onLoop(): void {
        this.lightView.rotation++;
    }
}
