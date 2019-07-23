import Game from "../Game";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import GameBG from "../GameBG";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import MonsterShooting from "./MonsterShooting";
import MonsterBulletAI from "./MonsterBulletAI";
import SplitSkill from "../skill/SplitSkill";
import Monster from "../player/Monster";
import App from "../../core/App";
import SysBullet from "../../main/sys/SysBullet";
import AttackType from "./AttackType";
import MonsterShader from "../player/MonsterShader";

//巡逻&攻击
export default class MonsterAI1 extends GameAI {
    private pro: Monster;
    private shooting: MonsterShooting = new MonsterShooting();

    private aicd = 0;
    private aist = 0;
    private movecd = 0;

    private collisionCd: number = 0;



    constructor(pro: Monster) {
        super();
        this.pro = pro;
        this.pro.play(GameAI.Idle);
        this.shooting.attackCd = pro.sysEnemy.enemySpeed;
        this.shooting._sysBullet = pro.sysBullet;
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
        if (this.pro.sysBullet.bulletMode > 0) {
            let bulletNum: number = this.pro.sysBullet.mixNum;
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
                let angle: number = this.pro.sysBullet.bulletAngle;
                angle = angle / 2;
                bulletNum = 15 + Math.ceil(Math.random() * 5);
                this.aicd = 4500;
                if (1 - Math.random() > 0.5) {
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
        if (this.pro.gamedata.hp <= 0) {
            this.die();
        } else {
            if (this.pro.acstr == GameAI.Idle) {
                this.pro.play(GameAI.TakeDamage);
            }
        }

        var ms = <Monster>this.pro;        
        if(MonsterShader.map[ms.sysEnemy.enemymode]){
            var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
            shader.setShader0(this.pro.sp3d,1);
            var now = Game.executor.getWorldNow();
            this.shaders = now + 250;
        }
    }

    private shaders:number = 0;

    die(): void {
        this.pro.die();
    }

    private aiCount: number = Math.floor(Math.random() * 5);

    exeAI(pro: GamePro): boolean {
        var now = Game.executor.getWorldNow();

        if(this.shaders>0 && now >= this.shaders){
            this.shaders = 0;
            var ms = <Monster>this.pro;        
            if(MonsterShader.map[ms.sysEnemy.enemymode]){
                var shader = <MonsterShader>MonsterShader.map[ms.sysEnemy.enemymode];
                shader.setShader0(this.pro.sp3d,0);
            }
        }

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

        
        if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
            if (now > this.collisionCd) {
                if (Game.hero.hbox.linkPro_) {
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
                    // pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                    this.collisionCd = now + 1000;
                }
            }
        }
        else if (now >= this.aist) {
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
            // }
            // } else {
            //     var a: number = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            //     this.pro.rotation(a);
            //     //Laya.stage.frameLoop(1,this,this.go);
            //     this.run_ = true;
            //     this.aist = now + 2000 + (1000 * Math.random());
            // }
        }
        if(this.isHasJump())
        if (now > this.movecd) {

            this.onJump();
            this.movecd = now + this.shooting.attackCd;
        }
        else{
            if(this.pro.move2D(this.pro.face2d))
            {
                
            }
        }

        return false;
    }

    
    private isHasJump():boolean
    {
        if (this.pro.sysEnemy.skillId.length > 0) {
            var arr: string[] = this.pro.sysEnemy.skillId.split(',');
            for (var m = 0; m < arr.length; m++) {
                let id: number = Number(arr[m]);
                if (id > 0) {
                    let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                    if (sysBullet.bulletType == AttackType.SPLIT)  {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    

    private onJump():void
    {
        let mRow: number = Math.floor(this.pro.hbox.cy / GameBG.ww);
        let mCol: number = Math.floor(this.pro.hbox.cx / GameBG.ww);

        let range: number = 2;

        let minCol = mCol - range;
        minCol = Math.max(minCol, 1);
        let maxCol = mCol + range;
        maxCol = Math.min(maxCol, 11);

        let minRow = mRow - range;
        minRow = Math.max(minRow, 10);
        minRow = mRow;
        let maxRow = mRow + range;
        maxRow = Math.min(maxRow, Game.map0.endRowNum);

        var info: any = Game.map0.info;
        console.log(mRow,mCol);
        var arr: number[][] = [];
        for (let i = minRow; i <= maxRow; i++) {
            for (let j = minCol; j <= maxCol; j++) {
                if(j == mRow && i == mCol)
                {
                    continue;
                }
                var key: number = info[i + "_" + j];
                if (key != null && key == 0) {
                    let aaa: number[] = [j,i];
                    arr.push(aaa);
                    console.log(j,i);
                }
            }
        }
        if (arr.length > 0)  {
            var rand: number = Math.floor(arr.length * Math.random());
            var toArr: number[] = arr[rand];
            console.log("跳跃", toArr);
            let toX = toArr[0] * GameBG.ww;
            let toY = toArr[1] * GameBG.ww;

            this.pro.curLen = 0;
            this.pro.moveLen = Math.sqrt((this.pro.hbox.cy - toY) * (this.pro.hbox.cy - toY) + (this.pro.hbox.cx - toX) * (this.pro.hbox.cx - toX));
        }
    }

    // private go():void{
    //     this.pro.move2D(this.pro.face2d);
    // }

    starAi() {
        this.run_ = true;
        this.shooting.now = Game.executor.getWorldNow();
        this.shooting.st = this.shooting.now + this.shooting.attackCd;
    }
    stopAi() {
        //Laya.stage.timer.clear(this,this.go);
        this.run_ = false;
        this.shooting.cancelAttack();
    }
}
