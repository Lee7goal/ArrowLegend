import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import Monster from "./Monster";
import { ui } from "./../../ui/layaMaxUI";
import FootRotateScript from "../controllerScript/FootRotateScript";
import GameBG from "../GameBG";
import CoinsAI from "../ai/CoinsAI";
import CoinsMove from "../move/CoinsMove";

export default class Coin extends GamePro {
    static TAG:string = "Coin";
    constructor() {
        super(0, 1);

        var sp: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/coins/monster.lh"));
        Game.monsterResClones.push(sp);
        this.setSp3d(sp);
        sp.transform.localScale = new Laya.Vector3(1.5,1.5,1.5);
        // sp.transform.localRotationEulerY = 45;
        this.sp3d.addComponent(FootRotateScript);
        Game.layer3d.addChild(sp);

        this.setSpeed(0);

        this.setGameAi(new CoinsAI());
        this.setGameMove(new CoinsMove());

        this.startAi();
    }

    static getOne():Coin{
        let coin:Coin = Laya.Pool.getItemByClass(Coin.TAG,Coin);
        return coin;
    }

    public setPos(monster:Monster):void
    {
        this.setXY2DBox(monster.hbox.cx, monster.hbox.cy);
        this.sp3d.transform.localPositionY = 0.5;
        let rand:number =  Math.random();
        let deltaX:number = rand > 0.5 ? rand :-rand;

        let rand2:number = Math.random();
        let deltaZ:number = rand2 < 0.5 ? rand2 :-rand2;

        Laya.Tween.to(this.sp3d.transform,{localPositionY:4},300,Laya.Ease.circOut);
        Laya.Tween.to(this.sp3d.transform,{localPositionY:1,localPositionX:this.sp3d.transform.localPositionX + deltaX,localPositionZ:this.sp3d.transform.localPositionZ + deltaZ},300,Laya.Ease.circIn,new Laya.Handler(this,this.onCom),300);
    }

    private onCom():void
    {
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
        this.setShadowSize(20);
        let xx:number = GameBG.ww * this.sp3d.transform.localPositionX;
        let yy:number = GameBG.ww * this.sp3d.transform.localPositionZ * Game.cameraCN.cos0;
        this.setXY2D(xx,yy);
        this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy);
    }

    fly():void
    {
        this._bulletShadow && this._bulletShadow.removeSelf();
        // Laya.Tween.to(this.sp3d.transform,{localPositionX:Game.hero.sp3d.transform.localPositionX,localPositionZ:Game.hero.sp3d.transform.localPositionZ},500,Laya.Ease.circOut,new Laya.Handler(this,this.onFlyCom));

        this.setSpeed(40);
        // this.startAi();
    }

    public clear():void
    {
        this._bulletShadow && this._bulletShadow.removeSelf();
        this.stopAi();
        this.sp3d && this.sp3d.removeSelf();
        Game.coinsNum++;
        Laya.stage.event(Game.Event_COINS);

        Laya.Pool.recover(Coin.TAG,this);
    }
}