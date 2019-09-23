import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import Session from "../../../Session";
import SysHero from "../../../sys/SysHero";
import App from "../../../../core/App";
import LvUpView from "./LvUpView";
import GameEvent from "../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
import { AD_TYPE } from "../../../../ADType";
import { GoldType } from "../../../../game/data/HomeData";
export default class GameOverView extends ui.test.GameOverUI {
    private maskSpr: Laya.Sprite = new Laya.Sprite();
    private oldLv: number;
    private newLv: number;
    private newExp: number;
    private isChange: boolean;
    private oldPercent: number;
    private newPercent: number;

    constructor() {
        super();
        App.sdkManager.initAdBtn(this.fuhuo,AD_TYPE.AD_BATTLE10);
        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.on(Laya.Event.CLICK, this, this.onCloseView);

        this.fuhuo.clickHandler = new Laya.Handler(this,this.onReward10);
    }

    private onReward10():void
    {
        App.sdkManager.playAdVideo(AD_TYPE.AD_BATTLE10,new Laya.Handler(this,this.onRewardSuccess))
    }

    private onRewardSuccess():void
    {
        Game.showCoinsNum = Game.showCoinsNum * 10;
        Game.showBlueNum = Game.showBlueNum * 10;
        Game.showRedNum = Game.showRedNum * 10;
        Session.homeData.setGoldByType(Game.showBlueNum,GoldType.BLUE_DIAMONG);
        Session.homeData.setGoldByType(Game.showRedNum,GoldType.RED_DIAMONG);
        console.log("10倍奖励",Game.showCoinsNum,Game.showBlueNum,Game.showRedNum);
        Session.saveData();
    }

    private onCloseView(): void {
        if (!this._isCom)  {
            return;
        }
        this.removeSelf();
        Game.showMain();
    }

    private _isCom: boolean = false;
    private onDis(): void {
        this.oldLv = Session.homeData.playerLv;
        let sys: SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME, this.oldLv);
        this.oldPercent = Session.homeData.playerExp / sys.roleExp;
        this.oldPercent = Math.min(1, this.oldPercent);
        this.lastWidth = this.expBar.width * this.oldPercent;

        this.setmask();

        let arr: number[] = SysHero.getNewLv(Game.battleExp);
        this.newLv = arr[0];
        this.newExp = arr[1];
        sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.newLv);
        this.newPercent = this.newExp / sys.roleExp;
        this.newPercent = Math.min(1, this.newPercent);

        this._isCom = false;
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

        this.cengshu.value = this.oldLv + "";
        this.dengji.value = this.oldLv + "";


        Laya.timer.frameLoop(1, this, this.onLoop);
    }


    private onNext(): void {
        this.lightView.visible = true;
        this.isChange = false;
        setTimeout(() => {
            this.expBox.visible = true;
            this.updateExp();
        }, 100);
    }

    private updateExp(): void  {
        if (this.newLv == this.oldLv)  {
            Laya.timer.frameLoop(1, this, this.onLoopExp);
        }
        else  {
            Laya.timer.frameLoop(1, this, this.onLoopLv);
        }
    }

    private onLoopLv(): void  {
        this.lastWidth += 5;
        if (this.lastWidth >= this.expBar.width) {
            this.lastWidth = 0;
            this.oldLv++;
            this.cengshu.value = this.oldLv + "";
            this.dengji.value = this.oldLv + "";
            this.isChange = true;

            if (this.oldLv >= this.newLv)  {
                Laya.timer.clear(this, this.onLoopLv);
                Laya.timer.frameLoop(1, this, this.onLoopExp);
            }
        }

        this.setmask();
    }

    private lastWidth: number = 0;
    private onLoopExp(vv: number): void {
        this.lastWidth += 5;
        if (this.lastWidth >= this.expBar.width * this.newPercent) {
            this.lastWidth = this.expBar.width * this.newPercent;
            Laya.timer.clear(this, this.onLoopExp);
            let hh = 780;
            setTimeout(() => {
                this.lingqu.visible = true;
                if (Game.showBlueNum > 0) {
                    this.addChild(this.lanBox);
                    this.lanzuan.value = "+" + Game.showBlueNum;
                    this.lanBox.x = 260;
                    this.lanBox.y = hh;
                    hh += 100;
                }
                if (Game.showRedNum > 0) {
                    this.hongzuan.value = "+" + Game.showRedNum;
                    this.addChild(this.ziBox);
                    this.ziBox.x = 260;
                    this.ziBox.y = hh;
                    hh += 100;
                }
                if (Game.showCoinsNum > 0) {
                    this.coinClip.value = "+" + Game.showCoinsNum;
                    this.deltaCoin.value = "+" + Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
                    this.addChild(this.coinBox);
                    this.coinBox.x = 260;
                    this.coinBox.y = hh;
                    hh += 100;
                }

                this.fuhuo.y = hh;
            }, 200);
            setTimeout(() => {
                this.fuhuo.visible = true;

                Session.homeData.addPlayerExp(Game.battleExp);
                Session.saveData();
                this._isCom = true;

                if (this.isChange)  {
                    Laya.stage.event(GameEvent.LV_UP_VIEW);
                }
            }, 300);
        }
        this.setmask();
    }

    private setmask():void
    {
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