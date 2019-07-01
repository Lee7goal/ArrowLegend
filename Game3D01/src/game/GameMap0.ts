import GameBG from "./GameBG";
import GameHitBox from "./GameHitBox";
import Game from "./Game";
import GamePro from "./GamePro";
//地图逻辑层
export default class GameMap0 extends Laya.Sprite{
    private harr :GameHitBox[];
    private arrhb  :GameHitBox;
    public ballistic:Laya.Sprite;
    //public laodings:Laya.Sprite;
    private map:any = {};
    constructor(){
        super();
        this.ballistic = new Laya.Sprite();
        //this.laodings  = new Laya.Sprite();
        this.arrhb = new GameHitBox(2,2);
    }

    public drawMap():void{
        //this.laodings.graphics.drawRect(0,0,Laya.stage.width + GameBG.ww,Laya.stage.height+GameBG.ww,"#00000");

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

        var k:number = 0;
        for (var j = 0; j < GameBG.hnum; j++) {           
            for (let i = 0; i < GameBG.wnum+1; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                if( k < GameBG.arr0.length && GameBG.arr0[k]>1){
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
            if(k>=GameBG.arr0.length){
                break;
            }
        }

        hb = new GameHitBox(GameBG.ww*(GameBG.wnum-1),GameBG.ww);
        hb.setXY(GameBG.ww,GameBG.ww * (j+1));
        this.harr.push(hb);
        
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

        this.alpha = 1;
        this.addChild(this.ballistic);
        //this.addChild(this.laodings);
    }

    private futureBox:GameHitBox = new GameHitBox(1,1);

    public chechHitHero_(vx:number,vy:number):boolean{
        return this.chechHit(Game.hero,vx,vy);
    }

    public chechHit(gamepro:GamePro,vx:number,vy:number):boolean{
        var hb = gamepro.hbox;
        var fb = this.futureBox;
        fb.setRq(hb.x+vx,hb.y+vy,hb.ww,hb.hh);
        for (let i = 0; i < this.harr.length; i++) {
            let ehb = this.harr[i];
            if(ehb.hit(ehb,fb)){
                return true;
            }
        }
        return false;
    }

    public getHarr():GameHitBox[]{
        return this.harr;
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
    
    private fcount:number = 0;
    private sp:Laya.Point = new Laya.Point();
    private ep:Laya.Point = new Laya.Point();

    public drawBallistic(heron:number):void{
        Game.hero.hbox.setXY(Game.hero.sp2d.x,Game.hero.sp2d.y);
        var vx = Math.cos(heron)*GameBG.mw2;
        var vy = Math.sin(heron)*GameBG.mw2;
        var x0 = Game.hero.hbox.cx;
        var y0 = Game.hero.hbox.cy;
        this.sp.x = x0;
        this.sp.y = y0;
        this.fcount = 0;

        var g = this.ballistic.graphics;
        g.clear();
        for (let i = 0; i < 6000; i++) {

            this.arrhb.setVV(x0,y0,vx,vy);
            var ebh;// = this.chechHit_arr(this.arrhb,Game.e0.);

            if( Game.e0.hbox.hit(Game.e0.hbox,this.arrhb) ){
                ebh = Game.e0.hbox;
                g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#ff0000");
                g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00");
                g.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
                break;
            } 

            ebh  = this.chechHit_arr(this.arrhb,this.harr);
            if( ebh  ){
                g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#ff0000");
                g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00"); 
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
                g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#0000ff");
                x0 += vx;
                y0 += vy;
            }
        }
        
    }
}