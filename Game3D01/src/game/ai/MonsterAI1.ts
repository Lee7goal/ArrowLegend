import Game from "../Game";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import GameBG from "../GameBG";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import MonsterShooting from "./MonsterShooting";
import MonsterBulletAI from "./MonsterBulletAI";

//巡逻&攻击
export default class MonsterAI1 extends GameAI {
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
        this.shooting.setBullet(pro.sysEnemy.bulletId);
        this.shooting.at = 0.4;
        // this.aicd = this.shooting.attackCd;
        this.pro.on(Game.Event_Short, this, this.shootAc);

        this.aicd = this.shooting.attackCd + 100;
        this.aist = Game.executor.getWorldNow();
        this.pro.setSpeed(2);
    }

    shootAc(): void {
        // this.shooting.needTime = this.shooting.attackCd;
        // this.shooting.st = this.shooting.now + this.shooting.needTime;
        this.aicd = this.shooting.attackCd + 100;
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
            else {
                let angle: number = this.pro.sysEnemy.bulletAngle;
                angle = angle / 2;
                bulletNum = 15 + Math.ceil(Math.random() * 5);
                this.aicd = 4500;
                if (1 - Math.random() > 0.5)  {
                    for (let i = 0; i < bulletNum; i++) {
                        setTimeout(() => {
                            let flag: number = i % 2 == 0 ? 1 : -1;
                            let tmp: number = (angle * Math.random()) / 180 * Math.PI * flag;
                            this.shooting.short_arrow(this.pro.face3d + tmp, this.pro, GameProType.MonstorArrow, (Math.random() > 0.5 ? 1 : -1) * 200 * Math.random());
                        }, Math.random() * 1000 + 200);
                    }
                }
                else {
                    let gg = (angle * 0.5) / 180 * Math.PI;
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            this.shooting.short_arrow(this.pro.face3d - gg * 2, this.pro, GameProType.MonstorArrow);
                            this.shooting.short_arrow(this.pro.face3d - gg, this.pro, GameProType.MonstorArrow);
                            this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
                            this.shooting.short_arrow(this.pro.face3d + gg, this.pro, GameProType.MonstorArrow);
                            this.shooting.short_arrow(this.pro.face3d + gg * 2, this.pro, GameProType.MonstorArrow);
                        }, i * 500);

                    }
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
            //if (this.aiCount % 5 != 0) {
            this.shooting.now = now;
            // if (this.shooting.attackOk()) {
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.shooting.starAttack(this.pro, GameAI.NormalAttack);
            //return true;
            this.aist = now + this.aicd;
            // }
            // } else {
            //     var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            //     this.pro.rotation(a);
            //     //Laya.stage.frameLoop(1,this,this.go);
            //     this.run_ = true;
            //     this.aist = now + 2000 + (1000 * Math.random());
            // }
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
