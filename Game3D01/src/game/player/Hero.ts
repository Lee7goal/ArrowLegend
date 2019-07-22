import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Game from "../Game";
import GameBG from "../GameBG";
import PlaneGameMove from "../move/PlaneGameMove";
import HeroAI from "../ai/HeroAI";
import { GameAI } from "../ai/GameAI";

export default class Hero extends GamePro {
    constructor() {
        super(GameProType.Hero, 0);
    }

    init(): void  {
        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/hero/hero.lh");
        Game.layer3d.addChild(sp);
        this.setSp3d(sp as Laya.Sprite3D);

        this.play("Idle");
        Game.map0.addChild(this.sp2d);
        this.setGameMove(new PlaneGameMove());
        this.setGameAi(new HeroAI());
        this.addWeapon();

        this.setXY2DBox(GameBG.ww * 6, (GameBG.arr0.length / 13 - 2) * GameBG.ww);//原先是减1

        this.initBlood(800);
        this.addFootCircle();

        Game.map0.Hharr.push(this.hbox);

        this.startAi();

        this.rotation(90 / 180 * Math.PI);
        this.sp3d.transform.localPositionY = 15;
        Laya.Tween.to(this.sp3d.transform, { localPositionY: 0 }, 300, Laya.Ease.cubicIn, new Laya.Handler(this, this.onJumpDown));
        setTimeout(() => {
            Game.openDoor();
        }, 3000);
    }

    private onJumpDown(): void {
        Game.executor.start();
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
}