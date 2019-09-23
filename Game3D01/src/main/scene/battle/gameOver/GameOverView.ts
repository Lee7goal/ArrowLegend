import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
import LvUpView from "./LvUpView";
import GameEvent from "../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
export default class GameOverView extends ui.test.GameOverUI {
    private maskSpr: Laya.Sprite = new Laya.Sprite();
    constructor() {
        super();
        this.on(Laya.Event.DISPLAY, this, this.onDis);

        this.on(Laya.Event.CLICK, this, this.onCloseView);
    }

    private onCloseView(): void {
        this.removeSelf();
        Game.showMain();
    }

    private _isCom: boolean = false;
    private onDis(): void {
        this._isCom = false;
        this.isTwo = false;
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

        this.cengshu.value = Session.homeData.playerLv + "";
        this.dengji.value = Session.homeData.playerLv + "";


        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    private onNext(): void {
        this.lightView.visible = true;
        setTimeout(() => {
            this.expBox.visible = true;

            let lastLv: number = Session.homeData.playerLv;
            let sys: SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME, lastLv);
            let ww: number = this.expBar.width * Game.battleExp / sys.roleExp;
            ww = Math.max(1, ww);
            this.expBar.scrollRect = new Laya.Rectangle(0, 0, ww, this.expBar.height);

            let vv: number = (Session.homeData.playerExp + Game.battleExp) / sys.roleExp;
            vv = Math.min(1,vv);
            Laya.timer.frameLoop(1, this, this.onLoopExp, [vv]);

            Session.homeData.addPlayerExp(Game.battleExp);
            let newLv: number = Session.homeData.playerLv;
        }, 100);
    }

    private lastWidth: number = 0;
    private isTwo: boolean = false;
    private onLoopExp(vv: number): void {
        this.lastWidth += 5;
        if (this.isTwo) {
            if (this.lastWidth >= this.expBar.width) {
                this.lastWidth = 0;
                this.isTwo = false;
            }
        }
        else {
            if (this.lastWidth >= this.expBar.width * vv) {
                this.lastWidth = this.expBar.width * vv;
                Laya.timer.clear(this, this.onLoopExp);

                let hh = 780;
                setTimeout(() => {
                    this.lingqu.visible = true;
                    if (Game.showBlueNum > 0) {
                        this.addChild(this.lanBox);
                        this.lanzuan.value = "" + Game.showBlueNum;
                        this.lanBox.x = 260;
                        this.lanBox.y = hh;
                        hh += 100;
                    }
                    if (Game.showRedNum > 0) {
                        this.hongzuan.value = "" + Game.showRedNum;
                        this.addChild(this.ziBox);
                        this.ziBox.x = 260;
                        this.ziBox.y = hh;
                        hh += 100;
                    }
                    if (Game.showCoinsNum > 0) {
                        this.coinClip.value = "" + Game.showCoinsNum;
                        this.addChild(this.coinBox);
                        this.coinBox.x = 260;
                        this.coinBox.y = hh;
                        hh += 100;
                    }

                    this.fuhuo.y = hh;
                }, 200);
                setTimeout(() => {
                    this.fuhuo.visible = true;
                    Session.saveData();
                    this._isCom = true;

                    if(this.isTwo)
                    {
                        Laya.stage.event(GameEvent.LV_UP_VIEW);
                    }
                }, 300);
            }
        }
        if (this.lastWidth >= this.expBar.width)  {
            if (!this.isTwo)  {
                this.isTwo = true;
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