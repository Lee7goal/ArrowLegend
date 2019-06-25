import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D =Laya.Scene3D;
import GameBG from "./GameBG";
import Rocker from "./GameRocker";

export default class Game{
    //3d层
    static sp3d:Sprite3D = new Sprite3D();
    //3d摄像机
    static camera:Camera;
    //临时v3
    static v3:Vector3 = new Vector3(0,0,0);
    //3d场景
    static scene3d:Laya.Scene3D;
    //主英雄
    static hero:Laya.Sprite3D;
    //2d背景
    static bg:GameBG;
    //贴图材质
    static material_blinn:Laya.BlinnPhongMaterial;
    
    static box:Laya.MeshSprite3D;
    //摇杆
    static ro:Rocker;

    static cameraY:number = 10;

    static sqrt3:number = 10*Math.sqrt(3);

    constructor(){
        //Laya.Scene3D
    }
}