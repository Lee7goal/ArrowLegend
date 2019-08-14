import BaseAI from "./BaseAi";
import Monster from "../player/Monster";
import { GameAI } from "./GameAI";
import GamePro from "../GamePro";
import MonsterShooting from "./MonsterShooting";
import SysBullet from "../../main/sys/SysBullet";
import SysEnemy from "../../main/sys/SysEnemy";
import App from "../../core/App";
import Game from "../Game";
import GameProType from "../GameProType";
import AttackType from "./AttackType";
import GameHitBox from "../GameHitBox";

/**食人花ai 吐子弹 */
export default class FlowerAI extends BaseAI {
    protected shooting: MonsterShooting = new MonsterShooting();
    protected nextTime: number = 0;
    constructor(pro: Monster) {
        super(pro);
        this.shooting.at = 0.4;
        this.pro.setSpeed(this.sysEnemy.moveSpeed);
        this.pro.on(Game.Event_Short, this, this.shootAc);
    }

    shootAc(): void {
        let curBullet: SysBullet = this.shooting._sysBullet;
        if (!curBullet) {
            return;
        }
        let minNum: number = curBullet.mixNum;//最小数量
        let maxNum: number = curBullet.maxNum;//最大数量
        let bulletAngle: number = curBullet.bulletAngle;//射击角度

        this.shooting.shootCd = this.sysEnemy.enemySpeed;

        if (curBullet.bulletType == 1) {//普通子弹
            this.shooting.shootCd = curBullet.bulletNum * this.sysEnemy.enemySpeed;
            if (bulletAngle != 360) {
                if (minNum % 2 == 0) {
                    let angle: number = curBullet.bulletAngle;
                    angle = angle / (minNum - 1);
                    let hudu: number = angle / 180 * Math.PI * 0.5;
                    let count = Math.floor(minNum / 2);
                    for (let k = 0; k < curBullet.bulletNum; k++) {
                        setTimeout(() => {
                            for (var i = 1; i <= count; i++) {
                                this.shooting.short_arrow(this.pro.face3d + hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                                this.shooting.short_arrow(this.pro.face3d - hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                            }
                        }, k * 500);
                    }
                }
                else {
                    let angle: number = curBullet.bulletAngle;
                    angle = angle / minNum;
                    let hudu: number = angle / 180 * Math.PI;
                    let count = Math.floor(minNum / 2);
                    for (let k = 0; k < curBullet.bulletNum; k++) {
                        setTimeout(() => {
                            this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
                            for (var i = 1; i <= count; i++) {
                                this.shooting.short_arrow(this.pro.face3d + hudu * i, this.pro, GameProType.MonstorArrow);
                                this.shooting.short_arrow(this.pro.face3d - hudu * i, this.pro, GameProType.MonstorArrow);
                            }
                        }, k * 500);
                    }
                }
            }
            else if (bulletAngle == 360) {
                for (let k = 0; k < curBullet.bulletNum; k++) {
                    setTimeout(() => {
                        for (var i = 1; i <= minNum; i++) {
                            this.shooting.short_arrow(2 * Math.PI / minNum * i, this.pro, GameProType.MonstorArrow);
                        }
                    }, k * 500);
                }
            }
        }
        else if (curBullet.bulletType == 2)//随机子弹
        {
            // console.log("随机子弹");
            this.shooting.shootCd = 1200;
            let angle: number = curBullet.bulletAngle;
            angle = angle / 2;
            let bulletNum = minNum + Math.ceil(Math.random() * (maxNum - minNum));
            for (let i = 0; i < bulletNum; i++) {
                setTimeout(() => {
                    let flag: number = i % 2 == 0 ? 1 : -1;
                    let tmp: number = (angle * Math.random()) / 180 * Math.PI * flag;
                    this.shooting.short_arrow(this.pro.face3d + tmp, this.pro, GameProType.MonstorArrow, (Math.random() > 0.5 ? 1 : -1) * 200 * Math.random());
                }, Math.random() * 1000 + 200);
            }
        }
    }

    startAttack(): void {
        this.shooting._sysBullet = null;

        if (this.normalSb) {//普通射击
            if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                this.shooting._sysBullet = this.normalSb;
            }
        }
        if (!this.shooting._sysBullet) {
            if (this.skillISbs.length > 0) {//技能射击
                let rand: number = Math.floor(this.skillISbs.length * Math.random());
                let skillBullet: SysBullet = this.skillISbs[rand];
                if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                    this.shooting._sysBullet = skillBullet//子弹
                }
            }
        }

        if (this.shooting._sysBullet) {
            if (this.now >= this.nextTime) {
                var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.shooting.starAttack(this.pro, GameAI.NormalAttack);
            }
        }

        if (this.now >= this.nextTime) {
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.nextTime = this.now + this.sysEnemy.enemySpeed;
        }   
    }

    exeAI(pro: GamePro): boolean {
        if (!this.run_) return;
        super.exeAI(pro);
        this.onExe();
        return false;
    }

    onExe():void
    {
        this.checkHeroCollision();

        if(this.status == 0 && this.now >= this.nextTime)
        {
            this.pro.play(GameAI.Idle);
            this.nextTime = this.now + this.sysEnemy.enemySpeed;
            this.nextTime = this.now + 1500;
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.status = 1;
        }
        else if(this.status == 1 && this.now >= this.nextTime)
        {
            this.startAttack();
            this.status = 0;
            this.nextTime = this.now + this.shooting.shootCd;
        }

        if(this.status == 1)
        {
            this.pro.move2D(this.pro.face2d);
            this.pro.play(GameAI.Run);
        }
    }

    protected status:number = 0;

    hit(pro: GamePro) {
        super.hit(pro);
    }
}