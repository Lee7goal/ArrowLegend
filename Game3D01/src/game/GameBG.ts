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
import GameHitBox from "./GameHitBox";
import Hero from "./player/Hero";
//2d地图板块    
export default class GameBG extends Laya.Sprite {
    /**地图颜色 绿色1 蓝色2 黄色3 */
    static BG_TYPE:string;
    static BG_TYPE_NUM:number;

    static MAP_ROW: number;
    static MAP_COL: number;


    static MAP_ROW2: number;
    static MAP_COL2: number;

    static bgId:number;
    static bgWW:number;
    static bgHH:number;
    static bgCellWidth:number;


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
        GameBG.v3d.x = (xx - 6);
        let rowNum:number = GameBG.bgHH / GameBG.ww / 2;
        let delta:number = GameBG.bgHH % GameBG.ww;
        delta = delta / GameBG.ww;
        GameBG.v3d.z = (yy - rowNum + 0.5) / Game.cameraCN.cos0;
        return GameBG.v3d;
    }

    static arrsp: Sprite[] = [];

    static arr0: number[] = [];

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
    public _npcAni:Laya.View;

    public npcId:number = 0;

    constructor() {
        super();
        GameBG.gameBG = this;
        this.mySp = new Sprite();
        this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
        this.doorNumber = BitmapNumber.getFontClip(0.3);
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

    private npcP:Laya.Point = new Laya.Point();
    public drawR(hasBoss:boolean = false): void {
        this.npcId = 0;
        var img: Image;
        var ww: number = GameBG.ww;
        var k: number = 0;
        let sp: Sprite;
        let gType: number = 0;
        this.addChild(this._box);
        this.addChild(this.saw);

        var sprite:Laya.Image = new Laya.Image();
        this._box.addChild(sprite);
        sprite.texture = Laya.loader.getRes("h5/mapbg/"+GameBG.BG_TYPE_NUM+".jpg");
        sprite.sizeGrid = "584,711,51,72";
        sprite.size(GameBG.bgWW,GameBG.bgHH);

        // for(var i = 0; i < GameBG.bgHH / GameBG.bgCellWidth;i++) {
        //     for(var j = 0; j < GameBG.bgWW / GameBG.bgCellWidth;j++) {
        //         var sprite:Laya.Image = new Laya.Image();
        //         this._box.addChild(sprite);
        //         sprite.skin = "h5/mapbg/" + GameBG.bgId + "/" + j + "_" + i + ".jpg";
        //         // let tt:Laya.Texture = Laya.loader.getRes("h5/mapbg/" + GameBG.bgId + "/" + j + "_" + i + ".jpg");
        //         // console.log("地图",tt);
        //         // sprite.texture = tt;
        //         sprite.pos(i * GameBG.bgCellWidth,j * GameBG.bgCellWidth);
        //     }
        // }
        
        let index2:number = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            this.bgh += ww;
            if(GameBG.MAP_ROW % 2 == 0)
            {
                index2++;
            }
            for (let i = 0; i < GameBG.MAP_COL; i++) {

                gType = GameBG.arr0[k];
                img = new Image();
                // img.alpha = 0.3;
                // img.skin = (index2 % 2 == 0) ? GameBG.BG_TYPE + "/10.png" : GameBG.BG_TYPE + "/11.png";
                this._box.addChild(img);
                img.x = i * ww;//- (ww/2);
                img.y = j * ww;
                index2++;
                // let label:Laya.Label = new Laya.Label();
                // label.size(ww,ww);
                // img.addChild(label);
                // label.align = "center";
                // label.valign = "middle";
                // label.text = j + "," + i;
                // if(gType > 0)
                // {
                //     label.text = "" + gType;
                // }


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
                    this.npcId = gType;
                    // if(this.npcId == 1001)
                    // {
                    //     let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                    //     this._npcAni = new NPC();
                    // }
                    this.npcP.x = img.x + GameBG.ww2;
                    this.npcP.y = img.y;
                }

                if(gType == 9999)
                {
                    this._box.addChild(this._door);
                    this._door.pos(img.x - GameBG.ww2,img.y - GameBG.ww2);
                    this._door.skin = 'bg/door.png';
                }
                else if(gType == 8888)
                {
                    Hero.bornX = img.x;
                    Hero.bornY = img.y;
                }
                // }

                img.addChild(grid);
                k++;
            }
        }

        var k = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                // if (k > GameBG.arr0.length)  {
                //     continue;
                // }
                gType = GameBG.arr0[k];
                var shadow:Laya.Image = new Laya.Image();
                if((GridType.isWall(gType) || (gType == 1)))
                {
                    shadow.skin = GameBG.BG_TYPE + '/shitouying.png';
                    shadow.x = i * ww;
                    shadow.y = j * ww;
                    this._box.addChild(shadow);
                }
                else if((GridType.isTong(gType) || (gType == 2)))
                {
                    shadow.skin = GameBG.BG_TYPE + '/tongying.png';
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

        this.saw.clear();

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

        // for (let j = 0; j < GameBG.hnum; j++) {
        //     if (j % 2 == 0) {
        //         var left: Image = new Image();
        //         Game.frontLayer.addChild(left);
        //         left.skin = GameBG.BG_TYPE + "/border.png";
        //         left.x = 0;
        //         left.y = Math.floor(j / 2) * 128 - 1;
        //         left.mouseEnabled = false;

        //         var right: Image = new Image();
        //         Game.frontLayer.addChild(right);
        //         right.skin = GameBG.BG_TYPE + "/border.png";
        //         right.x = 0 + GameBG.wnum * ww;
        //         right.y = Math.floor(j / 2) * 128 - 1;
        //         right.mouseEnabled = false;
        //     }
        // }

        // this._topShadow.skin = "bg/yingzi.png";
        // this._topShadow.width = GameBG.ww * (GameBG.wnum + 1);
        // this._leftShadow.skin = "bg/yingzi.png";
        // this._leftShadow.height = GameBG.ww * GameBG.hnum - 10 * GameBG.ww;
        // this._leftShadow.y = GameBG.ww * 10 + 28;
        // this._leftShadow.x = GameBG.ww - 10;
        // Game.frontLayer.addChild(this._topShadow);
        // Game.frontLayer.addChild(this._leftShadow);
        // Game.frontLayer.addChild(this._top);

        // this._top.x = GameBG.ww2;
        // this._top.skin = GameBG.BG_TYPE + "/top.png";
        // this._bossImg.skin = GameBG.BG_TYPE + "/bosstou.png";
        // this._topShadow.y = 10 * GameBG.ww;

        
        // this._top.addChild(this._bossImg);

        
        // this.doorNumber.value = "" + Game.battleLoader.index;
        // this.doorNumber.pos(380,390);
        // this._top.addChild(this.doorNumber);
        
        // this._bossImg.visible = hasBoss;
        // this.doorNumber.visible = !this._bossImg.visible && Game.battleLoader.index > 0;
        // this._door.pos(281,418);

        

        // Game.frontLayer.addChild(this._bottom);
        // this._bottom.x = GameBG.ww2;
        // this._bottom.skin = GameBG.BG_TYPE + "/bottom.png";
        // this._bottom.y = (GameBG.MAP_ROW + 11 - 3) * GameBG.ww - GameBG.ww * 0.1;
        // this._bottom.height = 1000;

        //this.x = (Laya.stage.width - GameBG.MAP_COL * GameBG.ww) * 0.5;
        this.x = -GameBG.ww2;
        this.y = (Laya.stage.height -GameBG.bgHH) * 0.5;
        GameBG.cx = this.x;
        GameBG.cy = this.y;
        // GameBG.mcx = ((GameBG.wnum + 1) * (GameBG.ww)) / 2 - GameBG.mw2;
        // GameBG.mcy = (GameBG.hnum * GameBG.ww) / 2 - GameBG.mw2;

        // GameBG.mcx = (GameBG.MAP_COL * GameBG.ww) / 2;
        // GameBG.mcy = (GameBG.MAP_ROW * GameBG.ww) / 2;
        
        // let redLine:Laya.Image = new Laya.Image();
        // redLine.skin = "bg/hongtiao.png"
        // Game.frontLayer.addChild(redLine);
        // redLine.x = GameBG.ww * 5;
        // redLine.y = GameBG.ww * 18;
        // redLine.height = 500;
        // this.showNpc();
    }

    private showNpc():void
    {
        if(this._npcAni)
        {
            Game.topLayer.addChild(this._npcAni);
            this._npcAni.pos(this.npcP.x,this.npcP.y - 800);

            Laya.Tween.to(this._npcAni,{y:this.npcP.y},300,Laya.Ease.circIn);

            Game.bg.event(Game.Event_NPC);
        }
    }

    /**检测出现哪个npc  恶魔和胡子 */
    checkNpc():void
    {
        if(!Game.map0.checkNpc())
        {
            return;
        }
        Game.scenneM.battle.up(null);
        if(this.npcId == 1000)
        {
            this.npcId = 0;
            let lossRate:number = Game.hero.lossBlood();
            if(lossRate <= 0)
            {
                this.npcId = 1002;//恶魔
            }
            else if(lossRate <= 0.1)
            {
                this.npcId = 1002;//恶魔
            }
            else
            {
                // this.npcId = 1003;//胡子
                this.npcId = 1001;//胡子没做，先用天使
            }
        }

        if(this.npcId > 0)
        {
            let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
            this._npcAni = new NPC();
            this.showNpc();
        }
    }

    public clearNpc():void
    {
        Laya.Tween.to(this._npcAni,{scaleX:0.3},200,null,null,100);
        Laya.Tween.to(this._npcAni,{y:-300},300,Laya.Ease.circIn,new Laya.Handler(this,this.clearNpcCom),300);
    }

    private clearNpcCom():void
    {
        this._npcAni && this._npcAni.removeSelf();
        Game.map0.clearNpc();
        this.npcId = 0;
        this._npcAni = null;
        // Game.openDoor();
    }

    public setDoor(state:number):void{
        this._door.visible = state == 1;
    }

    public updateY(): void {
        var bgy: number = GameBG.cy - Game.hero.pos2.z;
        var u:boolean = false;
        if (bgy <= 0 && bgy >= Laya.stage.height - GameBG.bgHH) {
            //移动2D背景板
            Game.bg.y = bgy;
            //摄像机跟随主角
            Game.camera.transform.localPositionZ = Game.cameraCN.z + Game.hero.z;
            u = true;
        }
        else if(bgy < Laya.stage.height - GameBG.bgHH){
            //Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Laya.stage.height +  GameBG.bgHH);
            Game.bg.y = Laya.stage.height - GameBG.bgHH;
            Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y)/GameBG.ww/ Game.cameraCN.cos0;
        }
        else
        {
            //Game.camera.transform.localPositionZ = Game.cameraCN.z +  GameBG.cy;
            Game.bg.y = 0;
            Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y)/GameBG.ww/ Game.cameraCN.cos0;
        }

        var bgx: number = GameBG.cx - Game.hero.pos2.x;
        if (bgx <= -GameBG.ww2 && bgx >= (Laya.stage.width - GameBG.bgWW) + GameBG.ww2) {
            Game.camera.transform.localPositionX = Game.hero.x;
            Game.bg.x = bgx;
            u = true;
        }
        else if(bgx > -GameBG.ww2 ){
            Game.bg.x = -GameBG.ww2;
            Game.camera.transform.localPositionX = (GameBG.cx  -Game.bg.x)/GameBG.ww;
        }
        else{
            Game.bg.x = (Laya.stage.width - GameBG.bgWW) + GameBG.ww2;
            Game.camera.transform.localPositionX = (GameBG.cx  -Game.bg.x)/GameBG.ww;
        }

        if(u){
            
        }
        Game.updateMap();

    }
}