import GameBG from "./GameBG";
import GameHitBox from "./GameHitBox";
//地图逻辑层
export default class GameMap0 extends Laya.Sprite{

    private my:Laya.Sprite;
    private harr:GameHitBox[];

    private hb   :GameHitBox;
    private arrhb:GameHitBox;

    private ballistic:Laya.Sprite;

    private map:any = {};

    constructor(){
        super();
        this.my = new Laya.Sprite();
        this.my.graphics.drawRect(0,0,GameBG.mw,GameBG.mw,null,0x00ff00);
        this.ballistic = new Laya.Sprite();
        this.arrhb = new GameHitBox(2,2);

        // this.map[1] = 2;
        // for (let key in this.map) {
        //     let element = this.map[key];            
        // }
        // for (let value of this.map) {
            
        // }
    }

    public drawMap():void{
        let hb:GameHitBox = null;
        this.harr = [];
        this.map = {};
        this.graphics.clear();

        hb = new GameHitBox(GameBG.ww*(GameBG.wnum+1),GameBG.ww);
        hb.setXY(0,0);
        this.harr.push(hb);

        hb = new GameHitBox(GameBG.ww,GameBG.ww*(GameBG.hnum-2));
        hb.setXY(0,GameBG.ww*2);
        this.harr.push(hb);

        hb = new GameHitBox(GameBG.ww,GameBG.ww*(GameBG.hnum-2));
        hb.setXY(GameBG.ww*GameBG.wnum,GameBG.ww*2);
        this.harr.push(hb);

        hb = new GameHitBox(GameBG.ww*(GameBG.wnum-1),GameBG.ww);
        hb.setXY(GameBG.ww,GameBG.ww * (Math.ceil( GameBG.hnum/2 )+1));
        this.harr.push(hb);

        var k:number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {           
            for (let i = 0; i < GameBG.wnum+1; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                if( k < GameBG.arr.length && GameBG.arr0[k]>1){
                    let key = GameBG.arr0[k];
                    if(this.map[key]){
                        hb = this.map[key];
                        hb.setVV(hb.x,hb.y,x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                    }else{
                        hb = new GameHitBox(GameBG.ww,GameBG.ww);
                        hb.setXY(x,y);
                        this.harr.push(hb);
                        this.map[key] = hb;
                    }
                }
                k++;
            }
        }
        
        //传送门左侧
        hb = new GameHitBox(GameBG.ww*5,GameBG.ww);
        hb.setXY(0,GameBG.ww);
        this.harr.push(hb);
        //传送门右侧
        hb = new GameHitBox(GameBG.ww*5,GameBG.ww);
        hb.setXY(GameBG.ww*8,GameBG.ww);
        this.harr.push(hb);

        for (let i = 0; i < this.harr.length; i++) {
            hb = this.harr[i];
            this.graphics.drawRect(hb.left,hb.top,hb.ww,hb.hh,null,0xff0000);
        }



        this.addChild(this.my);
        this.my.x = GameBG.mcx;
        this.my.y = GameBG.mcy;
        hb = new GameHitBox(GameBG.mw,GameBG.mw);
        hb.setXY(this.my.x,this.my.y);
        this.hb = hb;
        this.alpha = 1;

        // this.graphics.drawLine(0,GameBG.ww,(GameBG.wnum+1)*GameBG.ww,GameBG.ww,"#ff0000");
        // this.graphics.drawLine(0,GameBG.ww*(GameBG.hnum-1),(GameBG.wnum+1)*GameBG.ww,GameBG.ww*(GameBG.hnum-1),"#ff0000");
        // this.graphics.drawLine(GameBG.ww,0,GameBG.ww,GameBG.ww*GameBG.hnum,"#ff0000");
        // this.graphics.drawLine(GameBG.ww*GameBG.wnum,0,GameBG.ww*GameBG.wnum,GameBG.ww*GameBG.hnum,"#ff0000");

        this.addChild(this.ballistic);
    }

    public chechHit(vx:number,vy:number):boolean{
        this.hb.setXY(this.my.x + vx , this.my.y + vy);
        for (let i = 0; i < this.harr.length; i++) {
            let ehb = this.harr[i];
            if(ehb.hit(ehb,this.hb)){
                return true;
            }
        }
        return false;
    }

    public chechHit_arr(thb:GameHitBox,thbArr:GameHitBox[]):GameHitBox{
        let ehb:GameHitBox = null;
        for (let i = 0; i < thbArr.length; i++) {
            ehb = thbArr[i];
            if(ehb.hit(ehb,thb)){
                return ehb;
            }
        }
        return null;
    }



    public updateMy(v3:Laya.Vector3):void{
        this.my.x = GameBG.mcx + v3.x;
        this.my.y = GameBG.mcy + v3.z;
    }

    private fcount:number = 0;

    private sp:Laya.Point = new Laya.Point();
    private ep:Laya.Point = new Laya.Point();

    public drawBallistic(heron:number):void{
        this.hb.setXY(this.my.x,this.my.y);        
        var vx = Math.cos(heron)*GameBG.mw2;
        var vy = Math.sin(heron)*GameBG.mw2;
        var x0 = this.hb.cx;
        var y0 = this.hb.cy;
        this.sp.x = x0;
        this.sp.y = y0;
        this.fcount = 0;

        var g = this.ballistic.graphics;
        g.clear();
        for (let i = 0; i < 600; i++) {

            this.arrhb.setVV(x0,y0,vx,vy);
            var ebh = this.chechHit_arr(this.arrhb,this.harr)

            if( ebh  ){
                //g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#00ff00");
                //g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00"); 
                g.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
                this.sp.x = x0;
                this.sp.y = y0;

                if(this.fcount<4){                              
                    if(!this.chechHit_arr( this.arrhb.setVV(x0,y0,-1*vx,vy),this.harr)){
                        vx = -1*vx;
                        this.fcount++;
                    }else if(!this.chechHit_arr( this.arrhb.setVV(x0,y0,vx,-1*vy),this.harr)){
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
        
    }
}