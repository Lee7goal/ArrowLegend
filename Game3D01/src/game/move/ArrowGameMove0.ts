import Game from "../Game";
import GameProType from "../GameProType";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import { GameMove } from "./GameMove";
import MaoLineData from "../MaoLineData";
import GameBG from "../GameBG";

export default class ArrowGameMove0 extends GameMove {

    private future: GameHitBox = new GameHitBox(2, 2);
    private speed:number = 0;
    private sp:Laya.Point = new Laya.Point();
    private st:number = 0;
    private n:number = 0;
    private cos:number = 0;
    private sin:number = 0;

    private arrowlen = GameBG.ww*0.7
    /**箭的长度 */
    private line = new MaoLineData(0,0,0,this.arrowlen);
    /**运动的矢量 */
    private vv = new MaoLineData(0,0,0,1);

    /**反弹次数 */
    private fcount:number = 0;

    /**反弹起点 */
    private fv:MaoLineData = null;


         //move2d(n: number, pro: GamePro, speed: number): boolean{return false}
    public move2d(n: number, pro: GamePro, speed: number,hitStop:boolean): boolean {
        if(speed==0)return;
        if(this.fv!=null){
            //n= 2 * Math.PI - this.facen2d_ ;            
            pro.rotation(2*Math.PI - this.fv.atan2());
            n = pro.face2d;            
            pro.setcXcY2DBox(this.fv.x1,this.fv.y1);
            this.fv = null;
            //return;
        }

        var now = Game.executor.getWorldNow();
        if(this.speed!=speed || this.n!=n){
            this.sp.x = pro.hbox.x;
            this.sp.y = pro.hbox.y;
            this.st = now;
            this.n = n;
            this.sin = Math.sin(n);
            this.cos = Math.cos(n);
            this.speed = speed;
        }
        var g = Game.map0.ballistic.graphics;
        //g.clear();

        //计算与敌人的碰撞
        var hits = Game.map0.Eharr;
        var box = pro.hbox;
        var line = this.line;
        line.reset00(box.cx,box.cy);
        line.rad(n);        
        //line.draw(g,"#00ff00");

        var vv = this.vv;       
        box = this.future.setRq(line.x1-GameBG.mw4,line.y1-GameBG.mw4,GameBG.mw2,GameBG.mw2);//箭头的碰撞体
        var enemy = Game.map0.chechHit_arr(this.future, hits);
        if(enemy){
            enemy.linkPro_.event(Game.Event_Hit, pro);
            pro.event(Game.Event_Hit, enemy.linkPro_);
            return false;
        }
        //box.draw(g,"#ff0000");

        box = this.future.setVV(line.x0, line.y0, line.x_len, line.y_len);//箭体的碰撞体
        var all = Game.map0.chechHit_arr_all(this.future, hits);
        if(all){
            vv.reset(line.x0,line.y0,line.x1,line.y1);            
            var rs = Game.map0.getPointAndLine(vv,all);
            if(rs){
                enemy = rs[2];
                enemy.linkPro_.event(Game.Event_Hit, pro);
                pro.event(Game.Event_Hit, enemy.linkPro_);
                return false;
            }
        }

        box = this.future.setVV(line.x1, line.y1, vx, vz);//箭头移动的碰撞体
        var all = Game.map0.chechHit_arr_all(this.future, hits);
        if(all){
            vv.reset(line.x0,line.y0,line.x1,line.y1);            
            var rs = Game.map0.getPointAndLine(vv,all);
            if(rs){
                enemy = rs[2];
                enemy.linkPro_.event(Game.Event_Hit, pro);
                pro.event(Game.Event_Hit, enemy.linkPro_);
                return false;
            }
        }
       
        


       //计算地形的碰撞与反弹
        hits = Game.map0.Aharr;
        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        box = this.future.setVV(line.x1, line.y1, vx, vz);//箭头移动的碰撞体
        //box.draw(g,"#ffffff");
        
        vv.reset(line.x1,line.y1,line.x1+vx,line.y1+vz);
        //vv.draw(g,"#000000");
        //g.drawCircle(vv.x0,vv.y0,5,null,0xff0000);

        
        var all = Game.map0.chechHit_arr_all(this.future, hits);
        if(all){
            // for (let k = 0; k < all.length; k++) {
            //     var element = all[k];
            //     element.draw(g,"#ff00ff");
            // }

            var rs = Game.map0.getPointAndLine(vv,all);
            if(rs){
                
                var p = <Laya.Point>rs[0];
                var l = <MaoLineData>rs[1];
                vv.reset(vv.x0,vv.y0,p.x,p.y);
                g.drawCircle(p.x,p.y,10,null,0xff0000);
                //vv.draw(g,"#00FFFF");                
                pro.setXY2D(pro.pos2.x + vv.x_len, pro.pos2.z + vv.y_len);

                //vv.resetLen(this.arrowlen);
                //vv.reset(line.x1,line.y1,line.x1+vx,line.y1+vz);
                l = vv.rebound(l);
                if(l){
                    l.resetlen(this.arrowlen);
                    l.draw(g,"#ffffff");
                }
                
            }
            if(this.fcount<=0){
                pro.die();
                return false;
            }else{ 
                this.fcount--;
                this.fv = l;               
                return true;
            }
        }
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

        return true;
    }

    public move2d0(n: number, pro: GamePro, speed: number,hitStop:boolean): boolean {
        //pro.rotation(n);
        pro.setSpeed(speed);
        if (pro.speed <= 0) return;

        var vx: number = pro.speed * Math.cos(n);
        var vz: number = pro.speed * Math.sin(n);
        var x0: number = pro.hbox.cx;
        var y0: number = pro.hbox.cy;
        this.future.setVV(x0, y0, vx, vz);

        var ebh: GameHitBox;
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
            return false;
        }


        var hits = Game.map0.Aharr;
        ebh = Game.map0.chechHit_arr(this.future, hits);
        if (ebh) {
            if (pro.gamedata.bounce <= 0) {
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                pro.setSpeed(0);
                pro.die();
                //console.log("碰住地面了");
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
                return false;
            }
            //this.facen2d_ = (2*Math.PI - n);
            n = 2 * Math.PI - Math.atan2(vz, vx);
            pro.rotation(n);
        }
        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);

        return true;
    }
}

