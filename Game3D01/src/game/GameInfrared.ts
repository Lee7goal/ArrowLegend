import Game from "./Game";
import MaoLineData from "./MaoLineData";
import GameBG from "./GameBG";
import GameHitBox from "./GameHitBox";
import ArrowGameMove0 from "./move/ArrowGameMove0";
import GamePro from "./GamePro";

/**红外线瞄准器 */
export default class GameInfrared{

    /**运动的矢量 */
    private vv = new MaoLineData(0, 0, 0, 1);
    /**运动的矢量 */
    private future: GameHitBox = new GameHitBox(2, 2);

    private redLines:Laya.Image[] = [];

    private nn:number = 1;

    private show_:boolean = false;

    private pro:GamePro;
    
    constructor(pro_:GamePro , nn_:number=1){
        this.nn = nn_;
        this.pro = pro_;
        for (let i = 0; i < this.nn; i++) {
            let redLine:Laya.Image = new Laya.Image();
            redLine.skin = "bg/hongtiao.png"
            //Game.frontLayer.addChild(redLine);
            redLine.anchorX = 0.5;
            redLine.anchorY = 0.5;
            redLine.alpha = 0.8;
            this.redLines.push( redLine );
        }
    }

    public get show():boolean{
        return this.show_;
    }

    public set show(b:boolean){
        this.show_ = b;
        if(this.show_){
            for (let i = 0; i < this.redLines.length; i++) {
                var e = this.redLines[i];
                Game.frontLayer.addChild(e);
            }
        }else{
            for (let i = 0; i < this.redLines.length; i++) {
                var e = this.redLines[i];
                e.removeSelf();
            }
        }
    }

    private moveline(n: number,x0:number,y0:number,clearg:boolean):MaoLineData[]{
        //console.log("n+++++++++++++",n);
        //var g = Game.map0.ballistic.graphics;
        var vv = this.vv;
        //var box;
        //if(g){
            //if(clearg)g.clear();
            // var line = this.line;
            // line.reset00(box.cx, box.cy);
            // line.rad(n);

            //计算地形的碰撞与反弹
            var hits = Game.map0.Aharr;
            //var hits = Game.map0.Wharr;
            var vx: number = GameBG.ww * 20 * Math.cos(n);
            var vz: number = GameBG.ww * 20 * Math.sin(n);
            this.future.setVV(x0, y0, vx, vz);//箭头移动的碰撞体
            //g.drawRect(this.future.left, this.future.top, this.future.ww, this.future.hh, null, 0xff0000);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            //console.log("all   ",all);
            
            if (all) {
                vv.reset(x0,y0,x0+vx,y0+vz);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    var p = <Laya.Point>rs[0];
                    let l = <MaoLineData>rs[1];
                    vv.reset(vv.x0, vv.y0, p.x, p.y);
                    //vv.draw(g,"#ff0000");

                    var l1 = new MaoLineData(vv.x0,vv.y0,p.x,p.y);

                    l = vv.rebound(l);
                    if (l) {
                        return [l1,l];
                    }
                    return [l1,null];
                }
            }
            //vv.reset(line.x1, line.y1, line.x1 + vx, line.y1 + vz);
            //vv.draw(g,"#ff0000");
            //line.draw(g,"#ff0000");
            //g.drawCircle(box.cx, box.cy, 30, 0xff0000, 0xff0000);
            return null;
       // }        
    }

    drawMoveline():void{
        if(!this.show_){
            return;
        }
        var hero = this.pro;
        let larr = this.moveline(hero.face2d,hero.hbox.cx,hero.hbox.cy,true);
        for (let i = 0; i < this.nn; i++) {
            if(!larr)break;

            let l0:MaoLineData = larr[0];
            let l1:MaoLineData = larr[1];

            var cp =  l0.getCenter();
            var redLine = this.redLines[i];
            Game.frontLayer.addChild(redLine);
            redLine.x = cp.x;
            redLine.y = cp.y;
            redLine.height = l0.getlen();
            redLine.rotation = l0.atan2()/Math.PI*180 + 270;

            if(l1){
                larr = this.moveline(l1.atan2(),l1.x0,l1.y0,false);
            }
            
        }
    }

}