import Image = Laya.Image;
import GameConfig from "../GameConfig";
import Sprite = Laya.Sprite;
import Game from "./Game";
import GridType from "./bg/GridType";
//2d地图板块    
export default class GameBG extends Laya.Sprite {
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
    static mw2: number = 24;
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
    private _bottom: Image = new Image();
    constructor() {
        super();
        console.log(GameBG.wnum, Laya.stage.height, Laya.stage.width);
        //GameBG.orthographicVerticalSize = GameBG.wnum*Laya.stage.height/Laya.stage.width;
        GameBG.gameBG = this;

        this.addChild(this._box);
        this.addChild(this._top);
        this._top.x = GameBG.ww2;
        this._top.skin = "bg/top.png";

        this.addChild(this._bottom);
        this._bottom.x = GameBG.ww2;


        this.mySp = new Sprite();
        this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
    }

    public setZhuan(box: Laya.MeshSprite3D): any {
        //throw new Error("Method not implemented.");
    }

    public updata(x: number, y: number): void {
        this.mySp.x = x - GameBG.mw2;
        this.mySp.y = y - GameBG.mw2;
    }

    public drawR(): void {
        var img: Image;
        var ww: number = GameBG.ww;
        var k: number = 0;
        let sp: Sprite;
        let gType: number = 0;

        for (let j = 0; j < GameBG.hnum; j++) {
            this.bgh += ww;
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                if (k > GameBG.arr0.length)  {
                    continue;
                }
                gType = GameBG.arr0[k];
                img = new Image();
                img.skin = (k % 2 == 0) ? "bg/10.png" : "bg/11.png";
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
                    grid.skin = 'bg/100.png';
                }
                else if (GridType.isThorn(gType)) {
                    grid.skin = 'bg/500.png';
                }
                else if (GridType.isRiverScale9Grid(gType) || GridType.isRiverRow(gType) || GridType.isRiverCol(gType)) {
                    gType = Math.floor(gType / 100) * 100 + gType % 10;
                    grid.skin = 'bg/' + gType + '.png';
                }
                else if(GridType.isFlower(gType))
                {
                    grid.skin = 'bg/' + gType + '.png';
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
                    shadow.skin = 'bg/shitouying.png';
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
                k++;
            }
        }

        for (let j = 0; j < GameBG.hnum; j++) {
            if (j % 2 == 0) {
                var left: Image = new Image();
                this._box.addChild(left);
                left.skin = "bg/border.png";
                left.x = 0;
                left.y = Math.floor(j / 2) * 128;
                left.mouseEnabled = false;

                var right: Image = new Image();
                this._box.addChild(right);
                right.skin = "bg/border.png";
                right.x = 0 + GameBG.wnum * ww;
                right.y = Math.floor(j / 2) * 128;
                right.mouseEnabled = false;
            }
        }

        this.addChild(this._bottom);
        this._bottom.skin = "bg/bottom.png";
        this._bottom.y = (GameBG.MAP_ROW + 11 - 2) * GameBG.ww - GameBG.ww * 0.1;
        this._bottom.height = 1000;

        this.x = 0 - GameBG.ww2;
        this.y = (Laya.stage.height - (GameBG.hnum * GameBG.ww)) / 2
        GameBG.cx = this.x;
        GameBG.cy = this.y;
        GameBG.mcx = ((GameBG.wnum + 1) * (GameBG.ww)) / 2 - GameBG.mw2;
        GameBG.mcy = (GameBG.hnum * GameBG.ww) / 2 - GameBG.mw2;
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