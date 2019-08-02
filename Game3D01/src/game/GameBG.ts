import Image = Laya.Image;
import GameConfig from "../GameConfig";
import Sprite = Laya.Sprite;
import Game from "./Game";
import GridType from "./bg/GridType";
import BitmapNumber from "../core/display/BitmapNumber";
import App from "../core/App";
import Saw from "../main/scene/battle/saw/Saw";
import NPC_1001 from "../main/scene/battle/npc/NPC_1001";
import NPC_1002 from "../main/scene/battle/npc/NPC_1002";
import NPC_1003 from "../main/scene/battle/npc/NPC_1003";
//2d地图板块    
export default class GameBG extends Laya.Sprite {
    /**地图颜色 绿色1 蓝色2 黄色3 */
    static BG_TYPE:string;
    static MAP_ROW: number;
    /**地图恒星格子数*/
    static wnum: number = 12;
    /**地图纵向格子数*/
    static hnum: number = 49;
    /**舞台宽度*/
    static width: number = 750;
    //static width:number = 768;
    /**舞台高度*/
    static height: number = 1334;
    //static height:number = 1024;
    /**地形的碰撞方块尺寸*/
    static ww: number = GameBG.width / GameBG.wnum;
    /**1/2 地形的碰撞方块尺寸*/
    static ww2: number = GameBG.ww / 2;
    //主角的碰撞方块尺寸比例
    static fw: number = GameBG.ww * 0.4;
    //主角的碰撞方块尺寸
    static mw: number = GameBG.ww - GameBG.fw;
    //1/2 主角的碰撞方块尺寸
    static mw2: number = GameBG.mw / 2;
    //1/4 主角的碰撞方块尺寸
    static mw4: number = GameBG.mw / 4;
    //正交相机纵向尺寸
    static orthographicVerticalSize: number = GameBG.wnum * GameBG.height / GameBG.width;
    //2D地图
    static gameBG: GameBG;
    //地图居中坐标x
    static cx: number;
    //地图居中坐标y
    static cy: number;
    //地图居中格子i
    static ci: number = 6;
    //地图居中格子j
    static cj: number = 24;
    //主角中心坐标
    static mcx: number;
    //主角中心坐标
    static mcy: number;

    private static v3d: Laya.Vector3;

    private doorNumber:BitmapNumber;

    static get3D(xx: number, yy: number): Laya.Vector3 {
        if (!GameBG.v3d) {
            GameBG.v3d = new Laya.Vector3(0, 0, 0);
        }
        GameBG.v3d.x = (xx - GameBG.ci);
        GameBG.v3d.z = (yy - GameBG.cj) / Game.cameraCN.cos0;
        return GameBG.v3d;
    }

    static arrsp: Sprite[] = [];

    // static arr0:number[] = [
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,2,2,0,0,0,0,0,0,0,3,3,0,
    //     0,4,0,0,0,0,0,0,0,0,0,5,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,   
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,0,0,0,0,0,
    //     0,6,0,0,0,0,0,0,0,0,0,7,0,
    //     0,8,8,0,0,0,0,0,0,0,9,9,0        
    // ];

    static arr0: number[] = [];

    static arr: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0,
        0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 8, 0, 0, 5, 0, 0, 9, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 10, 1, 0, 0, 0, 0, 0, 0, 0, 11, 1, 0,
        0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 1, 11, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    static arr1: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
        0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    private bgh: number = 0;

    private mySp: Sprite;
    private sp: Sprite;

    public getBgh(): number {
        return this.bgh;
    }

    public isHit(dx: number, dy: number): boolean {//,xx:number,yy:number
        var dx0 = dx - GameBG.mw2;
        var dy0 = dy - GameBG.mw2;
        var b: boolean = false;
        for (let i = 0; i < GameBG.arrsp.length; i++) {
            var element = GameBG.arrsp[i];
            if (this.isHit_(dx0, dy0, element)) {
                b = true;
            }
        }
        return b;
    }

    private isHit_(dx: number, dy: number, d2: Sprite): boolean {
        return dx < d2.x + GameBG.ww &&
            dx + GameBG.mw > d2.x &&
            dy < d2.y + GameBG.ww &&
            GameBG.mw + dy > d2.y
    }

    private _box: Sprite = new Sprite();
    private _top: Image = new Image();
    private _bossImg:Image = new Image();
    private _bottom: Image = new Image();
    private _topShadow:Image = new Image();
    private _leftShadow:Image = new Image();
    private _door:Image = new Image();

    /**电锯 */
    public saw:Saw = new Saw();

    /**电锯信息 */
    private _sawInfo:any = {};
    private _sawInfoZong:any = {};
    private _npcAni:Laya.View;

    public npcId:number = 0;

    constructor() {
        super();
        GameBG.gameBG = this;
        this.mySp = new Sprite();
        this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
        this.doorNumber = App.getFontClip(0.5);
    }

    public setZhuan(box: Laya.MeshSprite3D): any {
        //throw new Error("Method not implemented.");
    }

    public updata(x: number, y: number): void {
        this.mySp.x = x - GameBG.mw2;
        this.mySp.y = y - GameBG.mw2;
    }

    public clear():void
    {
        this._box.removeChildren();
        this.saw.clear();

        this._sawInfo = {};
        this._sawInfoZong = {};

        this.npcId = 0;
        this._npcAni && this._npcAni.removeSelf();
        this._npcAni = null;
    }

    public drawR(hasBoss:boolean = false): void {
        var img: Image;
        var ww: number = GameBG.ww;
        var k: number = 0;
        let sp: Sprite;
        let gType: number = 0;
        this.addChild(this._box);
        this.addChild(this.saw);
        
        for (let j = 0; j < GameBG.hnum; j++) {
            this.bgh += ww;
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                if (k > GameBG.arr0.length)  {
                    continue;
                }
                gType = GameBG.arr0[k];
                img = new Image();
                img.skin = (k % 2 == 0) ? GameBG.BG_TYPE + "/10.png" : GameBG.BG_TYPE + "/11.png";
                this._box.addChild(img);
                img.x = i * ww;//- (ww/2);
                img.y = j * ww;


                // if(i==GameBG.ci && j==GameBG.cj){
                //     sp = new Sprite();
                //     sp.graphics.drawRect(0,0,GameBG.ww,GameBG.ww,0xff0000);
                //     sp.x = i * ww;
                //     sp.y = j * ww;
                //     this.addChild(sp);
                //     this.sp = sp;
                // }
                var grid:Image = new Image();
                if (GridType.isRiverPoint(gType)) {
                    grid.skin = GameBG.BG_TYPE + '/100.png';
                }
                else if (GridType.isThorn(gType)) {
                    grid.skin = GameBG.BG_TYPE + '/500.png';
                }
                else if (GridType.isRiverScale9Grid(gType) || GridType.isRiverScale9Grid2(gType) || GridType.isRiverRow(gType) || GridType.isRiverCol(gType)) {
                    gType = Math.floor(gType / 100) * 100 + gType % 10;
                    grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                }
                else if(GridType.isFlower(gType))
                {
                    grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                }
                else if(GridType.isSawHeng(gType))//横锯子
                {
                    if(this._sawInfo[gType] == null)
                    {
                        let hengAry:Laya.Point[] = [];
                        this._sawInfo[gType] = hengAry;
                    }
                    let p:Laya.Point = new Laya.Point(img.x,img.y);
                    this._sawInfo[gType].push(p);
                }
                else if(GridType.isSawZong(gType))//纵锯子
                {
                    if(this._sawInfoZong[gType] == null)
                    {
                        let hengAry:Laya.Point[] = [];
                        this._sawInfoZong[gType] = hengAry;
                    }
                    let p:Laya.Point = new Laya.Point(img.x,img.y);
                    this._sawInfoZong[gType].push(p);
                }
                else if(GridType.isNpc(gType))
                {
                    if(gType == 1001)
                    {
                        //天使
                        this.npcId = gType;
                    }
                    else if(gType == 1000)
                    {
                        //判断出哪个
                        if(Math.random() >= 0.5)
                        {
                            this.npcId = 1002;
                        }
                        else{
                            this.npcId = 1003;
                        }
                    }

                    if(this.npcId > 0)
                    {
                        let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                        this._npcAni = new NPC();
                        this._npcAni.pos(img.x + GameBG.ww2,img.y);
                    }
                }
                img.addChild(grid);
                k++;
            }
        }

        var k = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                if (k > GameBG.arr0.length)  {
                    continue;
                }
                gType = GameBG.arr0[k];
                var shadow:Laya.Image = new Laya.Image();
                if((GridType.isWall(gType) || (gType == 1)))
                {
                    shadow.skin = GameBG.BG_TYPE + '/shitouying.png';
                    shadow.x = i * ww;
                    shadow.y = j * ww;
                    this._box.addChild(shadow);
                }
                else if(GridType.isFence(gType))
                {
                    shadow.skin = 'bg/lanying.png';
                    shadow.width = 200;
                    shadow.x = i * ww - 64;
                    shadow.y = j * ww + 50;
                    this._box.addChild(shadow);
                }
                else if(GridType.isRiverCube(gType))
                {
                    shadow.skin = GameBG.BG_TYPE + '/900.png';
                    shadow.width = 122;
                    shadow.height = 134;
                    // shadow.width = 200;
                    shadow.x = i * ww - 28;
                    shadow.y = j * ww - 35;
                    this._box.addChild(shadow);
                }
                k++;
            }
        }

        //横
        for(let key in this._sawInfo)
        {
            let hengAry:Laya.Point[] = this._sawInfo[key];
            let pos:Laya.Point = hengAry[0];
            let ww:number = hengAry[1].x - hengAry[0].x + GameBG.ww;
            this.saw.addBg(pos.x,pos.y,ww,1);
        }
        //纵
        for(let key in this._sawInfoZong)
        {
            let zongAry:Laya.Point[] = this._sawInfoZong[key];
            let pos:Laya.Point = zongAry[0];
            let hh:number = zongAry[1].y - zongAry[0].y + GameBG.ww;
            this.saw.addBg(pos.x,pos.y,hh,2);
        }

        this.saw.updateSaw();

        for (let j = 0; j < GameBG.hnum; j++) {
            if (j % 2 == 0) {
                var left: Image = new Image();
                Game.frontLayer.addChild(left);
                left.skin = GameBG.BG_TYPE + "/border.png";
                left.x = 0;
                left.y = Math.floor(j / 2) * 128 - 1;
                left.mouseEnabled = false;

                var right: Image = new Image();
                Game.frontLayer.addChild(right);
                right.skin = GameBG.BG_TYPE + "/border.png";
                right.x = 0 + GameBG.wnum * ww;
                right.y = Math.floor(j / 2) * 128 - 1;
                right.mouseEnabled = false;
            }
        }

        this._topShadow.skin = "bg/yingzi.png";
        this._topShadow.width = GameBG.ww * (GameBG.wnum + 1);
        this._leftShadow.skin = "bg/yingzi.png";
        this._leftShadow.height = GameBG.ww * GameBG.hnum - 10 * GameBG.ww;
        this._leftShadow.y = GameBG.ww * 10 + 28;
        this._leftShadow.x = GameBG.ww - 10;
        // Game.frontLayer.alpha = 0
        Game.frontLayer.addChild(this._topShadow);
        Game.frontLayer.addChild(this._leftShadow);
        Game.frontLayer.addChild(this._top);

        this._top.x = GameBG.ww2;
        this._top.skin = GameBG.BG_TYPE + "/top.png";
        this._bossImg.skin = GameBG.BG_TYPE + "/bosstou.png";
        this._topShadow.y = 10 * GameBG.ww;

        this._top.addChild(this._door);
        this._top.addChild(this._bossImg);

        
        this.doorNumber.value = "" + Game.battleLoader.index;
        this.doorNumber.pos(380,390);
        this._top.addChild(this.doorNumber);
        
        this._bossImg.visible = hasBoss;
        this.doorNumber.visible = !this._bossImg.visible && Game.battleLoader.index > 0;
        this._door.pos(281,418);

        Game.frontLayer.addChild(this._bottom);
        this._bottom.x = GameBG.ww2;
        this._bottom.skin = GameBG.BG_TYPE + "/bottom.png";
        this._bottom.y = (GameBG.MAP_ROW + 11 - 3) * GameBG.ww - GameBG.ww * 0.1;
        this._bottom.height = 1000;

        this.x = 0 - GameBG.ww2;
        this.y = (Laya.stage.height - (GameBG.hnum * GameBG.ww)) / 2
        GameBG.cx = this.x;
        GameBG.cy = this.y;
        GameBG.mcx = ((GameBG.wnum + 1) * (GameBG.ww)) / 2 - GameBG.mw2;
        GameBG.mcy = (GameBG.hnum * GameBG.ww) / 2 - GameBG.mw2;

        if(this._npcAni)
        {
            Game.topLayer.addChild(this._npcAni);
        }
    }

    public clearNpc():void
    {
        Laya.Tween.to(this._npcAni,{scaleX:0.3},200,null,null,100);
        Laya.Tween.to(this._npcAni,{y:-100},300,Laya.Ease.circIn,new Laya.Handler(this,this.clearNpcCom),300);
    }

    private clearNpcCom():void
    {
        this._npcAni && this._npcAni.removeSelf();
        Game.map0.clearNpc();
        Game.openDoor();
    }

    public setDoor(state:number):void{
        this._door.skin = 'bg/door' + state + '.png';
    }

    public drawR0(): void {
        var img: Image;
        var k: number = 0;
        var ww: number = GameBG.ww;
        //GameBG.orthographicVerticalSize
        var sp: Sprite;
        for (let j = 0; j < GameBG.hnum; j++) {
            this.bgh += ww;
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                img = new Image();
                img.skin = (k % 2 == 0) ? "comp/g256h.jpg" : "comp/g256l.jpg";
                this.addChild(img);
                img.x = i * ww - (ww / 2);
                img.y = j * ww;

                //console.log(i,j);
                if (k < GameBG.arr.length && GameBG.arr[k] == 1) {
                    sp = new Sprite();
                    sp.graphics.drawRect(0, 0, GameBG.ww, GameBG.ww, 0xff0000);
                    sp.x = i * ww - (ww / 2);
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

    public updateY(): void {
        var bgy: number = GameBG.cy - Game.hero.pos2.z;
        if (bgy <= 0 && bgy >= Laya.stage.height - Game.bg.getBgh()) {
            //移动2D背景板
            Game.bg.y = bgy;
            //摄像机跟随主角
            Game.camera.transform.localPositionZ = Game.cameraCN.z + Game.hero.z;
            Game.updateMap();
        }
    }
}