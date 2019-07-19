import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GameProType from "../GameProType";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";

export default class MonsterBulletMove extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);
    public move2d(n: number, pro: GamePro, speed: number): boolean {
        pro.setSpeed(speed);
        if (pro.speed <= 0) return;

        if (pro.sysBullet.bulletBlock == 1) {
            //直线
            var vx: number = pro.speed * Math.cos(n);
            var vz: number = pro.speed * Math.sin(n);
            var x0: number = pro.hbox.cx;
            var y0: number = pro.hbox.cy;
            this.future.setVV(x0, y0, vx, vz);

            var ebh: GameHitBox;
            if (pro.sysBullet.bulletEjection == 1)  {
                var hits = Game.map0.Aharr;
                ebh = Game.map0.chechHit_arr(this.future, hits);
                if (ebh) {
                    if (pro.gamedata.bounce <= 0) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        this.hitEffect(pro);
                        return false;
                    }
                    pro.gamedata.bounce--;
                    if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, -1 * vx, vz), hits)) {
                        vx = -1 * vx;
                        //this.fcount++;
                    } else if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, vx, -1 * vz), hits)) {
                        vz = -1 * vz;
                        //this.fcount++;
                    } else {
                        this.hitEffect(pro);
                        return false;
                    }
                    //this.facen2d_ = (2*Math.PI - n);
                    n = 2 * Math.PI - Math.atan2(vz, vx);
                    pro.rotation(n);
                }
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                return true;
            }
            else  {
                if (pro.gamedata.proType == GameProType.HeroArrow) {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Eharr);
                } else {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Hharr);
                }

                if (ebh) {
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    pro.setSpeed(0);
                    if (ebh.linkPro_) {
                        ebh.linkPro_.event(Game.Event_Hit, pro);
                        pro.event(Game.Event_Hit, ebh.linkPro_);
                    }
                    this.hitEffect(pro);
                    return false;
                }
            }
            return true;
        }
        else {
            //抛物线
            var heroBox: GameHitBox = Game.hero.hbox;
            pro.curLen += speed;
            if (pro.curLen >= pro.moveLen) {
                pro.curLen = pro.moveLen;
            }
            var nn = pro.curLen / pro.moveLen;
            var vx = speed * Math.cos(n);
            var vz = speed * Math.sin(n);
            var dy = Math.sin((Math.PI * nn)) * 2;
            pro.sp3d.transform.localPositionY = 0.1 + dy;
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

            if (heroBox.hit(heroBox, pro.hbox)) {
                if (Game.hero) {
                    console.log("打中我了");
                    Game.hero.event(Game.Event_Hit, pro);
                    pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                    pro.setSpeed(0);
                }
                return false;
            }

            var hits = Game.map0.Aharr;
            ebh = Game.map0.chechHit_arr(this.future, hits);
            if (ebh) {
                console.log("打到东西了");
                this.hitEffect(pro);
                return false;
            }

            if (pro.curLen == pro.moveLen)  {
                console.log("打空了");
                this.hitEffect(pro);
                return false;
            }

            return true;
        }
    }

    private hitEffect(pro): void {
        pro.setSpeed(0);
        let boomEff: Laya.Sprite3D = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/10002/monster.lh"));
        Game.layer3d.addChild(boomEff);
        boomEff.transform.localPosition = pro.sp3d.transform.localPosition;
        // boomEff.transform.localPositionY = 0;
        setTimeout(() => {
            boomEff.removeSelf();
        }, 500);
    }
}

