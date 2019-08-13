import GamePro from "./GamePro";
import MaoLineData from "./MaoLineData";

export default class GameHitBox {

    private x_:number  = 0;
    private y_:number  = 0;
    private ww_:number = 2;
    private hh_:number = 2;
    private cx_:number = 1;
    private cy_:number = 1;
    private h2_:number = 1;
    private w2_:number = 1;

    private top_   :number  = 0;
    private left_  :number  = 0;
    private right_ :number  = 0;
    private bottom_:number  = 0;

    public value:number = -1;

    public cdTime:number = 0;

    constructor(ww:number,hh:number){
        this.ww_ = ww;
        this.hh_ = hh;
        this.h2_ = this.hh_/2;
        this.w2_ = this.ww_/2;
        this.setXY(0,0);
    }

    public linkPro_:GamePro;

    public setVV(x0:number,y0:number,vx:number,vy:number):GameHitBox{

        var ax = Math.abs(vx);
        var ay = Math.abs(vy);

        if(ax>0 && ay>0){
            this.ww_ = ax;
            this.hh_ = ay;
            this.h2_ = this.hh_/2;
            this.w2_ = this.ww_/2;
            this.setXY(Math.min(x0,x0+vx),Math.min(y0,y0+vy));
        }
        else if(ax==0 && ay>0){
            this.ww_ = 2;
            this.hh_ = ay;
            this.h2_ = this.hh_/2;
            this.w2_ = this.ww_/2;
            this.setXY(x0-1,Math.min(y0,y0+vy));
        }
        else if(ax>0 && ay==0){
            this.ww_ = ax;
            this.hh_ = 2;
            this.h2_ = this.hh_/2;
            this.w2_ = this.ww_/2;
            this.setXY(Math.min(x0,x0+vx),y0-1);
        }
        else{
            this.ww_ = 2;
            this.hh_ = 2;
            this.h2_ = this.hh_/2;
            this.w2_ = this.ww_/2;
            this.setXY(x0-1,y0-1);
        }

        return this;
    }

    public get ww():number{
        return this.ww_;
    }

    public get hh():number{
        return this.hh_;
    }

    public setXY(xx:number , yy:number):void{
        this.x_ = xx;
        this.y_ = yy;
        this.cx_ = this.x_ + this.w2_;
        this.cy_ = this.y_ + this.h2_;
        this.update();
    }

    public setCenter(xx:number , yy:number):void{
        this.cx_ = xx;
        this.cy_ = yy;
        this.x_ = this.cx_ - this.w2_;
        this.y_ = this.cy_ - this.h2_;
        this.update();
    }

    setRq(x:number,y:number,ww:number,hh:number):GameHitBox{
        this.ww_ = ww;
        this.hh_ = hh;
        this.h2_ = this.hh_/2;
        this.w2_ = this.ww_/2;
        this.setXY(x,y);
        return this;
    }

    private update():void{
        this.top_ = this.y_;
        this.left_ = this.x_;
        this.bottom_ = this.y_ + this.hh_;
        this.right_ = this.x_ + this.ww_;
    }

    public get cx():number{
        return this.cx_;
    }
    public get cy():number{
        return this.cy_;
    }
    public get x():number{
        return this.x_;
    }
    public get y():number{
        return this.y_;
    }
    //top left right bottom
    public get top():number{
        return this.top_;
    }
    public get bottom():number{
        return this.bottom_;
    }
    public get left():number{
        return this.left_;
    }
    public get right():number{
        return this.right_;
    }

    public hit(b0:GameHitBox , b1:GameHitBox):boolean{
        return b0.x < b1.right &&
        b0.right > b1.x &&
        b0.y < b1.bottom &&
        b0.bottom > b1.y
    }

    public static faceTo(my:GameHitBox , target:GameHitBox):number{
        var xx:number = target.cx - my.cx;
        var yy:number = target.cy - my.cy;
        return Math.atan2(yy,xx);
    }

    public static faceTo3D(my:GameHitBox , target:GameHitBox):number{
        var xx:number = target.cx - my.cx;
        var yy:number = my.cy - target.cy;
        return Math.atan2(yy,xx);
    }

    public static faceToLenth(my:GameHitBox , target:GameHitBox):number{
        var vx =  my.x - target.x ;
        var vy =  my.y - target.y ;
        return Math.sqrt(vx*vx + vy*vy);
    }

    public getLeft(l_:MaoLineData=null):MaoLineData{        
        return this.getLine(this.left,this.top,this.left,this.bottom,l_);
    }

    public getRight(l_:MaoLineData=null):MaoLineData{        
        return this.getLine(this.right,this.top,this.right,this.bottom,l_);
    }

    public getTop(l_:MaoLineData=null):MaoLineData{        
        return this.getLine(this.left,this.top,this.right,this.top,l_);
    }

    public getBottom(l_:MaoLineData=null):MaoLineData{        
        return this.getLine(this.left,this.bottom,this.right,this.bottom,l_);
    }

    private getLine(x0:number,y0:number,x1:number,y1:number,l_:MaoLineData):MaoLineData{
        var l = l_;
        if(!l){
            l = new MaoLineData(x0,y0,x1,y1);
        }else{
            l.reset(x0,y0,x1,y1);
        }        
        return l;
    }
}

