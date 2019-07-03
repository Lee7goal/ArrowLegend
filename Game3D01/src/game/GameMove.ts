import GamePro from "./GamePro";
import Game from "./Game";
import GameHitBox from "./GameHitBox";
import GameBG from "./GameBG";
import GameProType from "./GameProType";

export interface GameMove {
    move2d(n:number,pro:GamePro,speed:number):boolean;
}


export class SimpleGameMove implements GameMove {        
    move2d(n: number, pro: GamePro, speed: number):boolean {
        //pro.rotation(n);
        pro.setSpeed( speed );
        var vx:number = pro.speed * Math.cos(n);
        var vz:number = pro.speed * Math.sin(n);        
        pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
        return true;
    }
}

export class ArrowGameMove implements GameMove {
    private future:GameHitBox = new GameHitBox(2,2);    
    move2d(n: number, pro: GamePro, speed: number):boolean {
        //pro.rotation(n);
        pro.setSpeed( speed );
        if(pro.speed<=0)return;

        var vx:number = pro.speed * Math.cos(n);
        var vz:number = pro.speed * Math.sin(n);
        var x0:number = pro.hbox.cx;        
        var y0:number = pro.hbox.cy;        
        this.future.setVV(x0,y0,vx,vz);

        var ebh;
        if(pro.gamedata.proType==GameProType.HeroArrow){
            ebh = Game.map0.chechHit_arr(this.future,Game.map0.Eharr);
        }else{
            ebh = Game.map0.chechHit_arr(this.future,Game.map0.Hharr);
        }

        if(ebh ){
            pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
            pro.setSpeed(0);
            if( ebh.linkPro_ ){
                ebh.linkPro_.event(Game.Event_Hit,pro);
            }
            return false;
        }


        var hits = Game.map0.Aharr;
        ebh = Game.map0.chechHit_arr(this.future,hits);
        if(ebh ){
            if( pro.gamedata.bounce<=0 ){
                pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
                pro.setSpeed(0);
                return false;
            }
            pro.gamedata.bounce--;
            if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,-1*vx,vz),hits)){
                vx = -1*vx;
                //this.fcount++;
            }else if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,vx,-1*vz),hits)){
                vz = -1*vz;
                //this.fcount++;
            }else{
                return false;
            }
            //this.facen2d_ = (2*Math.PI - n);
            n  = 2*Math.PI  -  Math.atan2(vz,vx);
            pro.rotation(n);           
        }
        pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
        
        return true;
    }
}

export class PlaneGameMove implements GameMove {
    move2d(n: number, pro: GamePro, speed: number):boolean {
        var vx:number = pro.speed * Math.cos(n);
        var vz:number = pro.speed * Math.sin(n);
        if( Game.map0.chechHit(pro,vx,vz) ){
            if( vz!=0 && Game.map0.chechHit(pro,vx,0) ){
                vx = 0;
                vz = (vz<0?-1:1) * pro.speed;
            }
            if( vx!=0 && Game.map0.chechHit(pro,0,vz) ){
                vz = 0;
                vx = (vx<0?-1:1) * pro.speed;
            }
            if( Game.map0.chechHit(pro,vx,vz) ){
                return false;
            }
        } 
        pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
        return true;
    }
}