import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import Monster from "./Monster";
import { ui } from "./../../ui/layaMaxUI";
import FootRotateScript from "../controllerScript/FootRotateScript";
import GameBG from "../GameBG";

export default class Coin extends GamePro {
    constructor() {
        super(0, 0);

        var sp: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/coins/monster.lh"));
        Game.monsterResClones.push(sp);
        this.setSp3d(sp);
        // sp.transform.localRotationEulerY = 45;
        this.sp3d.addComponent(FootRotateScript);
        Game.layer3d.addChild(sp);
    }

    public setPos(monster:Monster):void
    {
        this.setXY2DBox(monster.hbox.cx, monster.hbox.cy);
        this.sp3d.transform.localPositionY = 1;
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
        Laya.Tween.to(this.sp3d.transform,{localPositionX:Game.hero.sp3d.transform.localPositionX,localPositionZ:Game.hero.sp3d.transform.localPositionZ},500,Laya.Ease.circOut,new Laya.Handler(this,this.onFlyCom));
    }

    private onFlyCom():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.stage.event(Game.Event_COINS);
    }
}