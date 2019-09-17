import Sprite = Laya.Sprite;
import { ui } from "./../ui/layaMaxUI";
    
export default class Rocker extends ui.test.RockerViewUI{

    constructor(){
        super();
    }

    public reset():void{
        this.sp0.x = 0;
        this.sp0.y = 0;
    }

    public resetPos():void{
        this.x = Laya.stage.width / 2;
        this.y = Laya.stage.height - 200;
    }

    private a:number = 0;
    private a3d:number = 0;
    private speed:number = 0;

    public getA():number{
        return this.a;
    }

    public getA3d():number{
        return this.a3d;
    }

    public getSpeed():number{
        return this.speed;
    }

    public setSp0(xx:number,yy:number):void{
        let n:number = xx - this.x;
        let m:number = yy - this.y;
        this.a = Math.atan2(m,n);
        this.a3d = Math.atan2(this.y-yy,xx-this.x);//+Math.PI/2;

        let l:number = Math.sqrt(n*n + m*m);
        if(l>4){
            if(l > 80){
                l = 80;
                
                this.sp0.x = Math.cos(this.a) * l;
                this.sp0.y = Math.sin(this.a) * l;
                
            }else{
                this.sp0.x = n;
                this.sp0.y = m;
            }
            this.speed = 1;
        }else{
            this.reset();
            this.speed = 0;
        }

    }

    public setSp1(xx:number,yy:number):void{
        let n:number = xx - this.x;
        let m:number = Math.abs(n);
        if(m>35){
            n = 35 * (m/n);
        }
        this.sp0.x=n;

        n = yy - this.y;
        m = Math.abs(n);
        if(m>35){
            n = 35 * (m/n);
        }
        this.sp0.y = n;

        //this.sp0.y = yy - this.y;
    }

    public rotate(n:number):void{
        this.dir.rotation = (2*Math.PI - n) / Math.PI * 180 + 90;
    }
}