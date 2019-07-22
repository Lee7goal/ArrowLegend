import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import GameBG from "../GameBG";
import { GameAI } from "./GameAI";
import HeroArrowAI from "./HeroArrowAI";
import ArrowGameMove from "../move/ArrowGameMove";
import HeroArrowMove0 from "../move/HeroArrowMove0";

/**射击器*/
export default class Shooting {
    /**单次出手次数*/
    public scd: number = 0;
    /**攻击CD*/
    public attackCd: number = 1200;
    /**下次攻击时间*/
    public st: number = 0;
    /**上次攻击时间*/
    public et: number = 0;
    /**当前时间*/
    public now: number = 0;
    /**攻击前摇时间*/
    public at: number = 0;
    //private static bulletCount:number = 0;

    private pro: GamePro;

    private getBullet(proType_: number): GamePro {
        var gp: GamePro;
        if (Game.HeroArrows.length <= 0) {
            gp = new GamePro(proType_);

            var bullet: Laya.Sprite3D;
            bullet = (Laya.Sprite3D.instantiate(Game.a0.sp3d)) as Laya.Sprite3D;
            gp.setSp3d(bullet);
            //gp.setGameMove(new ArrowGameMove());
            gp.setGameMove(new HeroArrowMove0());
            gp.setGameAi(new HeroArrowAI(gp));
            // bullet.getChildAt(0).addComponent(BulletRotateScript);
            //Shooting.bulletCount++;
            //console.log("Shooting.bulletCount " , Shooting.bulletCount);
        } else {
            gp = Game.HeroArrows.shift();
            gp.gamedata.proType = proType_;
            //gp.gamedata.rspeed = 0;
        }
        return gp;
    }

    public short_arrow(speed_: number, r_: number, pro: GamePro, proType_: number,dx:number,dy:number) {
        var bo = this.getBullet(proType_);
        //bo.sp3d.transform.localPositionY = -1;
        bo.setXY2DBox(pro.hbox.x + dx, pro.hbox.y + dy);
        bo.setSpeed(speed_);
        bo.rotation(r_);
        bo.gamedata.bounce = pro.gamedata.bounce;
        Game.layer3d.addChild(bo.sp3d);
        Game.map0.addChild(bo.sp2d);
        bo.startAi();
    }

    public attackOk(): boolean {
        this.now = Game.executor.getWorldNow();
        return this.now >= this.st;
    }

    public starAttack(pro: GamePro, acstr: string): boolean {
        this.pro = pro;
        if (this.attackOk()) {            
            this.st = this.now + this.attackCd;
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
        this.st = this.et;
        this.scd = 0;
        Laya.stage.timer.clear(this, this.ac0);
    }

    private ac0(): void {
        //this.pro;
        if (this.pro.normalizedTime >= this.at) {
            if (this.pro.normalizedTime >= 1) {
                Laya.stage.timer.clear(this, this.ac0);
                this.pro.play(GameAI.Idle);
            }
            if (this.scd == 0) {
                this.scd = 1;
                this.pro.event(Game.Event_Short, null);
                this.et = this.st;
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
