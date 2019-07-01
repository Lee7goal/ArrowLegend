import GamePro from "./GamePro";
import Game from "./Game";
import GameHitBox from "./GameHitBox";
import GameBG from "./GameBG";

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
        var x0:number = pro.hbox.x;        
        var y0:number = pro.hbox.y;        
        this.future.setVV(x0,y0,vx,vz);
        var ebh = Game.map0.chechHit_arr(this.future,Game.map0.getHarr());
        if(ebh ){
            if( pro.gamedata.bounce<=0 ){
                pro.setXY2D(pro.pos2.x+vx,pro.pos2.z+vz);
                pro.setSpeed(0);
                return false;
            }
            pro.gamedata.bounce--;
            if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,-1*vx,vz),Game.map0.getHarr())){
                vx = -1*vx;
                //this.fcount++;
            }else if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,vx,-1*vz),Game.map0.getHarr())){
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

export class HeroGameMove implements GameMove {
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

export class BulletGameMoveX implements GameMove {

    private future:GameHitBox = new GameHitBox(2,2);
    private sp:Laya.Point = new Laya.Point();
    private ep:Laya.Point = new Laya.Point();
    private pp:Laya.Point = new Laya.Point();

    private dx:number;
    private dy:number;
    private adx:number;
    private ady:number;
    private st:number;
    private vx:number;
    private vy:number;
    private avx:number;
    private avy:number;

    private fcount:number = 0;//反弹次数

    private sn:number;//初始角度
    private marr:number[] = [];

    private pro:GamePro;

    constructor(fcount:number, sn:number, pro:GamePro){
        this.pro = pro;
        this.fcount = fcount;
        this.sn = sn;
        this.sp.x = this.pro.hbox.x;
        this.sp.y = this.pro.hbox.y;
        this.pp.x = this.sp.x;
        this.pp.y = this.sp.y;
        this.marr = this.ballistic(pro);
        console.log(this.marr);
        
        this.go();
        
    }

    public go():void{
        if(this.marr.length>=4){
            this.sp.x = this.marr.shift();
            this.sp.y = this.marr.shift();
            this.ep.x = this.marr.shift();
            this.ep.y = this.marr.shift();
            this.pp.x = this.sp.x;
            this.pp.y = this.sp.y;

            this.dy = this.ep.y-this.sp.y;
            this.dx = this.ep.x-this.sp.x;
            this.ady = Math.abs(this.dy);
            this.adx = Math.abs(this.dx);
            this.sn = Math.atan2(this.dy,this.dx);

            this.vx = Math.cos(this.sn) * 1;
            this.vy = Math.sin(this.sn) * 1;
            this.avx = Math.abs(this.vx);
            this.avy = Math.abs(this.vy);

            this.st = Laya.Browser.now();
        }
    }

    public move2d(n: number, pro: GamePro, speed: number): boolean {
        
        var rs = this.exe();        
        this.pro.setXY2D(this.pp.x-pro.hbox.ww/2-GameBG.mcx,this.pp.y-GameBG.mcy-pro.hbox.ww/2);
        return rs;
        // pro.setXY2D(this.pp.x,this.pp.y);
        // return true;
    }

    private exe():boolean{

        if(this.marr.length<4)return false;

        if(this.pp.x == this.ep.x && this.pp.y == this.ep.y && this.marr.length>=4){
            this.go();           
        }

        var dt = Laya.Browser.now() - this.st;
        if(dt*this.avx >= this.adx){
            this.pp.x = this.ep.x;
        }else{
            this.pp.x = this.sp.x + (dt*this.vx);
        }

        if(dt*this.avy >= this.ady){
            this.pp.y = this.ep.y;
        }else{
            this.pp.y = this.sp.y + (dt*this.vy);
        }

        return true;
        
    }

    public ballistic(pro: GamePro):number[]{
        this.marr = [];
        //this.myhb.setXY(this.my.x,this.my.y);
        //Game.hero.hbox.setXY(Game.hero.sp2d.x,Game.hero.sp2d.y);
        this.future.setXY(this.pp.x,this.pp.y);        
        var vx = Math.cos(this.sn)*GameBG.mw2;
        var vy = Math.sin(this.sn)*GameBG.mw2;

        var x0 = this.pp.x;
        var y0 = this.pp.y;
        this.sp.x = x0;
        this.sp.y = y0;
        this.fcount = 0;

        //var g = this.ballistic.graphics;
        //g.clear();
        for (let i = 0; i < 600; i++) {
            //this.arrhb.setVV(x0,y0,vx,vy);
            this.future.setVV(x0,y0,vx,vy);
            var ebh = Game.map0.chechHit_arr(this.future,Game.map0.getHarr());

            if( ebh  ){
                //g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#00ff00");
                //g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00"); 
                //Game.map0.ballistic.graphics.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
                this.marr.push(this.sp.x);
                this.marr.push(this.sp.y);
                this.marr.push(x0);
                this.marr.push(y0);

                this.sp.x = x0;
                this.sp.y = y0;

                if(this.fcount<4){                              
                    if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,-1*vx,vy),Game.map0.getHarr())){
                        vx = -1*vx;
                        this.fcount++;
                    }else if(!Game.map0.chechHit_arr( this.future.setVV(x0,y0,vx,-1*vy),Game.map0.getHarr())){
                        vy = -1*vy;
                        this.fcount++;
                    }else{
                        break;
                    }
                }else{
                    break;
                }
            }else{
                //g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#0000ff");
                x0 += vx;
                y0 += vy;
            }
        }
        return this.marr;
    }
   
}
