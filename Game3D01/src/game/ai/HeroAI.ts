import Game from "../Game";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Shooting from "./Shooting";
import GameBG from "../GameBG";
import MaoLineData from "../MaoLineData";
import Line3d from "../../shader/line3d";
import ArrowGameMove0 from "../move/ArrowGameMove0";
import HeroBullet from "../player/HeroBullet";
import BulletRotate from "../player/BulletRotate";
import SysSkill from "../../main/sys/SysSkill";
import GameInfrared from "../GameInfrared";
import SysBuff from "../../main/sys/SysBuff";
import App from "../../core/App";
import GameThorn from "../GameThorn";
import Session from "../../main/Session";

export default class HeroAI extends GameAI {

    static shoot: Shooting = new Shooting();

    private shootin: Shooting = HeroAI.shoot;

    private line: MaoLineData;

    constructor()  {
        super();
        
    }

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
        if (Game.hero.isWudi)  {
            return;
        }

        if (Game.hero.gamedata.hp > 0) {
            Game.hero.hurt(pro.hurtValue, false);
        }
        if (Game.hero.gamedata.hp <= 0) {
            Game.hero.die();
            this.run_ = false;
        }
    }


    public starAi() {


        if (Game.hero.gamedata.hp <= 0) {
            return;
        }

        if (Game.map0.Eharr.length > 1) {
            Game.map0.Eharr.sort(this.sore0);
        }
        if (Game.map0.Eharr.length > 0) {
            Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
        }
        Game.hero.on(Game.Event_Short, this, this.short);
        this.shootin.at = 0.5;
        this.shootin.now = Game.executor.getWorldNow();
    }


    private b1: BulletRotate;
    private b2: BulletRotate;


    private skillDic: any = {};
    /**旋转 */
    private rotateBullet(): void {
        let skillIds = Game.skillManager.getRotateSkills();
        let br: BulletRotate;
        let hudu: number = Math.PI / skillIds.length;
        let skillId: number;
        for (let i = 0; i < skillIds.length; i++) {
            skillId = skillIds[i];
            br = this.skillDic[skillId + "_1"];
            if (!br) {
                this.skillDic[skillId + "_1"] = BulletRotate.getBullet(skillId);
            }
            br = this.skillDic[skillId + "_1"];
            Game.layer3d.addChild(br.sp3d);
            br.move2D(hudu * i);

            br = this.skillDic[skillId + "_2"];
            if (!br) {
                this.skillDic[skillId + "_2"] = BulletRotate.getBullet(skillId);
            }
            br = this.skillDic[skillId + "_2"];
            Game.layer3d.addChild(br.sp3d);
            br.move2D(Math.PI + hudu * i);
        }

    }

    public short(ac:string): void {
        if (Game.e0_) {
            var a: number = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
            Game.hero.rotation(a);
        }

        if(ac == GameAI.closeCombat)
        {
            if(Game.e0_)
            {
                Game.hero.hurtValue = Math.floor(Game.hero.playerData.baseAttackPower * 1.5);
                Game.e0_.hbox.linkPro_.event(Game.Event_Hit, Game.hero);
            }
            return;
        }

        Game.playSound("fx_shoot.wav");
        let basePower: number = Game.hero.playerData.baseAttackPower;
        // let moveSpeed: number = GameBG.ww / 2;
        // this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero);

        this.onShoot(basePower);

        //连续射击
        let skill1005: SysSkill = Game.skillManager.isHas(1005);
        if (skill1005) {
            if (skill1005.curTimes == 1) {
                Laya.timer.frameOnce(15, this, () => {
                    this.onShoot(basePower * skill1005.damagePercent / 100);
                })
            }
            else {
                Laya.timer.frameOnce(15, this, () => {
                    this.onShoot(basePower * skill1005.damagePercent / 100);
                })
                Laya.timer.frameOnce(30, this, () => {
                    this.onShoot(basePower * skill1005.damagePercent / 100);
                })
            }
        }
    }

    private onShoot(basePower: number): void {
        let moveSpeed: number = GameBG.ww / 2;
        // moveSpeed = 2;

        let skillLen: number = Game.skillManager.skillList.length;

        //正向箭+1
        let skill1001: SysSkill = Game.skillManager.isHas(1001);
        if (skill1001) {
            if (!this.line) this.line = new MaoLineData(0, 0, GameBG.mw2, 0);
            this.line.rad(Game.hero.face2d + Math.PI / 2);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
            this.line.rad(Game.hero.face2d - Math.PI / 2);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);

            if (skill1001.curTimes >= 2) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100);
            }
        }
        else {
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower);
        }

        //背向箭
        let skill1002: SysSkill = Game.skillManager.isHas(1002);
        if (skill1002) {
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI, Game.hero, basePower * skill1002.damagePercent / 100);
        }

        //斜向箭
        let skill1003: SysSkill = Game.skillManager.isHas(1003);
        if (skill1003) {
            let angle: number = skill1003.curTimes == 1 ? 90 : 120;
            let num: number = 2 * skill1003.curTimes;
            angle = angle / num;
            let hudu: number = angle / 180 * Math.PI;
            let count = Math.floor(num / 2);

            for (var i = 1; i <= count; i++) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d - hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
            }
        }

        //两侧箭
        let skill1004: SysSkill = Game.skillManager.isHas(1004);
        if (skill1004) {
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d - Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
        }
    }

    public stopAi() {
        this.shootin.cancelAttack();
        Game.hero.off(Game.Event_Short, this, this.short);
    }

    

    public exeAI(pro: GamePro): boolean {

        if(Session.guideId == 1 || Session.guideId == 2)
        {
            return;
        }
        //this.gi.drawMoveline();
        var now = Game.executor.getWorldNow();
        Game.bg.checkNpc();

        if (Game.hero.isIce)  {
            return;
        }

        this.rotateBullet();
        //地刺
        let chuanqiangSkill: SysSkill = Game.skillManager.isHas(5007);
        if (!chuanqiangSkill)//有穿墙了可以过地刺
        {
            if (GameThorn.arr.length > 0) {
                for (var i = 0; i < GameThorn.arr.length; i++) {
                    let thorn:GameThorn = GameThorn.arr[i];
                    let thornBox: GameHitBox = thorn.hbox;
                    if (thorn.inDanger && Game.hero.hbox.hit(Game.hero.hbox, thornBox)) {
                        if (now > thornBox.cdTime) {
                            pro.event(Game.Event_Hit, thorn.diciPro);
                            thornBox.cdTime = now + 2000;
                        }
                    }
                }
            }
        }

        if(Session.isGuide)
        {
            if(Session.guideId == 3)
            {
                if(Game.map0.guideHitBox && Game.hero.hbox.hit(Game.hero.hbox, Game.map0.guideHitBox))
                {
                    Game.scenneM.battle && Game.scenneM.battle.up(null);
                    Game.scenneM.battle.setGuide("主角会自动攻击，移动中不会攻击。",2);
                    Game.map0.guideHitBox = null;
                    console.log("主角会自动攻击，移动中不会攻击");
                    return false;
                }
            }
        }

        if (this.run_) {
            this.moves();
            return;
        }

        if(Session.isGuide)
        {
            if(Session.guideId == 3)
            {
                // if(Game.map0.guideHitBox && Game.hero.hbox.hit(Game.hero.hbox, Game.map0.guideHitBox))
                // {
                //     Game.scenneM.battle && Game.scenneM.battle.up(null);
                //     Game.scenneM.battle.setGuide("主角会自动攻击，移动中不会攻击",2);
                //     Game.map0.guideHitBox = null;
                //     console.log("主角会自动攻击，移动中不会攻击");
                // }
                return false;
            }
        }
        

        if (Game.map0.Eharr.length > 0) {

            if (this.shootin.attackOk())  {
                var a: number = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                var facen2d_ = (2 * Math.PI - a);
                if (Game.e0_.gamedata.hp > 0 && this.shootin.checkBallistic(facen2d_, Game.hero, Game.e0_)) {
                    pro.rotation(a);
                    return this.starAttack();
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
                                Game.selectEnemy(ero.linkPro_);
                                pro.rotation(a);
                                return this.starAttack();
                            }
                        }

                    }
                }
                Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
                var a: number = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                pro.rotation(a);
                this.starAttack();
            }
        }
        else if (Game.TestShooting == 1 && this.shootin.attackOk()) {
            this.starAttack();
        }
        return true;
    }

    private starAttack():boolean
    {
        let isCloseCombat:boolean = GameHitBox.faceToLenth(Game.hero.hbox,Game.e0_.hbox) <= GameBG.ww*3;//GameBG.ww * Math.sqrt(1.5 * 1.5);
        let ac:string = "";
        if(isCloseCombat)
        {
            ac = GameAI.closeCombat;
            console.log("近战");
        }
        else
        {
            ac = GameAI.NormalAttack;
            console.log("远程");
        }
        return this.shootin.starAttack(Game.hero, ac);
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
