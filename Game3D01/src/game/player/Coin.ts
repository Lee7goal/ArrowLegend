import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import Monster from "./Monster";
import { ui } from "./../../ui/layaMaxUI";
import FootRotateScript from "../controllerScript/FootRotateScript";
import GameBG from "../GameBG";
import CoinsAI from "../ai/CoinsAI";
import CoinsMove from "../move/CoinsMove";
import GameHitBox from "../GameHitBox";
import SysChapter from "../../main/sys/SysChapter";
import Session from "../../main/Session";
import SysItem from "../../main/sys/SysItem";
import App from "../../core/App";

export default class Coin extends GamePro {
    static TYPE_COIN:number = 1001;
    static TYPE_BLUE:number = 1002;
    static TYPE_RED:number = 1003;
    static TYPE_HEART:number = 1004;

    static TAG: string = "Coin";

    static tScale = new Laya.Vector3(1.5, 1.5, 1.5);
    static tScale2 = new Laya.Vector3(0.5, 0.5, 0.5);

    curLen: number = 0;
    moveLen: number = 0;
    status: number = 0;

    id: number;

    constructor() {
        super(0, 1);
        this.setSpeed(0);

        this.setGameAi(new CoinsAI());
        this.setGameMove(new CoinsMove());

        // this.startAi();

        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow)
        this.setShadowSize(20);
    }

    static getOne(id: number): Coin {
        let coin: Coin = Laya.Pool.getItemByClass(Coin.TAG + id, Coin);
        coin.id = id;
        if (!coin.sp3d)  {
            var sp: Laya.Sprite3D;
            sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/coins/"+id+"/monster.lh"));
            coin.setSp3d(sp);
            if (id == Coin.TYPE_COIN)  {
                
                coin.sp3d.transform.localScale = Coin.tScale;
            }
            else
            {
                coin.sp3d.transform.localScale = Coin.tScale2;
            }
            if (sp)  {
                coin.sp3d.addComponent(FootRotateScript);
            }
        }
        return coin;
    }

    public setPos(monster: GamePro, r: number, id: number): void  {
        this.status = 1;
        this.curLen = 0;
        if (id == Coin.TYPE_COIN)  {
            this.moveLen = 20 + Math.random() * GameBG.ww;
        }
        else if(id == Coin.TYPE_HEART)
        {
            this.moveLen =  Math.random() * GameBG.ww;
        }
        else  {
            this.moveLen = 50 + Math.random() * GameBG.ww;
        }

        this.setXY2D(monster.pos2.x, monster.pos2.z);
        this.setSpeed(2);
        this.rotation(r);
        this.startAi();
        Game.layer3d.addChild(this.sp3d);
        Game.footLayer.addChild(this._bulletShadow)
    }

    updateUI(): void {
        super.updateUI();
        this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy + 10);
    }

    private onCom(): void  {
        this.setShadowSize(20);
        let xx: number = GameBG.ww * this.sp3d.transform.localPositionX;
        let yy: number = GameBG.ww * this.sp3d.transform.localPositionZ * Game.cameraCN.cos0;
        this.setXY2D(xx, yy);
        this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy);
    }

    fly(): void  {
        var a: number = GameHitBox.faceTo3D(this.hbox, Game.hero.hbox);
        this.rotation(a);
        this.status = 2;
        this.curLen = 0;
        this.moveLen = 0;
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.setSpeed(GameBG.ww * 0.5);
    }

    public clear(): void  {
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.stopAi();
        this.sp3d && this.sp3d.removeSelf();
        if(this.id == Coin.TYPE_COIN)
        {
            Game.showCoinsNum++;
            Laya.stage.event(Game.Event_COINS);
        }
        else if(this.id == Coin.TYPE_BLUE)
        {
            Game.showBlueNum++;
            SysChapter.blueNum--;
        }
        else if(this.id == Coin.TYPE_RED)
        {
            Game.showRedNum++;
            SysChapter.redNum--;
        }
        else if(this.id == Coin.TYPE_HEART)
        {
            let sys:SysItem = App.tableManager.getDataByNameAndId(SysItem.NAME,Coin.TYPE_HEART);
            let addValue:number = sys.addHp + Session.talentData.addItemhp;
            Game.hero.addBlood(addValue);
            console.log("红心恢复血量",200,Session.talentData.addItemhp);
            SysChapter.heartNum--;
        }
        this.curLen = 0;
        this.moveLen = 0;
        this.status = 0;

        if(SysChapter.blueNum <= 0 && SysChapter.redNum <= 0)
        {
            SysChapter.dropIndex = -1;
        }

        if(SysChapter.heartNum <= 0)
        {
            SysChapter.heartIndex = -1;
        }

        Laya.Pool.recover(Coin.TAG, this);
    }
}