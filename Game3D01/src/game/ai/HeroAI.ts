import Game from "../Game";
import GameHitBox from "../GameHitBox";
import { GameAI } from "./GameAI";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import Shooting from "./Shooting";

export default class HeroAI extends GameAI {

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

    onDie(key):void{
        Game.executor && Game.executor.stop_();//全部停止
    }

    
    hit(pro: GamePro) {
        if (Game.hero.acstr == GameAI.Idle) {
            // Game.hero.play(GameAI.TakeDamage);
        }
        Game.hero.hurt(pro.hurtValue);
        if (Game.hero.gamedata.hp <= 0) {
            this.stopAi();
            Game.hero.setKeyNum(1);
            Game.hero.once(Game.Event_KeyNum,this,this.onDie);
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
