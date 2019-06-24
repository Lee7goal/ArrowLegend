import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D =Laya.Scene3D;
import GameBG from "./GameBG";

export default class Game{

    static sp3d:Sprite3D = new Sprite3D();
    static camera:Camera;
    static v3:Vector3 = new Vector3(0,0,0);
    static scene3d:Laya.Scene3D;
    static hero:Laya.Sprite3D;
    static bg:GameBG;
    static material_blinn:Laya.BlinnPhongMaterial;
    static box:Laya.MeshSprite3D;
    

    constructor(){
        //Laya.Scene3D
    }
}