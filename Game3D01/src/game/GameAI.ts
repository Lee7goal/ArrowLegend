import GamePro from "./GamePro";
import Game from "./Game";
import { ArrowGameMove, MonsterBulletMove } from "./GameMove";
import GameHitBox from "./GameHitBox";
import GameProType from "./GameProType";
import GameBG from "./GameBG";
import BulletRotateScript from "./controllerScript/BulletRotateScript";
import SysBullet from "../main/sys/SysBullet";
import App from "../core/App";

export abstract class GameAI {
    static NormalAttack: string = "Attack";
    // static JumpAttack:string = "JumpAttack";
    // static ArrowAttack:string = "Attack";
    // static SpinAttack:string = "SpinAttack";
    static Idle: string = "Idle";
    static Die: string = "Die";
    static Run: string = "Run";
    static TakeDamage: string = "TakeDamage";
    abstract exeAI(pro: GamePro): boolean;
    abstract starAi();
    abstract stopAi();
    /**遭到攻击 */
    abstract hit(pro: GamePro);

    protected run_: boolean = false;
}
//巡逻&攻击
export class MonsterAI1 extends GameAI {
    private pro: GamePro;
    private shooting: MonsterShooting = new MonsterShooting();

    private aicd = 0;
    private aist = 0;

    private collisionCd: number = 0;



    constructor(pro: GamePro) {
        super();
        this.pro = pro;
        this.pro.play(GameAI.Idle);
        this.shooting.attackCd = pro.sysEnemy.enemySpeed;
        this.shooting.attackCd = 2000;
        this.shooting.setBullet(pro.sysEnemy.bulletId);
        this.shooting.at = 0.4;
        this.pro.on(Game.Event_Short, this, this.shootAc);

        this.aicd = this.shooting.attackCd + 100;
        this.aist = Game.executor.getWorldNow();
        this.pro.setSpeed(2);
    }

    shootAc(): void {
        if (this.pro.sysEnemy.bulletId > 0) {
            let bulletNum: number = this.pro.sysEnemy.bulletNum;
            if (bulletNum == 1) {
                this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
            }
            else if (bulletNum == 3) {
                this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
                this.shooting.short_arrow(this.pro.face3d + Math.PI / 6, this.pro, GameProType.MonstorArrow);
                this.shooting.short_arrow(this.pro.face3d - Math.PI / 6, this.pro, GameProType.MonstorArrow);
            }
            else if (bulletNum == 4 || bulletNum == 8) {
                for (var i = 1; i <= bulletNum; i++) {
                    this.shooting.short_arrow(2 * Math.PI / bulletNum * i, this.pro, GameProType.MonstorArrow);
                }
            }
        }
    }

    hit(pro: GamePro) {
        this.pro.hurt(pro.hurtValue);
        this.pro.sp3d.addChild(Game.selectFoot);
        this.pro.addSprite3DToChild("RigHeadGizmo", Game.selectHead)
        // this.pro.sp3d.addChild(Game.selectHead);
        if (this.pro.gamedata.hp <= 0) {
            this.pro.play(GameAI.Die);
            this.pro.stopAi();
            this.pro.sp3d.removeChild(Game.selectFoot);
            this.pro.sp3d.removeChild(Game.selectHead);
            // this.pro.removeSprite3DToAvatarNode(Game.selectHead)
            if (Game.map0.Eharr.indexOf(this.pro.hbox) >= 0) {
                Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.pro.hbox), 1);
            }
        } else {
            if (this.pro.acstr == GameAI.Idle) {
                this.pro.play(GameAI.TakeDamage);
            }
        }
    }

    private aiCount: number = Math.floor(Math.random() * 5);

    exeAI(pro: GamePro): boolean {
        if (this.pro.gamedata.hp <= 0) {
            return;
        }

        if (Game.hero.gamedata.hp <= 0) {
            this.stopAi();
            if (this.pro.gamedata.hp > 0) {
                this.pro.play(GameAI.Idle);
            }
            return;
        }

        var now = Game.executor.getWorldNow();
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            if (now > this.collisionCd) {
                if (Game.hero.hbox.linkPro_) {
                    // Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
                    pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                    this.collisionCd = now + 1000;
                }
            }
        }
        else if (now >= this.aist) {
            //Laya.stage.timer.clear(this,this.go);
            this.run_ = false;
            this.aiCount++;
            if (this.aiCount % 5 != 0) {
                this.shooting.now = now;
                if (this.shooting.attackOk()) {
                    var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                    this.pro.rotation(a);
                    this.shooting.starAttack(this.pro, GameAI.NormalAttack);
                    //return true;
                    this.aist = now + this.aicd;
                }
            } else {
                var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                //Laya.stage.frameLoop(1,this,this.go);
                this.run_ = true;
                this.aist = now + 2000 + (1000 * Math.random());
            }
        }

        if (this.run_) {
            this.pro.move2D(this.pro.face2d);
        }

        return false;
    }

    // private go():void{
    //     this.pro.move2D(this.pro.face2d);
    // }

    starAi() {
        this.shooting.now = Game.executor.getWorldNow();
        this.shooting.st = this.shooting.now + this.shooting.attackCd;
    }
    stopAi() {
        //Laya.stage.timer.clear(this,this.go);
        this.run_ = false;
        this.shooting.cancelAttack();
    }
}

export class HeroArrowAI extends GameAI {

    private pro: GamePro;
    // private trail:Laya.TrailSprite3D;
    // private trail_parent:Laya.Sprite3D;

    constructor(pro: GamePro) {
        super();
        this.pro = pro;
        //this.trail = pro.sp3d.getChildByName("Arrow-Blue").getChildByName("Trail") as Laya.TrailSprite3D;            
        //console.log(trail);

    }

    // private trail_off():void{        
    //     if(this.trail.parent){
    //         this.trail_parent = this.trail.parent as Laya.Sprite3D;
    //         this.trail_parent.removeChild(this.trail);
    //     }
    // }

    // private trail_on():void{
    //     if(this.trail.parent){
    //         //this.trail_parent = this.trail.parent;
    //         this.pro.sp3d.getChildByName("Arrow-Blue").addChild(this.trail);
    //     }
    // }

    hit(pro: GamePro) {
        this.i = 25;
        this.pro.sp3d.transform.localPositionX -= pro.sp3d.transform.localPositionX;
        this.pro.sp3d.transform.localPositionZ -= pro.sp3d.transform.localPositionZ;
        this.pro.sp3d.transform.localRotationEulerY -= pro.sp3d.transform.localRotationEulerY;
        pro.sp3d.addChild(this.pro.sp3d);
        //this.trail_off();
    }

    private i: number = 0;
    exeAI(pro: GamePro): boolean {

        if (this.i == 0 && !pro.move2D(pro.face2d)) {
            this.i = 1;
            return false;
        }

        if (this.i > 0) {
            this.i++;
            if (this.i > 30) {
                pro.stopAi();
                if (pro.sp3d.parent) {
                    pro.sp3d.parent.removeChild(pro.sp3d);
                    Game.HeroArrows.push(pro);
                    this.pro.stopAi();
                }
            }
        }

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
        //this.trail_on();
    }
}

export class MonsterBulletAI extends GameAI {

    private pro: GamePro;
    constructor(pro: GamePro) {
        super();
        this.pro = pro;

    }

    hit(pro: GamePro) {
        // this.i = 25;
        // this.pro.sp3d.transform.localPositionX -= pro.sp3d.transform.localPositionX;
        // this.pro.sp3d.transform.localPositionZ -= pro.sp3d.transform.localPositionZ;
        // this.pro.sp3d.transform.localRotationEulerY -= pro.sp3d.transform.localRotationEulerY;
        // pro.sp3d.addChild(this.pro.sp3d);

        // this.pro.stopAi();
        // if (this.pro.sp3d.parent) {
        //     this.pro.sp3d.parent.removeChild(this.pro.sp3d);
        // }
    }

    private i: number = 0;
    exeAI(pro: GamePro): boolean {
        if (!pro.move2D(pro.face2d))  {
            this.pro.stopAi();
            if (this.pro.sp3d.parent) {
                this.pro.sp3d.parent.removeChild(this.pro.sp3d);
            }
            return false;
        }
        // if (this.i == 0 && !pro.move2D(pro.face2d)) {
        //     this.i = 1;
        //     return false;
        // }

        // if (this.i > 0) {
        //     this.i++;
        //     if (this.i > 30) {
        //         pro.stopAi();
        //         if (pro.sp3d.parent) {
        //             pro.sp3d.parent.removeChild(pro.sp3d);
        //             // Game.HeroArrows.push(pro);
        //             this.pro.stopAi();
        //         }
        //     }
        // }

    }
    starAi() {
        this.i = 0;
    }
    stopAi() {
        this.i = 0;
    }
}


export class HeroAI extends GameAI {

    private shootin: Shooting = new Shooting();

    //private run_:boolean = false;

    public set run(b: boolean) {
        if (this.run_ != b) {
            this.run_ = b;
            if (this.run_) {
                this.stopAi();
                Game.hero.play(GameAI.Run);
            } else {
                Game.hero.play(GameAI.Idle);
                this.starAi();
            }
        }
    }

    
    hit(pro: GamePro) {
        if (Game.hero.acstr == GameAI.Idle) {
            // Game.hero.play(GameAI.TakeDamage);
        }
        Game.hero.hurt(pro.hurtValue);
        if (Game.hero.gamedata.hp <= 0) {
            this.stopAi();
            Game.hero.play(GameAI.Die);
        }

        let hitEff:Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/20000/monster.lh"));
        Game.layer3d.addChild(hitEff);
        Game.hero.addSprite3DToAvatarNode("joint2",hitEff);
        setTimeout(() => {
            hitEff.removeSelf();
        }, 500);

    }

    public starAi() {
        if (Game.hero.gamedata.hp <= 0) {
            return;
        }

        if (Game.map0.Eharr.length > 1) {
            Game.map0.Eharr.sort(this.sore0);
            Game.e0_ = Game.map0.Eharr[0].linkPro_;
        }
        Game.hero.on(Game.Event_Short, this, this.short);
        this.shootin.at = 0.35;
        this.shootin.now = Game.executor.getWorldNow();
    }

    public short(): void {
        this.shootin.short_arrow(40, Game.hero.face3d, Game.hero, GameProType.HeroArrow);
        //this.short_arrow(40,Game.hero.face3d);        
        // this.short_arrow(40,Game.hero.face3d + Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/6);
        // this.short_arrow(40,Game.hero.face3d - Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI/2);
        // this.short_arrow(40,Game.hero.face3d + Math.PI);
    }

    public stopAi() {
        this.shootin.cancelAttack();
        Game.hero.off(Game.Event_Short, this, this.short);
    }



    public exeAI(pro: GamePro): boolean {
        var now = Game.executor.getWorldNow();
        //地刺
        if (Game.map0.Thornarr.length > 0) {
            for (var i = 0; i < Game.map0.Thornarr.length; i++) {
                let thornBox: GameHitBox = Game.map0.Thornarr[i];
                if (Game.hero.hbox.hit(Game.hero.hbox, thornBox)) {
                    if (now > thornBox.cdTime) {
                        if (Game.hero.hbox.linkPro_) {
                            // Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                            thornBox.cdTime = now + 1000;
                        }
                    }
                }
            }
        }
        if (this.run_) {
            this.moves();
            return;
        }

        if (Game.map0.Eharr.length > 0 && this.shootin.attackOk()) {

            //Game.e0_ = Game.map0.Eharr[0].linkPro_;
            var a: number = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
            var facen2d_ = (2 * Math.PI - a);
            if (Game.e0_.gamedata.hp > 0 && this.shootin.checkBallistic(facen2d_, Game.hero, Game.e0_)) {
                pro.rotation(a);
                return this.shootin.starAttack(Game.hero, GameAI.NormalAttack);
            }

            if (Game.map0.Eharr.length > 1) {
                Game.map0.Eharr.sort(this.sore0);
                var arr = Game.map0.Eharr;
                for (let i = 0; i < arr.length; i++) {
                    var ero = arr[i];
                    if (ero.linkPro_ != Game.e0_) {
                        var a: number = GameHitBox.faceTo3D(pro.hbox, ero);
                        var facen2d_ = (2 * Math.PI - a);
                        if (this.shootin.checkBallistic(facen2d_, Game.hero, ero.linkPro_)) {
                            Game.e0_ = ero.linkPro_;
                            pro.rotation(a);
                            return this.shootin.starAttack(Game.hero, GameAI.NormalAttack);
                        }
                    }

                }
            }
            Game.e0_ = Game.map0.Eharr[0].linkPro_;
            var a: number = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
            pro.rotation(a);
            this.shootin.starAttack(Game.hero, GameAI.NormalAttack);

        }
        return true;
    }

    public sore0(g0: GameHitBox, g1: GameHitBox): number {
        // var hits = Game.map0.Eharr;
        // hits.sort()
        return GameHitBox.faceToLenth(Game.hero.hbox, g0) - GameHitBox.faceToLenth(Game.hero.hbox, g1);
    }

    public move2d(n: number): void {
        Game.hero.move2D(n);
        Game.bg.updateY();
    }

    moves(): void {
        let n: number;
        var speed: number = Game.ro.getSpeed();
        n = Game.ro.getA3d();
        Game.ro.rotate(n);
        if (speed > 0) {
            Game.hero.rotation(n);
            this.move2d(Game.ro.getA());
        } else {

        }
    }
}

/**射击器*/
export class Shooting {
    /**单次出手次数*/
    public scd: number = 0;
    /**攻击CD*/
    public attackCd: number = 1200;
    /**下次攻击时间*/
    public st: number = 0;
    /**当前时间*/
    public now: number = 0;
    /**攻击前摇时间*/
    public at: number = 0;
    //private static bulletCount:number = 0;

    private pro: GamePro;

    private getBullet(proType_: number): GamePro {
        console.log(" getBullet proType_ ", proType_);

        var gp: GamePro;
        if (Game.HeroArrows.length <= 0) {
            gp = new GamePro(proType_);

            var bullet: Laya.Sprite3D;
            bullet = (Laya.Sprite3D.instantiate(Game.a0.sp3d)) as Laya.Sprite3D;
            gp.setSp3d(bullet);
            gp.setGameMove(new ArrowGameMove());
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

    public short_arrow(speed_: number, r_: number, pro: GamePro, proType_: number) {
        var bo = this.getBullet(proType_);
        bo.sp3d.transform.localPositionY = 0.1;
        bo.setXY2D(pro.pos2.x, pro.pos2.z);
        bo.setSpeed(speed_);
        bo.rotation(r_);
        // (bo.sp3d.getChildAt(0) as Laya.Sprite3D).transform.localRotationEulerY = -bo.sp3d.transform.localRotationEulerY;
        bo.gamedata.bounce = pro.gamedata.bounce;
        Game.layer3d.addChild(bo.sp3d);
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
        Laya.stage.timer.clear(this, this.ac0);
        this.scd = 0;
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

/**怪射击器*/
export class MonsterShooting {
    /**单次出手次数*/
    public scd: number = 0;
    /**攻击CD*/
    public attackCd: number = 1200;
    /**下次攻击时间*/
    public st: number = 0;
    /**当前时间*/
    public now: number = 0;
    /**攻击前摇时间*/
    public at: number = 0;
    //private static bulletCount:number = 0;

    private pro: GamePro;

    private _sysBullet: SysBullet;
    public setBullet(bulletId: number): void {
        if (bulletId > 0) {
            this._sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, bulletId);
        }
    }

    private getBullet(proType_: number): GamePro {
        console.log(" getBullet proType_ ", proType_);

        var gp: GamePro;
        // if (Game.HeroArrows.length <= 0) {
        gp = new GamePro(proType_);
        gp.flag = Math.random();
        var bullet: Laya.Sprite3D;
        bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + this._sysBullet.bulletMode + "/monster.lh"))) as Laya.Sprite3D;
        gp.setSp3d(bullet);
        gp.sysBullet = this._sysBullet;
        gp.setGameMove(new MonsterBulletMove());
        gp.setGameAi(new MonsterBulletAI(gp));
        bullet.getChildAt(0).addComponent(BulletRotateScript);
        //Shooting.bulletCount++;
        //console.log("Shooting.bulletCount " , Shooting.bulletCount);
        // } else {
        //     gp = Game.HeroArrows.shift();
        //     gp.gamedata.proType = proType_;
        //     //gp.gamedata.rspeed = 0;
        // }
        return gp;
    }

    public short_arrow(r_: number, pro: GamePro, proType_: number) {
        var bo = this.getBullet(proType_);
        bo.sp3d.transform.localPositionY = 0.1;
        bo.setXY2D(pro.pos2.x, pro.pos2.z);
        bo.setSpeed(this._sysBullet.bulletSpeed);
        bo.rotation(r_);
        bo.curLen = 0;
        bo.moveLen = Math.sqrt((bo.hbox.cy - Game.hero.hbox.cy) * (bo.hbox.cy - Game.hero.hbox.cy) + (bo.hbox.cx - Game.hero.hbox.cx) * (bo.hbox.cx - Game.hero.hbox.cx));
        (bo.sp3d.getChildAt(0) as Laya.Sprite3D).transform.localRotationEulerY = -bo.sp3d.transform.localRotationEulerY;
        bo.gamedata.bounce = pro.gamedata.bounce;
        Game.layer3d.addChild(bo.sp3d);
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
        Laya.stage.timer.clear(this, this.ac0);
        this.scd = 0;
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