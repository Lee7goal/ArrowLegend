import Game from "../Game";
import GameProType from "../GameProType";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";
import MaoLineData from "../MaoLineData";
import GameBG from "../GameBG";
import HeroBullet from "../player/HeroBullet";
import SysSkill from "../../main/sys/SysSkill";

export default class ArrowGameMove0 extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);
    private speed: number = 0;
    private sp: Laya.Point = new Laya.Point();
    private st: number = 0;
    private n: number = 0;
    private cos: number = 0;
    private sin: number = 0;

    // private arrowlen = GameBG.ww * 0.7
    private arrowlen = 10;
    /**箭的长度 */
    private line = new MaoLineData(0, 0, 0, this.arrowlen);
    /**运动的矢量 */
    private vv = new MaoLineData(0, 0, 0, 1);

    /**反弹起点 */
    private fv: MaoLineData = null;

    /**弹射次数*/
    private ii:number = 1;

   

    //move2d(n: number, pro: GamePro, speed: number): boolean{return false}
    public move2d(n: number, pro: HeroBullet, speed: number, hitStop: boolean): boolean {
        if (pro.isDie)  {
            return false;
        }
        if (speed == 0) return false;

        
        if (this.fv != null) {
            //n= 2 * Math.PI - this.facen2d_ ;            
            pro.rotation(2 * Math.PI - this.fv.atan2());
            n = pro.face2d;
            pro.setcXcY2DBox(this.fv.x1, this.fv.y1);
            this.fv = null;
            //return;
        }

        var now = Game.executor.getWorldNow();
        if (this.speed != speed || this.n != n) {
            this.sp.x = pro.hbox.x;
            this.sp.y = pro.hbox.y;
            this.st = now;
            this.n = n;
            this.sin = Math.sin(n);
            this.cos = Math.cos(n);
            this.speed = speed;
        }

        //var g = Game.map0.ballistic.graphics;
        //g.clear();
        //计算与敌人的碰撞
        var hits = Game.map0.Eharr;
        
        if(pro.hit_blacklist){
            var tem = [];
            for (let i = 0; i < hits.length; i++) {
                var e = hits[i];
                if(!pro.checkBlackList(e)){
                    tem.push(e)
                }
            }
            hits = tem;
        }


        var box = pro.hbox;
        var line = this.line;
        line.reset00(box.cx, box.cy);
        line.rad(n);
        //line.draw(g,"#00ff00");
        var vv = this.vv;
        box = this.future.setRq(line.x1 - GameBG.mw4, line.y1 - GameBG.mw4, GameBG.mw2, GameBG.mw2);//箭头的碰撞体
        var enemy = Game.map0.chechHit_arr(this.future, hits);
        if (enemy ) {
            if(this.hitEnemy(enemy,pro)==0){
                return false;
            }
            else{
                return true;
            }
        }
        //box.draw(g,"#ff0000");

        //if (!pro.chuantouSkill)  {
            box = this.future.setVV(line.x0, line.y0, line.x_len, line.y_len);//箭体的碰撞体
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(line.x0, line.y0, line.x1, line.y1);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    enemy = rs[2];
                    if (enemy ) {
                        if(this.hitEnemy(enemy,pro)==0){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                }
           // }

            box = this.future.setVV(line.x1, line.y1, vx, vz);//箭头移动的碰撞体
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(line.x0, line.y0, line.x1, line.y1);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    enemy = rs[2];
                    if (enemy ) {
                        if(this.hitEnemy(enemy,pro)==0){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                }
            }
        }





        //计算地形的碰撞与反弹
        hits = Game.map0.Aharr;
        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        box = this.future.setVV(line.x1, line.y1, vx, vz);//箭头移动的碰撞体
        //box.draw(g,"#ffffff");

        vv.reset(line.x1, line.y1, line.x1 + vx, line.y1 + vz);
        //vv.draw(g,"#000000");
        //g.drawCircle(vv.x0,vv.y0,5,null,0xff0000);


        var all = Game.map0.chechHit_arr_all(this.future, hits);
        if (all) {
            // for (let k = 0; k < all.length; k++) {
            //     var element = all[k];
            //     element.draw(g,"#ff00ff");
            // }

            var rs = Game.map0.getPointAndLine(vv, all);
            if (rs) {

                var p = <Laya.Point>rs[0];
                var l = <MaoLineData>rs[1];
                vv.reset(vv.x0, vv.y0, p.x, p.y);
                //g.drawCircle(p.x, p.y, 10, null, 0xff0000);
                //vv.draw(g,"#00FFFF");                
                pro.setXY2D(pro.pos2.x + vv.x_len, pro.pos2.z + vv.y_len);

                //vv.resetLen(this.arrowlen);
                //vv.reset(line.x1,line.y1,line.x1+vx,line.y1+vz);
                l = vv.rebound(l);
                if (l) {
                    l.resetlen(this.arrowlen);
                    //l.draw(g, "#ffffff");
                }

            }
            // if (this.fcount <= 0) {
            //     pro.die();
            //     return false;
            // } else {
            //     this.fcount--;
            //     this.fv = l;
            //     return true;
            // }
            pro.fcount--;
            this.fv = l;
            if (pro.fcount <= 0) {
                pro.die();
                return false;
            }
        }
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

        if(Math.abs(pro.pos2.x) > 800 || Math.abs(pro.pos2.z) > 3000)//出了屏幕后销毁
        {
            pro.die();
        }

        return true;
    }

    private he_:GameHitBox;

    public sore0(g0: GameHitBox, g1: GameHitBox): number {
        if(!this.he_)return 0;
        return GameHitBox.faceToLenth(this.he_, g0) - GameHitBox.faceToLenth(this.he_, g1);
    }

    private hitEnemy(enemy:GameHitBox,pro:HeroBullet):number{            
        enemy.linkPro_.event(Game.Event_Hit, pro);

        if (pro.tansheSkill && this.ii>0){
            if(!pro.hit_blacklist){
                pro.hit_blacklist = [];            
            }
            pro.hit_blacklist.push(enemy);

            this.ii--;
            let arr = Game.map0.Eharr;
            for (let i = 0; i < arr.length; i++) {
                let e = arr[i];
                if(e!=enemy){
                    //pro.setcXcY2DBox(enemy.cx,enemy.cy);
                    pro.setXY2D(enemy.linkPro_.pos2.x, enemy.linkPro_.pos2.z);

                    var a: number = GameHitBox.faceTo3D(pro.hbox, e);
                    pro.rotation(a);
                    return 1;    
                }
            }

            pro.die();
            return 0;
        }

        if (!pro.chuantouSkill){

            if(!pro.hit_blacklist){
                pro.hit_blacklist = [];            
            }
            pro.hit_blacklist.push(enemy);

            pro.die();
            return 0;
        }

        pro.die();
        return 0;
    }

    
}

