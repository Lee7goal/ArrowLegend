import Monster from "../player/Monster";
import Game from "../Game";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";
import GameScaleAnimator from "./GameScaleAnimator";

export default class GameScaleAnimator1 extends GameScaleAnimator{
    

    constructor(){
        super();
    }

    

    zoom(nt:number,zoom:number,ms:Monster){
        if(nt>1)nt = 1;           
        nt = Math.sin(Math.PI*(nt)*4);

        let st = 0;
        st = zoom*0.2*nt;
        st = zoom*0.8+st;
        ms.sp3d.transform.localScaleX = st;
        ms.sp3d.transform.localScaleZ = st;

        st = zoom*0.1*nt;
        st = zoom*1.1 - st; 
        ms.sp3d.transform.localScaleY = st;
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
            }else{
                let nt = now - this.starttime;
                nt = nt/this.playtime;                
                this.zoom(nt,zoom,ms);
            }
         }
    }
}