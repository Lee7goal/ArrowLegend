import GameBG from "./GameBG";
import Camera = Laya.Camera;
import GameHitBox from "./GameHitBox";
import GameScirt from "./GameScrit";

export default class GameObj{
    static gameCamera:Camera;        
    static sp3d:Laya.Sprite3D;
    //敌方列表
    static earr:GameObj[] = [];
    
    private sp:Laya.Sprite3D;
    private ani:Laya.Sprite3D;
    private scene:Laya.Scene3D;
    private id:number = 0;

    private animator:Laya.Animator;
    private scaleValue:number = 0;
    private scaleDelta:number = 0;
    private _scale:Laya.Vector3 = new Laya.Vector3();

    private _pos  = new Laya.Vector3(GameBG.width/2, GameBG.height/2, 0);//屏幕坐标
    private _pos2 = new Laya.Vector3(GameBG.width/2, GameBG.height/2 + 200, 0);//实际坐标
    private _translate = new Laya.Vector3(0, 0, 0);
    private speed:number = 5;

    private isMy:boolean = false;

    private hbox:GameHitBox = new GameHitBox(GameBG.mw,GameBG.mw);

    constructor(scene3d:Laya.Scene3D,sprite3D:Laya.Sprite3D,noumenon:boolean=false){
        let camera:Camera = GameObj.gameCamera;
        this.scene = scene3d;
        // GameObj.sp3d = sprite3D;
        // this.scene.addChild(GameObj.sp3d);
        // this.sp = Laya.Loader.getRes("h5/toonbat1/toonbat1.lh");
        //this.scene.addChild(Laya.Loader.getRes("h5/toonbat1/toonbat1.lh"));
        if(noumenon){
            this.sp = this.scene.addChild( sprite3D ) as Laya.Sprite3D;
        }else{
            this.sp = this.scene.addChild( Laya.Sprite3D.instantiate(sprite3D, null, false) ) as Laya.Sprite3D;
        }
        //this.sp = GameObj.sp3d;
        //this.sp.url = GameObj.sp3d.url;
        //this.sp["ur" + "l"] = GameObj.sp3d.url;
        //let layaMonkeySon = this.scene.addChild( Laya.Sprite3D.instantiate(sprite3D, null, false) ) as Laya.Sprite3D;
        //let layaMonkeySon = Laya.Loader.getRes("h5/toonbat1/toonbat1.lh");
        //layaMonkeySon.transform.position = this._translate;
        //this.scene.addChild(layaMonkeySon);
        var aniSprite3d:Laya.Sprite3D = this.sp.getChildAt(0) as Laya.Sprite3D;
        this.ani = aniSprite3d;

        this.animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
        camera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);
        this.sp.transform.position = this._translate; 
        //this.sp.addComponent(new GameScirt());
        this.animator.play("Idle");
        //this.animator.play("Run");
        //console.log(this.sp);
        //console.log(GameObj.sp3d);
    }

    private luck:boolean = true;

    public play(ac:string):void{
        if(this.luck){
            this.luck = false;
            //this.animator
            //this.animator.getCurrentAnimatorPlayState().on(Laya.Event.COMPLETE,this,this.com);
            //this.ani.on(Laya.Event.COMPLETE,this,this.com)
            //this.animator
            //this.ani.on(Laya.Event.COMPLETE,this,this.com)
            
            this.animator.play(ac);
            Laya.stage.frameLoop(1,this,this.com);

        }
    }

    public com():void{
        //console.log("com , com , com , com !!" + this.animator.getCurrentAnimatorPlayState().normalizedTime );
        if( this.animator.getCurrentAnimatorPlayState().normalizedTime >=1 ){
            this.animator.play("Idle");
            Laya.timer.clear(this,this.com);
            this.luck = true;
        }
        
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
        //if( GameBG.gameBG.isHit(dx,dy) ){//this._pos2.x , this._pos2.y
        let bx:boolean = GameBG.gameBG.isHit(dx,this._pos2.y);
        let by:boolean = GameBG.gameBG.isHit(this._pos2.x,dy);
        if( !bx && by ){//y方向被阻挡
            dy = this._pos2.y;                
        }
        else if(bx && !by ){//x方向被阻挡
            dx = this._pos2.x;
        }
        //}
        if( GameBG.gameBG.isHit(dx,dy) ){//新坐标被阻挡
           return;
        }

        if(dx>GameBG.ww/2 && dx<Laya.stage.width - GameBG.ww/2){//x方向场景范围
            this._pos2.x  = dx;
        }
        if(dy>GameBG.ww/2 && dy<GameBG.gameBG.getBgh()){//y方向场景范围
            this._pos2.y  = dy;
        }

        var dy:number = GameBG.height/2 - this._pos2.y;
        if(this.isMy){
            if(dy<=0 && dy>Laya.stage.height -GameBG.gameBG.getBgh()){
                GameBG.gameBG.y = dy;
            }
        }
        this.update();
    }

    public update():void{
        this._pos.y =  this._pos2.y + GameBG.gameBG.y;
        //console.log("this._pos.y " ,this._pos.y);
        this._pos.x  = this._pos2.x;
        GameObj.gameCamera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);        
        this.sp.transform.position = this._translate;
        //console.log( " isok ", b);
        if( this.isMy ){
            GameBG.gameBG.updata(this._pos2.x,this._pos2.y);
        }
        this.hbox.setCenter(this._pos2.x,this._pos2.y);
    }

    public reset():void{
        this.sp.transform.position = this._translate;        
    }

}