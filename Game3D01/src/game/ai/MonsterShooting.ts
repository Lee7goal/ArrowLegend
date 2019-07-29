import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import GameBG from "../GameBG";
import Game from "../Game";
import SysBullet from "../../main/sys/SysBullet";
import App from "../../core/App";
import MonsterBulletAI from "./MonsterBulletAI";
import MonsterBulletMove from "../move/MonsterBulletMove";
import MonsterBullet from "../player/MonsterBullet";
import { GameAI } from "./GameAI";

/**怪射击器*/
export default class MonsterShooting {
    /**单次出手次数*/
    public scd: number = 0;
    /**攻击CD*/
    public shootCd: number = 1200;

    /**下次攻击时间*/
    public st: number = 0;
    /**当前时间*/
    public now: number = 0;
    /**攻击前摇时间*/
    public at: number = 0;
    //private static bulletCount:number = 0;

    private pro: GamePro;

    public _sysBullet: SysBullet;

    public short_arrow(r_: number, pro: GamePro, proType_: number,range:number = 0) {
        var bo = MonsterBullet.getBullet(this._sysBullet);
        // bo.sp3d.transform.localPositionX = bo.sp3d.transform.localPositionY = bo.sp3d.transform.localPositionZ = 0;
        bo.sp3d.transform.localPositionY = 0.1;
        bo.setXY2D(pro.pos2.x, pro.pos2.z);
        Game.layer3d.addChild(bo.sp3d);
        bo.setSpeed(this._sysBullet.bulletSpeed);
        Game.bloodLayer.graphics.clear();
        bo.rotation(r_);
        bo.curLen = 0;
        bo.moveLen = range + Math.sqrt((bo.hbox.cy - Game.hero.hbox.cy) * (bo.hbox.cy - Game.hero.hbox.cy) + (bo.hbox.cx - Game.hero.hbox.cx) * (bo.hbox.cx - Game.hero.hbox.cx));
        (bo.sp3d.getChildAt(0) as Laya.Sprite3D).transform.localRotationEulerY = -bo.sp3d.transform.localRotationEulerY;

        // let line:Laya.Sprite = new Laya.Sprite();
        // line.graphics.drawLine(bo.hbox.cx,bo.hbox.cy,Game.hero.hbox.cx,Game.hero.hbox.cy,"#ff0000",6);
        // Game.footLayer.addChild(line);
        // setTimeout(() => {
        //     line.removeSelf();
        // }, 800);
        bo.startAi();
    }

    public get attackOk(): boolean {
        this.now = Game.executor.getWorldNow();
        return this.now >= this.st;
    }

    public starAttack(pro: GamePro, acstr: string): boolean {
        this.pro = pro;
        if (this.attackOk) {
            this.scd = 0;
            pro.play(acstr);
            if (this.at > 0) {
                Laya.stage.timer.frameLoop(this.at, this, this.ac0);
            } else {
                this.ac0();
            }
            return true;
        }
        return false;
    }

    public cancelAttack(): void {
        Laya.stage.timer.clear(this, this.ac0);
        this.scd = 0;
    }

    private ac0(): void {
        if (this.pro.normalizedTime >= this.at) {
            if (this.pro.normalizedTime >= 1) {
                Laya.stage.timer.clear(this, this.ac0);
                this.pro.play(GameAI.Idle);
            }
            if (this.scd == 0) {
                this.scd = 1;
                this.pro.event(Game.Event_Short, null);
                this.st =  Game.executor.getWorldNow() + this.shootCd;
            }
        }
    }

    private future: GameHitBox = new GameHitBox(2, 2);

    public checkBallistic(n: number, pro: GamePro, ero: GamePro): GamePro {
        var vx: number = GameBG.mw2 * Math.cos(n);
        var vz: number = GameBG.mw2 * Math.sin(n);
        var x0: number = pro.hbox.cx;
        var y0: number = pro.hbox.cy;
        var ebh: GameHitBox;
        for (let i = 0; i < 6000; i++) {
            ebh = null;
            this.future.setVV(x0, y0, vx, vz);

            if (ero.hbox.hit(ero.hbox, this.future)) {
                return ero;
            }

            var hits = Game.map0.Aharr;
            ebh = Game.map0.chechHit_arr(this.future, hits);
            if (ebh) {
                return null;
            }
            x0 += vx;
            y0 += vz;
        }
        return null;
    }
}