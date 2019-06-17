import GameBG from "./GameBG";
import Camera = Laya.Camera;

export default class GameObj{
    static gameCamera:Camera;
    private sp:Laya.Sprite3D;
    private scene:Laya.Scene3D;
    private id:number = 0;

    private animator:Laya.Animator;
    private scaleValue:number = 0;
    private scaleDelta:number = 0;
    private _scale:Laya.Vector3 = new Laya.Vector3();

    private _pos  = new Laya.Vector3(GameBG.width/2, GameBG.height/2, 0);//屏幕坐标
    private _pos2 = new Laya.Vector3(GameBG.width/2, GameBG.height/2, 0);//实际坐标
    private _translate = new Laya.Vector3(0, 0, 0);
    private speed:number = 5;

    private isMy:boolean = false;    

    constructor(scene3d:Laya.Scene3D,sprite3D:Laya.Sprite3D){
        let camera:Camera = GameObj.gameCamera;
        this.scene = scene3d;
        this.sp = this.scene.addChild( Laya.Sprite3D.instantiate(sprite3D, this.scene, false) ) as Laya.Sprite3D;        
        var aniSprite3d:Laya.Sprite3D = this.sp.getChildAt(0) as Laya.Sprite3D;
        this.animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
        camera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);
        this.sp.transform.position = this._translate;
        //this.animator.play("Idle");
        //this.animator.play("Run");
    }

    public setIsMy(b:boolean):void{
        this.isMy = b;
    }

    public rotation(n:number):void{
        this.sp.transform.localRotationEulerY = n;
    }

    public setGameScale(size:number,fix:number = 1):void{
        this._scale.x = this._scale.y = this._scale.z = Math.abs(size) / fix;
        this.sp.transform.localScale = this._scale;
    }

    public getPos2():Laya.Vector3{
        return this._pos2;
    }

    public getPos0():Laya.Vector3{
        return this._pos;
    }

    public getSp():Laya.Sprite3D{
        return this.sp;
    }

    public getSpeed():number{
        return this.speed;
    }

    public move(n:number):void{
        var vx:number = this.speed * Math.cos(n);
        var vy:number = this.speed * Math.sin(n);
        var dx:number = this._pos2.x  + vx;
        var dy:number = this._pos2.y  + vy;

        if(dx>GameBG.ww/2 && dx<Laya.stage.width - GameBG.ww/2){
            this._pos2.x  = dx;
        }

        if(dy>GameBG.ww/2 && dy<GameBG.gameBG.getBgh()){
            this._pos2.y  = dy;
        }

        var dy:number = GameBG.height/2 - this._pos2.y;
        if(this.isMy){
            if(dy<=0 && dy>Laya.stage.height -GameBG.gameBG.getBgh()){
                GameBG.gameBG.y = dy;
            }
        }
                
        this._pos.y =  this._pos2.y + GameBG.gameBG.y;
        //console.log("this._pos.y " ,this._pos.y);
        this._pos.x  = this._pos2.x;
        this.update();
    }

    public update():void{
        var b = GameObj.gameCamera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);        
        this.sp.transform.position = this._translate;        

        console.log( " isok ", b);
    }
}