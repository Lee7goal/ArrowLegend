import GameBG from "./GameBG";
import GameHitBox from "./GameHitBox";
import Game from "./Game";
import GamePro from "./GamePro";
import GridType from "./bg/GridType";
import MaoLineData from "./MaoLineData";
import SysSkill from "../main/sys/SysSkill";
import Hero from "./player/Hero";
//地图逻辑层
export default class GameMap0 extends Laya.Sprite {

    info:any = {};
    /** 半空碰撞组*/
    Aharr: GameHitBox[];//半空碰撞组
    /** 地面碰撞组*/
    Wharr: GameHitBox[];//地面碰撞组    
    /** 敌人组*/
    Eharr: GameHitBox[];//敌人组
    /** 主角组*/
    Hharr: GameHitBox[];//主角组
    
    /** 碰撞 主角的 伤害组*/
    Fharr: GameHitBox[];//碰撞伤害组

    Flyharr: GameHitBox[];//飞行碰撞组


    endRowNum:number = 0;


    private arrhb: GameHitBox;
    public ballistic: Laya.Sprite;
    //public laodings:Laya.Sprite;
    public map: any = {};
    private Amap: any = {};

    /**npc的碰撞盒 */
    npcHitBox:GameHitBox;

    /**门的碰撞盒 */
    doorHitBox:GameHitBox;
    
    constructor() {
        super();
        this.ballistic = new Laya.Sprite();
        //this.laodings  = new Laya.Sprite();
        this.arrhb = new GameHitBox(2, 2);
    }

    reset():void
    {
        this.Aharr = [];
        this.Wharr = [];
        this.Eharr = [];
        this.Hharr = [];
        this.Fharr = [];
        this.Flyharr = [];
        this.info = {};

        this.map = {};
        this.Amap = {};
        this.graphics.clear();
    }

    public drawMap(): void {
        this.npcHitBox = null;
        this._isNext = false;
        let hb: GameHitBox = null;

       this.reset();

        hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
        hb.setXY(0, GameBG.ww * 2);
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        this.Flyharr.push(hb);

        hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
        hb.setXY(0, GameBG.ww * (GameBG.MAP_ROW - 2));
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        this.Flyharr.push(hb);

        hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
        hb.setXY(GameBG.ww, 0);
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        this.Flyharr.push(hb);

        hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
        hb.setXY(GameBG.ww * (GameBG.MAP_COL - 2), 0);
        this.Wharr.push(hb);
        this.Aharr.push(hb);
        this.Flyharr.push(hb);

        // if(Game.BigMapMode==0){//如果不是大地图模式
        //     hb = new GameHitBox(GameBG.ww, GameBG.ww * (GameBG.hnum - 2));
        //     hb.setXY(0, GameBG.ww * 2);
        //     this.Wharr.push(hb);
        //     this.Aharr.push(hb);
        //     this.Flyharr.push(hb);

        //     hb = new GameHitBox(GameBG.ww, GameBG.ww * (GameBG.hnum - 2));
        //     hb.setXY(GameBG.ww * GameBG.wnum, GameBG.ww * 2);
        //     this.Wharr.push(hb);
        //     this.Aharr.push(hb);
        //     this.Flyharr.push(hb);
        // }

        

        var k: number = 0;
        for (var j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                let key: number = GameBG.arr0[k];
                // if (k < GameBG.arr0.length) {
                    this.info[j + "_" + i] = key;
                    if (GridType.isWall(key)) {
                        if (this.map[key]) {
                            hb = this.map[key];
                            hb.setRq(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                        } else {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.value = key;
                            hb.setXY(x, y);
                            this.Wharr.push(hb);
                            this.map[key] = hb;
                        }
                    }
                    else if(GridType.isRiverPoint(key)
                    || GridType.isRiverScale9Grid(key)
                    || GridType.isRiverScale9Grid2(key)
                    || GridType.isRiverRow(key)
                    || GridType.isRiverCol(key)
                    || GridType.isRiverPoint(key))
                    {
                        hb = new GameHitBox(GameBG.ww, GameBG.ww);
                        hb.setXY(x, y);
                        this.Wharr.push(hb);
                    }
                    else if (GridType.isFence(key)) {
                        hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                        hb.value = key;
                        hb.setXY(x - GameBG.ww, y);
                        this.Wharr.push(hb);
                    }
                    else if(GridType.isNpc(key))
                    {
                        this.npcHitBox = new GameHitBox(GameBG.ww * 11, GameBG.ww * 4);
                        this.npcHitBox.setXY(x - GameBG.ww * 5, y - GameBG.ww * 3);
                    }

                    if(key == 9999)
                    {
                        this.doorHitBox = new GameHitBox(GameBG.ww * 2, GameBG.ww * 2);
                        this.doorHitBox.setXY(x - GameBG.ww2, y - GameBG.ww2);
                    }
                k++;
            }
            // if (k >= GameBG.arr0.length) {
            //     break;
            // }
        }

        k = 0;
        for (var j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                var ww = GameBG.ww;
                var x = i * ww;//- (ww/2);
                var y = j * ww;
                // if (k < GameBG.arr0.length) {
                    let key = GameBG.arr0[k];
                    if (GridType.isWall(GameBG.arr0[k])) {
                        if (this.Amap[key]) {
                            hb = this.Amap[key];
                            hb.setVV(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                        } else {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.setXY(x, y);
                            this.Aharr.push(hb);
                            this.Amap[key] = hb;
                        }
                    }
                    else if (GridType.isFence(GameBG.arr0[k])) {
                        hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                        hb.setXY(x - GameBG.ww, y);
                        this.Aharr.push(hb);
                    }

                // }
                k++;
            }
            // if (k >= GameBG.arr0.length) {
            //     break;
            // }
        }


        // this.endRowNum = j - 1;

        // hb = new GameHitBox(GameBG.ww * (GameBG.wnum - 1), GameBG.ww);
        // hb.setXY(GameBG.ww, GameBG.ww * (j + 0));//原先是加1
        // this.Wharr.push(hb);
        // this.Aharr.push(hb);
        // this.Flyharr.push(hb);

        //最后放npc
        // if(this.npcHitBox)
        // {
        //     this.Wharr.push(this.npcHitBox);
        // }

        //传送门左侧
        // hb = new GameHitBox(GameBG.ww * (5+3), GameBG.ww * 2);
        // hb.setXY(0, GameBG.ww * 8);
        // this.Wharr.push(hb);
        // this.Aharr.push(hb);
        // this.Flyharr.push(hb);
        //传送门右侧
        // hb = new GameHitBox(GameBG.ww * 5, GameBG.ww * 2);
        // hb.setXY(GameBG.ww * 8, GameBG.ww * 8);
        // this.Wharr.push(hb);
        // this.Aharr.push(hb);
        // this.Flyharr.push(hb);
        this.alpha = 1;
        this.addChild(this.ballistic);
        //this.addChild(this.laodings);


        this.setDoor(false);
        
    }

    clearNpc():void
    {
        this._isNpc = false;
        // if(this.npcHitBox)
        // {
        //     this.Wharr.splice(this.Wharr.indexOf(this.npcHitBox),1);
            
        // }
        this.npcHitBox = null;
        this.graphics.clear();
        for (let i = 0; i < this.Wharr.length; i++) {
            var hb = this.Wharr[i];
            this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
        }
    }

    checkNpc():boolean
    {
        let bool:boolean = false;
        if(this.npcHitBox && Game.hero.hbox.hit(Game.hero.hbox,this.npcHitBox))
        {
            bool = true;
            this._isNpc = true;
            this.npcHitBox = null;
        }
        return bool;
    }

    checkDoor():boolean
    {
        let bool:boolean = false;
        if(this.doorHitBox && Game.hero.hbox.hit(Game.hero.hbox,this.doorHitBox))
        {
            bool = true;
            this.doorHitBox = null;
            Game.battleLoader.load();
        }
        return bool;
    }

    /**开关门 */
    public setDoor(isOpen:boolean):void{
        // let num:number = isOpen ? 0 : 3;
        // this.Wharr[this.Wharr.length - 2].setRq(0,GameBG.ww * 8,GameBG.ww * (5 + num), GameBG.ww * 2);
        // this.Wharr[this.Wharr.length - 2].setRq(0,GameBG.ww * 8,GameBG.ww * (5 + num), GameBG.ww * 2);
        this.graphics.clear();
        for (let i = 0; i < this.Wharr.length; i++) {
            var hb = this.Wharr[i];
            this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
        }
    }

    private futureBox: GameHitBox = new GameHitBox(1, 1);

    public chechHitHero_(vx: number, vy: number): boolean {
        return this.chechHit(Game.hero, vx, vy);
    }

    private _isNext:boolean = false;
    private _isNpc:boolean = false;
    public chechHit(gamepro: GamePro, vx: number, vy: number): boolean {
        if(this._isNext)
        {

            return true;
        }
        //穿墙
        let chuanqiangSkill:SysSkill = Game.skillManager.isHas(5007);
        //水上漂
        let waterSkill:SysSkill = Game.skillManager.isHas(5008);

        var hb = gamepro.hbox;
        var fb = this.futureBox;
        fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
        for (let i = 0; i < this.Wharr.length; i++) {
            let ehb = this.Wharr[i];
            if(gamepro == Game.hero)
            {
                if(i == 0 && ehb.hit(ehb, fb))
                {
                    // this._isNext = true;
                    // console.log("传送下一关");
                    // Game.battleLoader.load();
                    // return true;
                }
                if(chuanqiangSkill && (GridType.isWall(ehb.value) || GridType.isFence(ehb.value)))
                {
                    //穿墙术
                    continue;
                }
                if(waterSkill && ehb.value == 7777)
                {
                    //水上漂
                    continue;
                }

            }
            if (ehb.hit(ehb, fb)) {
                return true;
            }
        }
        return false;
    }

    public chechHitArrs(gamepro: GamePro, vx: number, vy: number , thbArr: GameHitBox[]): boolean {
        var hb = gamepro.hbox;
        var fb = this.futureBox;
        fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
        for (let i = 0; i < thbArr.length; i++) {
            let ehb = thbArr[i];
            if(ehb == hb){
                continue;
            }
            if (ehb.hit(ehb, fb)) {
                return true;
            }
        }
        return false;
    }

    public chechHit_arr(thb: GameHitBox, thbArr: GameHitBox[]): GameHitBox {
        let ehb: GameHitBox = null;
        for (let i = 0; i < thbArr.length; i++) {
            ehb = thbArr[i];
            if (ehb.hit(ehb, thb)) {
                return ehb;
            }
        }
        return null;
    }

    public chechHit_arr_all(thb: GameHitBox, thbArr: GameHitBox[]): GameHitBox[] {
        let arr:GameHitBox[] = null;
        let ehb: GameHitBox = null;
        for (let i = 0; i < thbArr.length; i++) {
            ehb = thbArr[i];            
            if (ehb.hit(ehb, thb)) {
                if(!arr)arr=[];
                arr.push(ehb);
            }
        }
        return arr;
    }

    /**找到所有的相交点、相交线、相交体 */
    public lineTest(arr:GameHitBox[],vv:MaoLineData):any[]{
        var ebh;
        var ebs:any[] = [];
        let l:MaoLineData;
        var sp;
        for (let i = 0; i < arr.length; i++) {            
            ebh = arr[i];

            l = ebh.getBottom();
            sp = vv.lineTest(l);            
            if(sp){
                ebs.push(sp);
                ebs.push(l);
                ebs.push(ebh);                
            }

            l = ebh.getTop();
            sp = vv.lineTest(l);
            if(sp){
                ebs.push(sp);
                ebs.push(l);
                ebs.push(ebh);
            }

            l = ebh.getLeft();
            sp = vv.lineTest(l);
            if(sp){
                ebs.push(sp);
                ebs.push(l);
                ebs.push(ebh);
            }

            l = ebh.getRight()
            sp = vv.lineTest(l);
            if(sp){
                ebs.push(sp);
                ebs.push(l);
                ebs.push(ebh);
            }
        }
        return ebs;
    }


    /**
     * 返回 最近的 碰撞线、碰撞点、碰撞体
     * @param vv 
     * @param arr 
     */
    public getPointAndLine(vv:MaoLineData,arr:GameHitBox[]):any[]{
        var ebs = this.lineTest(arr,vv);
        if(ebs.length<=0)return null;
        if(ebs.length==3)return ebs;
        var x0 = vv.x0;
        var y0 = vv.y0;
        var rs0 = null;
        var rs1 = null;
        var rs2 = null;
        var len = -1;
        for (let i = 0; i < ebs.length; i+=3) {
            var p = ebs[i];            
            var tlen = MaoLineData.len(x0,y0,p.x,p.y);
            //var g = Game.map0.ballistic.graphics;
            //g.drawCircle(p.x,p.y,5,0xff0000,0xff0000);
            if(len==-1){
                rs0 = p;
                rs1 = ebs[i+1];
                rs2 = ebs[i+2];
                len = tlen;
            }else if(tlen<len){
                rs0 = p;
                rs1 = ebs[i+1];
                rs2 = ebs[i+2];
                len = tlen;
            }
        }
        ebs.length = 2;
        ebs[0] = rs0;
        ebs[1] = rs1;
        ebs[2] = rs2;
        return ebs;
    }




    private fcount: number = 0;
    private sp: Laya.Point = new Laya.Point();
    private ep: Laya.Point = new Laya.Point();

    public drawBallistic(heron: number): void {
        Game.hero.hbox.setXY(Game.hero.sp2d.x, Game.hero.sp2d.y);
        var vx = Math.cos(heron) * GameBG.mw2;
        var vy = Math.sin(heron) * GameBG.mw2;
        var x0 = Game.hero.hbox.cx;
        var y0 = Game.hero.hbox.cy;
        this.sp.x = x0;
        this.sp.y = y0;
        this.fcount = 0;

        var g = this.ballistic.graphics;
        g.clear();
        for (let i = 0; i < 6000; i++) {

            this.arrhb.setVV(x0, y0, vx, vy);
            var ebh;// = this.chechHit_arr(this.arrhb,Game.e0.);

            // if( Game.e0.hbox.hit(Game.e0.hbox,this.arrhb) ){
            //     ebh = Game.e0.hbox;
            //     g.drawRect(this.arrhb.x,this.arrhb.y,this.arrhb.ww, this.arrhb.hh,null,"#ff0000");
            //     g.drawRect(ebh.x,ebh.y,ebh.ww, ebh.hh,"#00ff00","#00ff00");
            //     g.drawLine(this.sp.x,this.sp.y,x0,y0,"#ff0000");
            //     break;
            // } 

            ebh = this.chechHit_arr(this.arrhb, this.Wharr);
            if (ebh) {
                g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#ff0000");
                g.drawRect(ebh.x, ebh.y, ebh.ww, ebh.hh, "#00ff00", "#00ff00");
                g.drawLine(this.sp.x, this.sp.y, x0, y0, "#ff0000");
                this.sp.x = x0;
                this.sp.y = y0;

                if (this.fcount < 4) {
                    if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, -1 * vx, vy), this.Wharr)) {
                        vx = -1 * vx;
                        this.fcount++;
                    } else if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, vx, -1 * vy), this.Wharr)) {
                        vy = -1 * vy;
                        this.fcount++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            } else {
                g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#0000ff");
                x0 += vx;
                y0 += vy;
            }
        }

    }
}