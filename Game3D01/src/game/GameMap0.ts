import GameBG from "./GameBG";
import GameHitBox from "./GameHitBox";
import Game from "./Game";
import GamePro from "./GamePro";
import GridType from "./bg/GridType";
//地图逻辑层
export default class GameMap0 extends Laya.Sprite{

    Aharr :GameHitBox[];//半空碰撞组
    Wharr :GameHitBox[];//地面碰撞组    
    Eharr :GameHitBox[];//敌人组
    Hharr :GameHitBox[];//主角组
    


    private arrhb  :GameHitBox;
    public ballistic:Laya.Sprite;
    //public laodings:Laya.Sprite;
    private map:any = {};
    private Amap:any = {};
    constructor(){
        super();
        this.ballistic = new Laya.Sprite();
        //this.laodings  = new Laya.Sprite();
        this.arrhb = new GameHitBox(2,2);
    }

    public drawMap():void{
        let hb:GameHitBox = null;
        this.Aharr = [];
        this.Wharr = [];
        this.Eharr = [];
        this.Hharr = [];        
        this.map = {};
        this.Amap = {};
        this.graphics.clear();

        hb = new GameHitBox(GameBG.ww*(GameBG.wnum+1),GameBG.ww);
        hb.setXY(0,GameBG.ww * 8);
        this.Wharr.push(hb);
        this.Aharr.push(hb);

        hb = new GameHitBox(GameBG.ww,GameBG.ww*(GameBG.hnum-2));
        hb.setXY(0,GameBG.ww*2);
        this.Wharr.push(hb);
        this.Aharr.push(hb);

        hb = new GameHitBox(GameBG.ww,GameBG.ww*(GameBG.hnum-2));
        hb.setXY(GameBG.ww*GameBG.wnum,GameBG.ww*2);
        this.Wharr.push(hb);
        this.Aharr.push(hb);

        var k:number = 0;
        for (var j = 0; j < GameBG.hnum; j++) {           
            for (let i = 0; i < GameBG.wnum+1; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                let key:number = GameBG.arr0[k];
                if( k < GameBG.arr0.length){
                    if(GridType.isWall(key)  
                    || GridType.isRiverPoint(key) 
                    || GridType.isRiverScale9Grid(key) 
                    || GridType.isRiverRow(key) 
                    || GridType.isRiverCol(key) 
                    || GridType.isRiverPoint(key) )
                    {
                        if(this.map[key]){
                            hb = this.map[key];
                            hb.setRq(hb.x,hb.y,x + GameBG.ww - hb.x,y + GameBG.ww - hb.y);
                        }else{
                           hb = new GameHitBox(GameBG.ww,GameBG.ww);
                           hb.setXY(x,y);
                           this.Wharr.push(hb);
                           this.map[key] = hb;
                       }
                    }
                     else if(GridType.isFence(key) ){
                        if(this.map[key]){
                            hb = this.map[key];
                            hb.setRq(hb.x - GameBG.ww,hb.y,x + GameBG.ww * 3 - hb.x,y + GameBG.ww - hb.y);
                        }else{
                           hb = new GameHitBox(GameBG.ww * 3,GameBG.ww);
                           hb.setXY(x,y);
                           this.Wharr.push(hb);
                           this.map[key] = hb;
                       }
                     }
                }
                k++;
            }
            if(k>=GameBG.arr0.length){
                break;
            }
        }

        k= 0;
        for (var j = 0; j < GameBG.hnum; j++) {           
            for (let i = 0; i < GameBG.wnum+1; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                if( k < GameBG.arr0.length){
                    let key = GameBG.arr0[k];
                    if(GridType.isWall(GameBG.arr0[k]))
                    {
                        if(this.Amap[key]){
                            hb = this.Amap[key];
                            hb.setVV(hb.x,hb.y,x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                        }else{
                            hb = new GameHitBox(GameBG.ww,GameBG.ww);
                            hb.setXY(x,y);
                            this.Aharr.push(hb);
                            this.Amap[key] = hb;
                        }
                    }
                    else if(GridType.isFence(GameBG.arr0[k]))
                    {
                        if(this.Amap[key]){
                            hb = this.Amap[key];
                            hb.setRq(hb.x - GameBG.ww,hb.y,x + GameBG.ww * 3 - hb.x,y + GameBG.ww - hb.y);
                        }else{
                           hb = new GameHitBox(GameBG.ww * 3,GameBG.ww);
                           hb.setXY(x,y);
                           this.Aharr.push(hb);
                           this.Amap[key] = hb;
                       }
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
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        
        //传送门左侧
        hb = new GameHitBox(GameBG.ww*5,GameBG.ww);
        hb.setXY(0,GameBG.ww * 9);
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        //传送门右侧
        hb = new GameHitBox(GameBG.ww*5,GameBG.ww);
        hb.setXY(GameBG.ww*8,GameBG.ww * 9);
        this.Wharr.push(hb);
        this.Aharr.push(hb);

        for (let i = 0; i < this.Wharr.length; i++) {
            hb = this.Wharr[i];
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
        for (let i = 0; i < this.Wharr.length; i++) {
            let ehb = this.Wharr[i];
            if(ehb.hit(ehb,fb)){
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

            // if( Game.e0.hbox.hit(Game.e0.hbox,this.arrhb) ){
            //     ebh = Game.e0.hbox;
            //     g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#ff0000");
            //     g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00");
            //     g.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
            //     break;
            // } 

            ebh  = this.chechHit_arr(this.arrhb,this.Wharr);
            if( ebh  ){
                g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#ff0000");
                g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00"); 
                g.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
                this.sp.x = x0;
                this.sp.y = y0;

                if(this.fcount<4){                              
                    if(!this.chechHit_arr( this.arrhb.setVV(x0,y0,-1*vx,vy),this.Wharr)){
                        vx = -1*vx;
                        this.fcount++;
                    }else if(!this.chechHit_arr( this.arrhb.setVV(x0,y0,vx,-1*vy),this.Wharr)){
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