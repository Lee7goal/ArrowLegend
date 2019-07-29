import { GameAI } from "./GameAI";
import Monster from "../player/Monster";
import GamePro from "../GamePro";
import SysEnemy from "../../main/sys/SysEnemy";
import App from "../../core/App";
import SysBullet from "../../main/sys/SysBullet";
import MonsterShooting from "./MonsterShooting";
import Game from "../Game";
import GameProType from "../GameProType";
import GameHitBox from "../GameHitBox";
import GameBG from "../GameBG";
import MonsterShader from "../player/MonsterShader";
import AttackType from "./AttackType";
import MoveType from "../move/MoveType";
import BoomEffect from "../effect/BoomEffect";

export default class MonsterAI extends GameAI {

    public pro: Monster;
    public sysEnemy: SysEnemy;
    public normalSb: SysBullet;
    public skillISbs: SysBullet[] = [];
    private shooting: MonsterShooting = new MonsterShooting();
    private collisionCd: number = 0;
    public attackCd: number = 0;
    public now: number;

    public aiType: number;
    constructor(pro: Monster) {
        super();
        this.pro = pro;
        this.pro.play(GameAI.Idle);
        this.sysEnemy = this.pro.sysEnemy;
        this.normalSb = null;
        if (this.sysEnemy.normalAttack > 0) {
            this.normalSb = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
            this.aiType = this.normalSb.bulletType;
        }

        this.skillISbs = [];
        if (this.sysEnemy.skillId != '0') {
            var arr: string[] = this.sysEnemy.skillId.split(',');
            for (var m = 0; m < arr.length; m++) {
                let id: number = Number(arr[m]);
                if (id > 0) {
                    let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                    this.skillISbs.push(sysBullet);
                    this.aiType = sysBullet.bulletType;
                }
            }
        }

        this.shooting.at = 0.4;

        this.pro.setSpeed(2);
        this.pro.on(Game.Event_Short, this, this.shootAc);

        this.attackCd = Game.executor.getWorldNow() + this.sysEnemy.enemySpeed;
    }

    public skillBullet: SysBullet;
    startAttack(): void {
        this.shooting._sysBullet = null;
        this.skillBullet = null;

        if (this.normalSb) {//普通射击
            if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                this.shooting._sysBullet = this.normalSb;
            }
        }
        // if (!this.shooting._sysBullet)  {
        if (this.skillISbs.length > 0) {//技能射击
            let rand: number = Math.floor(this.skillISbs.length * Math.random());
            this.skillBullet = this.skillISbs[rand];
            if (this.skillBullet.bulletType == AttackType.NORMAL_BULLET || this.skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                this.shooting._sysBullet = this.skillBullet;//子弹
            }
        }
        // }

        if (this.shooting._sysBullet) {
            if (this.now >= this.attackCd) {
                var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.shooting.starAttack(this.pro, GameAI.NormalAttack);
            }
        }

        if (this.now >= this.attackCd) {
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.attackCd = this.now + this.sysEnemy.enemySpeed;
        }
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
            // console.log("普通子弹");
            this.shooting.shootCd = curBullet.bulletNum * 500;
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

    exeAI(pro: GamePro): boolean {
        this.now = Game.executor.getWorldNow();
        if (this.shaders > 0 && this.now >= this.shaders) {
            this.shaders = 0;
            var ms = <Monster>this.pro;
            if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
                shader.setShader0(this.pro.sp3d, 0);
            }
        }
        if (!this.run_) {
            return false;
        }
        this.checkHeroCollision();

        this.startAttack();

        if (this.normalSb && this.normalSb.bulletType == AttackType.FLY_HIT) {
            //撞击
            if (this.now > this.st) {
                this.onHit();
            }
            else {
                if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
                    var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                    this.pro.rotation(a);
                    this.pro.move2D(this.pro.face2d);
                }
            }
        }
        else {
            if (this.pro.sysEnemy.moveType == MoveType.JUMP) {
                this.jump();
            }
            else  {
                this.pro.move2D(this.pro.face2d);
            }
        }

        return false;
    }

    private st: number = 0;
    private status: number = 0;
    private onHit(): void {
        if (this.status == 0) {
            if (this.pro.acstr != GameAI.NormalAttack) {
                this.pro.play(GameAI.NormalAttack);
                this.status = 1;
                //this.pro.setKeyNum(0.5);
                return;
            }
        }
        else if (this.status == 1) {
            if (this.pro.acstr != GameAI.NormalAttack) {
                this.pro.setSpeed(2);
                this.pro.play(GameAI.Idle);
                this.status = 0;
                this.st = this.now + 3500;
                return;
            }
        }
        if (this.pro.normalizedTime > 0.5) {
            this.pro.setSpeed(8);
            this.pro.move2D(this.pro.face2d);
        }
    }

    /**检测碰撞 */
    checkHeroCollision(): void {
        var now = Game.executor.getWorldNow();
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            if (now > this.collisionCd) {
                if (Game.hero.hbox.linkPro_) {
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
                    this.collisionCd = now + 2000;
                }
            }
        }
    }

    starAi(): void {
        this.run_ = true;
        this.shooting.now = Game.executor.getWorldNow();
        var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
        this.pro.rotation(a);
    }

    stopAi(): void {
        this.run_ = false;
        this.shooting.cancelAttack();
    }

    private shaders: number = 0;
    hit(pro: GamePro): void {
        this.pro.hurt(pro.hurtValue);
        // this.pro.hurt(1000);
        if (this.pro.gamedata.hp <= 0) {
            this.die();
        } else {
            if (this.pro.acstr == GameAI.Idle) {
                this.pro.play(GameAI.TakeDamage);
            }
        }


        var ms = <Monster>this.pro;
        if (MonsterShader.map[ms.sysEnemy.enemymode]) {
            var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
            shader.setShader0(this.pro.sp3d, 1);
            var now = Game.executor.getWorldNow();
            this.shaders = now + 250;
        }
    }

    die(): void {
        this.pro.die();
        this.stopAi();
    }
    private jump(): void {
        if (this.pro.sysEnemy.moveType == MoveType.JUMP) {//跳跃
            if (this.now > this.jumpCD) {
                this.onJump();
                this.jumpCD = this.now + this.pro.sysEnemy.enemySpeed;
            }
            else {
                if (this.pro.move2D(this.pro.face2d)) {
                    //跳到目标点立马开火
                    if (this.now > this.jumpFireCD) {
                        if (this.skillBullet && this.skillBullet.bulletType == AttackType.AOE) {
                            //AOE伤害
                            this.onAoe(this.skillBullet);
                        }
                        else {
                            this.shootAc();
                        }
                        // this.jumpFireCD = now + this.pro.sysEnemy.enemySpeed;
                        this.jumpFireCD = this.now + 2000;
                    }

                }
            }
        }
    }

    /**aoe */
    private onAoe(bullet: SysBullet): void {
        BoomEffect.getEffect(this.pro, bullet.boomEffect);
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) <= bullet.attackAngle) {
            Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
        }
    }

    private jumpFireCD: number = 0;
    private jumpCD: number = 0;
    /**跳跃 */
    private onJump(): void {
        var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
        this.pro.rotation(a);
        let mRow: number = Math.floor(this.pro.hbox.cy / GameBG.ww);
        let mCol: number = Math.floor(this.pro.hbox.cx / GameBG.ww);

        let range: number = 2;

        let minCol = mCol - range;
        minCol = Math.max(minCol, 1);
        let maxCol = mCol + range;
        maxCol = Math.min(maxCol, 11);

        let minRow;
        let maxRow;
        let endRowNum = Game.map0.endRowNum - 1;
        if (Game.hero.hbox.y < this.pro.hbox.y) {//如果在主角下边就往上跳
            minRow = mRow - range;
            minRow = Math.max(minRow, 10);
            maxRow = mRow;
            maxRow = Math.min(maxRow, endRowNum);
        }
        else {//如果在主角上边就往下跳
            minRow = mRow;
            minRow = Math.max(minRow, 10);
            maxRow = mRow + range;
            maxRow = Math.min(maxRow, endRowNum);
        }

        var info: any = Game.map0.info;
        console.log(mRow, mCol);
        var arr: number[][] = [];
        for (let i = minRow; i <= maxRow; i++) {
            for (let j = minCol; j <= maxCol; j++) {
                if (j == mRow && i == mCol) {
                    continue;
                }
                var key: number = info[i + "_" + j];
                if (key != null && key == 0) {
                    let aaa: number[] = [j, i];
                    arr.push(aaa);
                }
            }
        }
        if (arr.length > 0) {
            var rand: number = Math.floor(arr.length * Math.random());
            var toArr: number[] = arr[rand];
            let toX = toArr[0] * GameBG.ww;
            let toY = toArr[1] * GameBG.ww;

            this.pro.curLen = 0;
            this.pro.moveLen = Math.sqrt((this.pro.hbox.cy - toY) * (this.pro.hbox.cy - toY) + (this.pro.hbox.cx - toX) * (this.pro.hbox.cx - toX));
        }
    }


    private skillCd: number = 0;
    playSkill(): void  {
        if (this.now > this.skillCd)  {
            this.pro.play(GameAI.SkillStart);

            this.skillCd = this.now + 5000;
        }
        else  {
            this.pro.move2D(this.pro.face2d);
        }
    }
}