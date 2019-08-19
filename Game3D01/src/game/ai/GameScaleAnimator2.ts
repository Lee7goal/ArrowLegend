import Monster from "../player/Monster";
import Game from "../Game";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";
import GameScaleAnimator from "./GameScaleAnimator";

/***击退的 */
export default class GameScaleAnimator2 extends GameScaleAnimator{
    

    constructor(){
        super();
        this.movelen   = GameBG.ww * 2.5;
        this.futureBox = new GameHitBox(1, 1);
        this.sp = new Laya.Point(0,0);
    }

    move(nt:number){
        var ww = this.movelen * nt;
        var vx = ww * Math.cos(this.rad);
        var vy = ww * Math.sin(this.rad);

        let nextX:number = this.sp.x + vx;
        let nextY:number = this.sp.y + vy

        if(nextX >= (GameBG.width - GameBG.ww2) || nextX <= GameBG.ww2 || nextY >= ((Game.map0.endRowNum - 1) * GameBG.ww) || nextY <= 10 * GameBG.ww)
        {
            return;
        }

        this.futureBox.setXY(nextX, nextY);
        var hits = Game.map0.Wharr;
        if( !Game.map0.chechHit_arr(this.futureBox,hits) ){
            this.ms.setXY2DBox(this.futureBox.x,this.futureBox.y);
        }
    }

    zoom(nt:number,zoom:number,ms:Monster){
        if(nt>1)nt = 1;
        if(nt<0.5)nt=0.5;
        nt = nt*1;                
        nt = Math.sin(Math.PI*(nt))
        if(nt<0)nt*=-1;

        let st = 0;
        st = zoom*0.8 *(1 - nt );
        st = zoom*0.2 + st ;
        ms.sp3d.transform.localScaleZ = st;

        st = zoom*0.2 *(1 - nt );
        st = zoom*1 + st ;
        ms.sp3d.transform.localScaleX = st;
    }

    public ai(ms:Monster):void{        
        if(this.starttime!=0)
         {  
            var now = Game.executor.getWorldNow(); 
            var zoom = ms.sysEnemy.zoomMode/100;          
            if(now >= this.starttime + this.playtime){
                ms.sp3d.transform.localScaleZ = zoom;
                ms.sp3d.transform.localScaleX = zoom;
                ms.sp3d.transform.localScaleY = zoom;                
                this.starttime = 0;
                this.ms = null;
            }else{
                if(!this.ms){
                    this.ms = ms;
                    this.rad = ms.face2d + Math.PI;
                    this.sp.x = ms.hbox.x;
                    this.sp.y = ms.hbox.y;
                    this.futureBox.setRq(this.sp.x,this.sp.y,ms.hbox.ww,ms.hbox.hh);
                }
                let nt = now - this.starttime;
                nt = nt/this.playtime;
                this.move(nt);
                this.zoom(nt,zoom,ms);
            }
         }
    }
}