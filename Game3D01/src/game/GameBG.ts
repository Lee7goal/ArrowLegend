import Image = Laya.Image;
import GameConfig from "../GameConfig";
import Sprite = Laya.Sprite;
    
export default class GameBG extends Laya.Sprite{

    static wnum:number = 12;
    static hnum:number = 48;

    static width:number = 750;
    //static height:number = 1000;
    static height:number = 1334;

    static ww:number = GameBG.width/GameBG.wnum;//地形的碰撞方块尺寸
    static ww2:number = GameBG.ww/2;            // 1/2 地形的碰撞方块尺寸

    static fw:number  = GameBG.ww *0.2;
    static mw:number  = GameBG.ww-GameBG.fw;//主角的碰撞方块尺寸
    static mw2:number = GameBG.mw/2;        // 1/2 主角的碰撞方块尺寸

    static orthographicVerticalSize:number = GameBG.wnum*GameBG.height/GameBG.width;
    static gameBG:GameBG;

    static arrsp:Sprite[] = [];

    static arr0:number[] = [
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,1,0,0,0,1,0,0,0,0,0,
        0,0,1,1,1,0,1,1,1,0,0,0,0,
        0,0,0,1,0,0,0,1,0,0,0,0,0,   
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,1,0,0,0,0,
        0,0,0,0,0,0,0,1,1,1,0,0,0,
        0,0,0,0,0,0,0,0,1,1,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,1,0,1,0,0,0,0,0,
        0,0,0,0,0,1,0,1,0,0,0,0,0,
        0,0,0,0,0,1,1,1,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
    ];

    static arr:number[] = [
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,1,1,0,0,0,0,0,0,0,1,1,0,
        0,1,1,0,0,0,0,0,0,0,1,1,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,1,0,0,1,0,0,1,0,0,0,
        0,0,0,0,0,0,1,0,0,0,0,0,0,
        0,0,0,0,0,0,1,0,0,0,0,0,0,
        0,0,0,1,1,1,1,1,1,1,0,0,0,
        0,0,0,0,0,0,1,0,0,0,0,0,0,
        0,0,0,0,0,0,1,0,0,0,0,0,0,
        0,0,0,1,0,0,1,0,0,1,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,1,1,0,0,0,0,0,0,0,1,1,0,
        0,1,1,0,0,0,0,0,0,0,1,1,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0
    ];

    private bgh:number = 0;

    private mySp:Sprite;
    private sp:Sprite;

    public getBgh():number{
        return this.bgh;
    }

    public isHit(dx:number,dy:number):boolean{//,xx:number,yy:number
        var dx0 = dx - GameBG.mw2;
        var dy0 = dy - GameBG.mw2;
        var b:boolean = false;
        for (let i = 0; i < GameBG.arrsp.length; i++) {
            var element = GameBG.arrsp[i];
            if( this.isHit_(dx0,dy0,element) ){
                b = true;
            }   
        }
        return b;
    }

    private isHit_(dx:number,dy:number,d2:Sprite):boolean{
        return dx < d2.x + GameBG.ww &&
        dx + GameBG.mw > d2.x &&
        dy < d2.y + GameBG.ww &&
        GameBG.mw + dy > d2.y
    }

    constructor(){
        super();
        GameBG.orthographicVerticalSize = GameBG.wnum*Laya.stage.height/Laya.stage.width;
        GameBG.gameBG = this;

        this.mySp = new Sprite();
        this.mySp.graphics.drawRect(0,0,GameBG.mw,GameBG.mw,0x00ff00);
    }

    public updata(x:number , y:number):void{
        this.mySp.x = x - GameBG.mw2;
        this.mySp.y = y - GameBG.mw2;
    }

    public drawR():void{
        var img:Image;
        var k:number = 0;
        var ww:number =GameBG.ww;
        //GameBG.orthographicVerticalSize
        var sp:Sprite;
        for (let j = 0; j < GameBG.hnum; j++) {
            this.bgh += ww;
            for (let i = 0; i < GameBG.wnum+1; i++) {
                img = new Image();
                img.skin = (k%2==0)?"comp/g256h.jpg":"comp/g256l.jpg";
                this.addChild(img);
                img.x = i * ww - (ww/2);
                img.y = j * ww;
                
                //console.log(i,j);
                if( k < GameBG.arr.length && GameBG.arr[k]==1){
                    sp = new Sprite();
                    sp.graphics.drawRect(0,0,GameBG.ww,GameBG.ww,0xff0000);
                    sp.x = i * ww - (ww/2);
                    sp.y = j * ww;
                    this.addChild(sp);
                    this.sp = sp;
                    GameBG.arrsp.push(sp);
                }
                k++;
            }
        }
        this.addChild(this.mySp);
       // this.bgh = Laya.stage.height - this.bgh;
    }
}