import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import GameBG from "../GameBG";
import PlaneGameMove from "../move/PlaneGameMove";
import HeroAI from "../ai/HeroAI";
import { GameAI } from "../ai/GameAI";
import HitEffect from "../effect/HitEffect";

export default class Hero extends GamePro {
    
    constructor() {
        super(GameProType.Hero, 0);
        this.unBlocking = true;
    }

    init(): void  {
        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/hero/hero.lh");
        Game.layer3d.addChild(sp);
        this.setSp3d(sp as Laya.Sprite3D);

        this.play("Idle");
        //Game.map0.addChild(this.sp2d);
        this.setGameMove(new PlaneGameMove());
        this.setGameAi(new HeroAI());
        this.addWeapon();

        this.setXY2DBox(GameBG.ww * 6, (GameBG.arr0.length / 13 - 2) * GameBG.ww);//原先是减1

        this.initBlood(800);
        this.addFootCircle();

        Game.map0.Hharr.push(this.hbox);

        this.startAi();

        this.gamedata.rspeed = 0;
        this.rotation(90 / 180 * Math.PI);
        this.sp3d.transform.localPositionY = 15;
        Laya.Tween.to(this.sp3d.transform, { localPositionY: 0 }, 600, Laya.Ease.strongIn, new Laya.Handler(this, this.onJumpDown));
        setTimeout(() => {
            Game.openDoor();
        }, 3000);
    }

    private onJumpDown(): void {
        this.gamedata.rspeed = 20;
        Game.executor.start();
    }

    public hurt(hurt: number): void {
        super.hurt(hurt);
        HitEffect.addEffect(this);
    }

    die(): void {
        super.die();
        this.stopAi();
        Game.hero.setKeyNum(1);
        Game.hero.once(Game.Event_KeyNum, this, this.onDie);
    }

    onDie(key):void{
        Game.executor && Game.executor.stop_();//全部停止
    }

    private lastTime: number = 0;
    pos2To3d():void{
        super.pos2To3d();
        //脚下的烟雾
        if (Laya.Browser.now() - this.lastTime >= 300) {
            var runSmog: RunSmog = RunSmog.create(this.hbox.cx, this.hbox.cy);
            Laya.Tween.to(runSmog, { scaleX: 0, scaleY: 0, alpha: 0 }, 600, null, new Laya.Handler(this, this.onClear, [runSmog]));
            this.lastTime = Laya.Browser.now();
        }
    }

    private onClear(runSmog: RunSmog): void {
        RunSmog.recover(runSmog);
    }

}

export class RunSmog extends Laya.Image {
    static flag: string = "RunSmog"
    constructor() {
        super();
        this.skin = "bg/renyan.png";
        this.size(64, 64);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    static create(xx: number, yy: number): RunSmog {
        var smog: RunSmog = Laya.Pool.getItemByClass(RunSmog.flag, RunSmog);
        smog.pos(xx, yy);
        Game.footLayer.addChild(smog);
        return smog;
    }

    static recover(smog: RunSmog): void {
        smog.removeSelf();
        smog.alpha = 1;
        smog.scale(1, 1);
        Laya.Pool.recover(RunSmog.flag, smog);
    }
}