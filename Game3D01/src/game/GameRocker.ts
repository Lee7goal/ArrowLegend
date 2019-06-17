import Sprite = Laya.Sprite;
    
export default class Rocker extends Laya.Sprite {

    private sp:Sprite = new Sprite();

    private sp0:Sprite = new Sprite();

    constructor(){
        super();
        this.sp.graphics.drawCircle(0,0,120,0xff0000,0xff0000);
        this.sp.alpha = 0.5;
        this.addChild(this.sp);

        
        this.sp0.graphics.drawCircle(0,0,60,0x00ff00);
        this.sp0.alpha = 0.5;
        this.addChild(this.sp0);
    }

    public reset():void{
        this.sp0.x = 0;
        this.sp0.y = 0;
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
        this.a3d = Math.atan2(this.y-yy,xx-this.x);

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
}