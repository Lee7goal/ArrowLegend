import Monster from "../player/Monster";
import Game from "../Game";
import GameBG from "../GameBG";
import GameHitBox from "../GameHitBox";
import GameScaleAnimator from "./GameScaleAnimator";

export default class GameScaleAnimator4 extends GameScaleAnimator{
    
    constructor(){
        super();
    }

    private flag:boolean = false;
    move(nt:number,ms:Monster){
        nt = nt * 100;
        if(nt>100)nt = 100;
        nt = Math.ceil(nt);
        // if(nt % 2 != 0)
        // {
            this.flag = !this.flag;
            ms.sp3d.transform.localPositionX = ms.sp3d.transform.localPositionX + (this.flag ? 0.1 : -0.1);
        // }
    }

    public ai(ms:Monster):void{ 
        if(this.starttime!=0)
         {  
            var now = Game.executor.getWorldNow();         
            if(now >= this.starttime + this.playtime){              
                this.starttime = 0;                
            }else{
                let nt = now - this.starttime;
                nt = nt/this.playtime;                
                this.move(nt,ms);
            }
         }
    }
}