import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D =Laya.Scene3D;
import GameBG from "./GameBG";
import Rocker from "./GameRocker";
import GameMap0 from "./GameMap0";
import GamePro from "./GamePro";

export default class Game{

    static Event_PlayStop:string = "Game.Event_PlayStop";
    static Event_Short:string = "Game.Event_Short";
    static Event_Hit:string   = "Game.Event_Hit";

    static HeroArrows:GamePro[] = [];
    //3d层
    static layer3d:Sprite3D = new Sprite3D();
    //3d摄像机
    static camera:Camera;
    //临时v3
    //static v3:Vector3 = new Vector3(0,0,0);
    //3d场景
    static scene3d:Laya.Scene3D;
    //主英雄
    //static hero:Laya.Sprite3D;
    static hero:GamePro;
    //主敌人    
    static e0_:GamePro;
    //主箭    
    static a0:GamePro;

    //2d背景
    static bg:GameBG;
    //贴图材质
    static material_blinn:Laya.BlinnPhongMaterial;
    //墙块
    static box:Laya.Sprite3D;

    //栅栏
    static fence:Laya.Sprite3D;

    static bullet:Laya.MeshSprite3D;
    //摇杆
    static ro:Rocker;

    static cameraY:number = 10;

    static sqrt3:number = 10*Math.sqrt(3);

    static map0:GameMap0;

    static footLayer:Laya.Sprite = new Laya.Sprite();
    static bloodLayer:Laya.Sprite = new Laya.Sprite();

    static selectFoot:Laya.Sprite3D;
    static selectHead:Laya.Sprite3D;
    
    //static ani:Laya.Animator;

    static updateMap():void{
        if(Game.map0){
            if(Game.bg){
                Game.bloodLayer.pos(Game.bg.x,Game.bg.y);
                Game.footLayer.pos(Game.bg.x,Game.bg.y);
                Game.map0.pos(Game.bg.x,Game.bg.y);
            }
        }
    }

    constructor(){
        //Laya.Scene3D
    }
}