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
import GameInfrared from "../GameInfrared";

export default class HeroAI extends GameAI {

    static shoot: Shooting = new Shooting();

    private shootin: Shooting = HeroAI.shoot;

    private line: MaoLineData;

    private gi:GameInfrared;

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
        if (Game.hero.gamedata.hp > 0) {
            Game.hero.hurt(150);
        }
        if (Game.hero.gamedata.hp <= 0) {
            Game.hero.die();
            this.run_ = false;
        }
    }

    

    public starAi() {
        if(!this.gi){
            this.gi = new GameInfrared(Game.hero,2);
            this.gi.show = true;
        }

        if (Game.hero.gamedata.hp <= 0) {
            return;
        }

        if (Game.map0.Eharr.length > 1) {
            Game.map0.Eharr.sort(this.sore0);
        }
        if (Game.map0.Eharr.length > 0)  {
            Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
        }
        Game.hero.on(Game.Event_Short, this, this.short);
        this.shootin.at = 0.5;
        this.shootin.now = Game.executor.getWorldNow();
    }


    private b1: BulletRotate;
    private b2: BulletRotate;

    private skillIds: number[] = [20001, 20002, 20003];
    private skillDic: any = {};
    /**旋转 */
    private rotateBullet(): void  {
        let br: BulletRotate;
        let hudu: number = Math.PI / this.skillIds.length;
        let skillId: number;
        for (let i = 0; i < this.skillIds.length; i++)  {
            skillId = this.skillIds[i];
            br = this.skillDic[skillId + "_1"];
            if (!br)  {
                this.skillDic[skillId + "_1"] = BulletRotate.getBullet(skillId);
            }
            br = this.skillDic[skillId + "_1"];
            Game.layer3d.addChild(br.sp3d);
            br.move2D(hudu * i);

            br = this.skillDic[skillId + "_2"];
            if (!br)  {
                this.skillDic[skillId + "_2"] = BulletRotate.getBullet(skillId);
            }
            br = this.skillDic[skillId + "_2"];
            Game.layer3d.addChild(br.sp3d);
            br.move2D(Math.PI + hudu * i);
        }

    }

    public short(): void {
        var a: number = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
        Game.hero.rotation(a);
        // let moveSpeed: number = GameBG.ww / 2;
        // this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero);

        this.onShoot();

        if (Game.skillManager.isHas(1005))  {
            //连续射击
            Laya.timer.frameOnce(20, this, () => {
                this.onShoot();
            });
        }
    }

    private onShoot():void{
        let moveSpeed: number = GameBG.ww / 2;
        // moveSpeed = 4;

        let skillLen: number = Game.skillManager.skillList.length;

        if (Game.skillManager.isHas(1001))  {
            //正向箭+1
            if (!this.line) this.line = new MaoLineData(0, 0, GameBG.mw2, 0);
            this.line.rad(Game.hero.face2d + Math.PI / 2);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
            this.line.rad(Game.hero.face2d - Math.PI / 2);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
        }
        else
        {
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero);
        }
        

        if (Game.skillManager.isHas(1002))  {
            //背向箭
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI, Game.hero);
        }

        if (Game.skillManager.isHas(1003))  {
            //斜向箭
            let angle: number = 90;
            let num: number = 2;
            angle = angle / num;
            let hudu: number = angle / 180 * Math.PI;
            let count = Math.floor(num / 2);

            for (var i = 1; i <= count; i++) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + hudu * i, Game.hero);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d - hudu * i, Game.hero);
            }
        }

        if (Game.skillManager.isHas(1004))  {
            //两侧箭
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI * 0.5, Game.hero);
            this.shootin.short_arrow(moveSpeed, Game.hero.face3d - Math.PI * 0.5, Game.hero);
        }
    }

    public stopAi() {
        this.shootin.cancelAttack();
        Game.hero.off(Game.Event_Short, this, this.short);
    }

    

    public exeAI(pro: GamePro): boolean {
        this.gi.drawMoveline();
        var now = Game.executor.getWorldNow();
        // this.rotateBullet();
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
                            Game.selectEnemy(ero.linkPro_);
                            pro.rotation(a);
                            return this.shootin.starAttack(Game.hero, GameAI.NormalAttack);
                        }
                    }

                }
            }
            Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
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
