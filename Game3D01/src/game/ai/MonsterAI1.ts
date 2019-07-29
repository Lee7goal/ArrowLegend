import Game from "../Game";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import GameBG from "../GameBG";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import MonsterShooting from "./MonsterShooting";
import MonsterBulletAI from "./MonsterBulletAI";
import Monster from "../player/Monster";
import App from "../../core/App";
import SysBullet from "../../main/sys/SysBullet";
import AttackType from "./AttackType";
import MonsterShader from "../player/MonsterShader";
import SysEnemy from "../../main/sys/SysEnemy";
import MoveType from "../move/MoveType";
import HitEffect from "../effect/HitEffect";
import BoomEffect from "../effect/BoomEffect";
import { ui } from "../../ui/layaMaxUI";

//巡逻&攻击
export default class MonsterAI1 extends GameAI {
    private pro: Monster;
    private shooting: MonsterShooting = new MonsterShooting();

    private aicd = 0;
    private aist = 0;
    private movecd = 0;

    private collisionCd: number = 0;


    private sysEnemy: SysEnemy;
    private normalSb: SysBullet;
    private skillISbs: SysBullet[] = [];
    constructor() {
        super();
    }

    init(pro: Monster): void {
        this.pro = pro;
        this.pro.play(GameAI.Idle);
        this.sysEnemy = this.pro.sysEnemy;
        if (this.sysEnemy.normalAttack > 0)  {
            this.normalSb = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
        }
        else {
            this.normalSb = null;
        }
        this.skillISbs = [];
        if (this.sysEnemy.skillId != '0') {
            var arr: string[] = this.sysEnemy.skillId.split(',');
            for (var m = 0; m < arr.length; m++) {
                let id: number = Number(arr[m]);
                if (id > 0) {
                    let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                    this.skillISbs.push(sysBullet);
                }
            }
        }

        this.shooting.shootCd = pro.sysEnemy.enemySpeed;
        // this.shooting._sysBullet = pro.sysBullet;
        this.shooting.at = 0.4;
        // this.aicd = this.shooting.attackCd;
        this.pro.on(Game.Event_Short, this, this.shootAc);

        this.aicd = this.shooting.shootCd + 100;
        this.aist = Game.executor.getWorldNow();
        this.pro.setSpeed(2);
    }

    shootAc(): void {
        let curBullet: SysBullet = this.shooting._sysBullet;
        if (!curBullet) {
            return;
        }
        // console.log("当前的子弹id", curBullet.id);
        // this.shooting.needTime = this.shooting.attackCd;
        // this.shooting.st = this.shooting.now + this.shooting.needTime;
        this.aicd = this.shooting.shootCd + 100;
        let minNum: number = curBullet.mixNum;//最小数量
        let maxNum: number = curBullet.maxNum;//最大数量
        let bulletAngle: number = curBullet.bulletAngle;//射击角度
        // let bulletNum:number = minNum

        if (curBullet.bulletType == 1) {//普通子弹
            // console.log("普通子弹");
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
            let angle: number = curBullet.bulletAngle;
            angle = angle / 2;
            let bulletNum = minNum + Math.ceil(Math.random() * (maxNum - minNum));
            this.aicd = 4500;
            for (let i = 0; i < bulletNum; i++) {
                setTimeout(() => {
                    let flag: number = i % 2 == 0 ? 1 : -1;
                    let tmp: number = (angle * Math.random()) / 180 * Math.PI * flag;
                    this.shooting.short_arrow(this.pro.face3d + tmp, this.pro, GameProType.MonstorArrow, (Math.random() > 0.5 ? 1 : -1) * 200 * Math.random());
                }, Math.random() * 1000 + 200);
            }
        }
    }

    hit(pro: GamePro) {
        this.pro.hurt(pro.hurtValue);
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

    private shaders: number = 0;

    die(): void {
        this.pro.die();
        if (this.skillISbs.length > 0) {
            let rand: number = Math.floor(this.skillISbs.length * Math.random());
            let skillBullet: SysBullet = this.skillISbs[rand];
            if (skillBullet.bulletType == AttackType.SPLIT && skillBullet.bulletSplit == 1) {
                if (this.pro.splitTimes >= skillBullet.splitNum) {
                    return;
                }
                this.onDieSplit();
            }
        }
    }

    starAi() {
        this.run_ = true;
        this.shooting.now = Game.executor.getWorldNow();
        this.shooting.st = this.shooting.now + this.shooting.shootCd;
        var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
        this.pro.rotation(a);

    }
    stopAi() {
        this.run_ = false;
        this.shooting.cancelAttack();
    }

    private aiCount: number = Math.floor(Math.random() * 5);

    private attackCD: number = 0;

    exeAI(pro: GamePro): boolean {
        var now = Game.executor.getWorldNow();

        if (this.shaders > 0 && now >= this.shaders) {
            this.shaders = 0;
            var ms = <Monster>this.pro;
            if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
                shader.setShader0(this.pro.sp3d, 0);
            }
        }

        if (this.pro.gamedata.hp <= 0) {
            return false;
        }

        if (Game.hero.gamedata.hp <= 0) {
            this.stopAi();
            if (this.pro.gamedata.hp > 0) {
                this.pro.play(GameAI.Idle);
            }
            return false;
        }

        // if(this.pro.move2D(this.pro.face2d))
        // {

        // }


        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            if (now > this.collisionCd) {
                if (Game.hero.hbox.linkPro_) {//怪碰到主角后主角掉血
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
                    // pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                    this.collisionCd = now + 1000;
                }
            }
        }


        if (this.normalSb) {//普通攻击
            if (this.normalSb.bulletType == AttackType.FLY_HIT) {
                this.shooting._sysBullet = null;
            }
            else if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                this.shooting._sysBullet = this.normalSb;
            }
            else {
                this.shooting._sysBullet = null;
            }
        }

        let skillBullet: SysBullet;
        if (this.skillISbs.length > 0) {//技能攻击
            let rand: number = Math.floor(this.skillISbs.length * Math.random());
            skillBullet = this.skillISbs[rand];
            if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                this.shooting._sysBullet = skillBullet;//子弹
            }
            else if (skillBullet.bulletType == AttackType.AOE)  {
                //AOE
                this.shooting._sysBullet = null;
            }
            else if(skillBullet.bulletType == AttackType.CALL_MONSTER)
            {

            }
            else {
                this.shooting._sysBullet = null;
            }
        }

        if (skillBullet)  {
            this.onCall(skillBullet);
        }

        if (this.pro.sysEnemy.moveType == MoveType.JUMP) {//跳跃
            if (now > this.jumpCD) {
                this.onJump();
                this.jumpCD = now + this.pro.sysEnemy.enemySpeed;
            }
            else {
                if (this.pro.move2D(this.pro.face2d))  {
                    //跳到目标点立马开火
                    if (now > this.jumpFireCD) {
                        if (skillBullet && skillBullet.bulletType == AttackType.AOE)  {
                            //AOE伤害
                            this.onAoe(skillBullet);
                        }
                        else  {
                            this.shootAc();
                        }
                        // this.jumpFireCD = now + this.pro.sysEnemy.enemySpeed;
                        this.jumpFireCD = now + 2000;
                    }

                }
            }
        }
        else {
            if (this.shooting._sysBullet) {
                if ((this.shooting._sysBullet.bulletType == AttackType.NORMAL_BULLET || this.shooting._sysBullet.bulletType == AttackType.RANDOM_BULLET)) {
                    this.onFire();
                }
            }
        }


        if (this.normalSb && this.normalSb.bulletType == AttackType.FLY_HIT) {
            //撞击
            if (now > this.st) {
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
        else  {
            this.pro.move2D(this.pro.face2d);
        }

        return false;
    }

    private st: number = 0;
    private status: number = 0;
    private onHit(): void {
        var now = Game.executor.getWorldNow();
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
                this.st = now + 3500;
                return;
            }
        }
        if (this.pro.normalizedTime > 0.5) {
            this.pro.setSpeed(8);
            this.pro.move2D(this.pro.face2d);
        }
    }

    /**aoe */
    private onAoe(bullet: SysBullet): void {
        BoomEffect.getEffect(this.pro, bullet.boomEffect);
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) <= bullet.attackAngle)  {
            Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
        }
    }

    /**开火 */
    private onFire(): void {
        var now = Game.executor.getWorldNow();
        if (now >= this.aist) {
            //Laya.stage.timer.clear(this,this.go);
            // this.run_ = false;
            this.aiCount++;
            //if (this.aiCount % 5 != 0) {
            this.shooting.now = now;
            // if (this.shooting.attackOk()) {
            var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
            this.shooting.starAttack(this.pro, GameAI.NormalAttack);
            //return true;
            this.aist = now + this.aicd;
            // this.aist = now + 2000;
            // }
            // } else {
            //     var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            //     this.pro.rotation(a);
            //     //Laya.stage.frameLoop(1,this,this.go);
            //     this.run_ = true;
            //     this.aist = now + 2000 + (1000 * Math.random());
            // }
        }
    }

    private callCD: number = 0;
    /**召唤 */
    private onCall(bullet: SysBullet): void  {
        var now = Game.executor.getWorldNow();
        if (bullet.bulletType == AttackType.CALL_MONSTER)  {
            if (bullet.callInfo != '0')  {
                if (now > this.callCD)  {
                    let callTime:number;
                    let infoAry: string[] = bullet.callInfo.split('|');
                    for (let i = 0; i < infoAry.length; i++)  {
                        let info: string[] = infoAry[i].split(',');
                        if (info.length == 3)  {
                            let monsterId: number = Number(info[0]);
                            let monsterNum: number = Number(info[1]);
                            callTime = Number(info[2]);
                            for (let k = 0; k < monsterNum; k++)  {
                                let monster: Monster = Monster.getMonster(monsterId, this.pro.hbox.cx, this.pro.hbox.cy);

                                let zhaohuan:ui.test.zhaohuanUI = new ui.test.zhaohuanUI();
                                Game.bloodLayer.addChild(zhaohuan);
                                zhaohuan.pos(this.pro.hbox.cx, this.pro.hbox.cy);
                                setTimeout(() => {
                                    zhaohuan.removeSelf();
                                }, 1500);
                            }
                        }
                    }
                    // this.callCD = now + this.pro.sysEnemy.enemySpeed;
                    this.callCD = now + callTime;
                }
            }
        }

    }

    

    private splitCD: number = 0;
    /**死亡分裂 */
    private onDieSplit(): void {
        let mRow: number = Math.floor(this.pro.hbox.cy / GameBG.ww);
        let mCol: number = Math.floor(this.pro.hbox.cx / GameBG.ww);
        let row1: number;
        let col1: number;
        let row2: number;
        let col2: number;
        row1 = mRow;
        col1 = mCol + 1;
        row2 = mRow + 1;
        col2 = mCol;
        if (mRow <= 10) {
            row1 = 10;
            row2 = 11;
        }
        else if (mRow >= Game.map0.endRowNum) {
            row1 = Game.map0.endRowNum;
            row2 = Game.map0.endRowNum - 1;
        }
        if (mCol <= 1) {
            col1 = 1;
            col2 = 2;
        }
        else if (mCol >= 11) {
            col1 = 11;
            col2 = 10;
        }
        let flag: number = this.pro.splitTimes + 1;
        let hp: number = this.pro.gamedata.maxhp / 2;
        let monster1: Monster = Monster.getMonster(this.pro.sysEnemy.id, col1 * GameBG.ww, row1 * GameBG.ww, 0.5, hp);
        monster1.splitTimes = flag;
        let monster2: Monster = Monster.getMonster(this.pro.sysEnemy.id, col2 * GameBG.ww, row2 * GameBG.ww, 0.5, hp);
        monster2.splitTimes = flag;
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
}
