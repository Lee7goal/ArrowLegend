import GameHitBox from "./GameHitBox";
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;
import GameBG from "./GameBG";
import Game from "./Game";
import { GameMove } from "./GameMove";
import { GameAI, HeroAI } from "./GameAI";
import GameData from "./GameData";

export default class GamePro extends Laya.EventDispatcher{    
    //  id  :number;
    //  name:String;
    private gamedata_:GameData;
    private movef:GameMove;
    private gameAI:GameAI;

    private speed_:number = 5;
    private hbox_:GameHitBox;
    private sp2d_:Laya.Sprite;
    private _pos2:Laya.Vector3 = new Laya.Vector3(0,0,0);
    private sp3d_:Sprite3D;
    private ani_:Animator;
    private moven2d_:number;    
    private facen2d_:number;
    private facen3d_:number;
    private acstr_:string = "";
    

    constructor(proType_:number){
        super();
        this.gamedata_ = new GameData();
        this.gamedata_.proType = proType_;
    }

    public setSp3d(sp:Sprite3D):void{
        this.sp3d_ = sp;
        this.hbox_ = new GameHitBox(GameBG.mw,GameBG.mw);
        this.hbox_.linkPro_ = this;
        this.hbox_.setCenter(GameBG.mcx,GameBG.mcy);
        let aniSprite3d = sp.getChildAt(0) as Sprite3D;
        if(aniSprite3d){
            this.ani_ = aniSprite3d.getComponent(Laya.Animator) as Animator;
        }
        this.on(Game.Event_Hit,this,this.hit);
    }

    public get animator():Animator{
        return this.ani_;
    }

    private _hat:Sprite3D;
    public addSprite3DToAvatarNode(nodeName:string,sprite3d:Sprite3D):void{
        this._hat = sprite3d;
        this.ani_.linkSprite3DToAvatarNode(nodeName,sprite3d);
        Game.layer3d.addChild(sprite3d);
    }

    public removeSprite3DToAvatarNode():void
    {
        this.ani_.unLinkSprite3DToAvatarNode(this._hat);
    }

    private hit(array:any){
        var a:GamePro = <GamePro>array[0];        
        if(this.gameAI){
            this.gameAI.hit(a)
        }
    }

    public get acstr():string{
        return this.acstr_;
    }

    public get face2d():number{
        return this.facen2d_;
    }

    public get face3d():number{
        return this.facen3d_;
    }

    public get speed():number{
        return this.speed_;
    }

    public setSpeed(speed:number):void{
        this.speed_ = speed;
    }

    public setGameMove(gamemove:GameMove){
        this.movef = gamemove;
    }

    public setGameAi(gameAI:GameAI):GameAI{
        this.gameAI = gameAI;
        return this.gameAI;
    }

    public get hbox():GameHitBox{
        if(!this.hbox_){
            this.hbox_ = new GameHitBox(GameBG.mw,GameBG.mw);
            this.hbox_.setXY(GameBG.mcx,GameBG.mcy);        
        }
        return this.hbox_
    }

    public get sp2d():Laya.Sprite{
        if(!this.sp2d_){
            this.sp2d_ = new Laya.Sprite();        
            this.sp2d.graphics.drawRect(0,0,GameBG.mw,GameBG.mw,null,0xff0000);
            this.sp2d.x = this.hbox.x;
            this.sp2d.y = this.hbox.y;
        }
        return this.sp2d_;
    }

    public get sp3d():Laya.Sprite3D{
        return this.sp3d_;
    }

    public play(actionstr:string):void{
        this.acstr_ = actionstr;
        this.ani_.play(actionstr);
        //console.log( this.acstr , " : " , this.ani_.getCurrentAnimatorPlayState);
        if( this.acstr!=GameAI.Run &&  this.acstr!=GameAI.Idle ){
            Laya.stage.frameLoop(1,this,this.ac0);            
        }else{
            Laya.stage.timer.clear(this,this.ac0);
        }
    }

    private ac0():void{
        if(this.normalizedTime >=1){
            var str = this.acstr_;
            Laya.stage.timer.clear(this,this.ac0);
            this.play(GameAI.Idle);
            this.event(Game.Event_PlayStop,str);            
        }
    }

    public get normalizedTime():number{
        return this.ani_.getCurrentAnimatorPlayState().normalizedTime;
    }

    public rotation(n:number):void{
        //this.sp3d_.transform.localRotationEulerY = (n+Math.PI/2)/Math.PI*180;
         var nn = n;
         nn = Math.atan2( Math.sin(nn)*2,Math.cos(nn) );
         this.sp3d_.transform.localRotationEulerY = (nn+Math.PI/2)/Math.PI*180;

        this.facen3d_ = n;
        this.facen2d_ = (2*Math.PI - n);
    }

    public get pos2():Laya.Vector3{
        return this._pos2;
    }

    public pos2To3d():void{
        //2D转3D坐标 给主角模型
        this.sp3d_.transform.localPositionX = this._pos2.x / GameBG.ww;
        this.sp3d_.transform.localPositionZ = this._pos2.z * 2 / GameBG.ww;
        this.hbox_.setXY(GameBG.mcx + this._pos2.x,GameBG.mcy + this._pos2.z);
        if(this.sp2d_){
            this.sp2d_.x = this.hbox_.x;
            this.sp2d_.y = this.hbox_.y;
        }        
    }

    public get z():number{
        return this.sp3d_.transform.localPositionZ;
    }
    
    public move2D(n:number,hd:boolean=true):boolean{
        this.moven2d_ = n;        
        if(this.movef){
            return this.movef.move2d(n,this,this.speed);
        }
        return false;
    }

    public setXY2D(xx:number,yy:number):void{
        //2D移动计算
        this.pos2.x = xx;
        this.pos2.z = yy;
        this.pos2To3d();
    }

    public setXY2DBox(xx:number,yy:number):void{
        //2D移动计算
        this.hbox_.setXY(xx,yy);
        //(this.pp.x-pro.hbox.ww/2-GameBG.mcx,this.pp.y-GameBG.mcy-pro.hbox.ww/2)
        this.pos2.x = this.hbox_.x-GameBG.mcx;
        this.pos2.z = this.hbox_.y-GameBG.mcy;
        this.pos2To3d();
    }

    public startAi():void{        
        Laya.stage.frameLoop(1,this,this.ai);
        if(this.gameAI){
            this.gameAI.starAi();
        }
    }

    public stopAi():void{        
        Laya.stage.timer.clear(this,this.ai);
        if(this.gameAI){
            this.gameAI.stopAi();
        }
    }

    public ai():void{
        if(this.gameAI){
            this.gameAI.exeAI(this);
        }        
    }

    public get gamedata():GameData{
        return this.gamedata_;
    }

    /**

    private nn:number = 0;

    public startBull(nn:number):void{
        this.nn = nn;
        Laya.stage.frameLoop(1,this,this.bullAi0);
    }

    public bullAi0():void{
        this.move2D(this.nn);
    }

    public startAi():void{
        this.play("JumpAttack");
        this.ac = 1;
        this.cd = 30;
        Laya.stage.frameLoop(1,this,this.ai);
    }



    public stopAi():void{
        Laya.stage.timer.clear(this,this.ai);
    }

    private ac:number = 0;
    private cd:number = 120;

    private ai():void{
        // this.cd--
        // if(this.cd<=0){
        //     this.play("JumpAttack");
        //     this.ac = 1;
        //     this.cd = 200;
        // }

        if(this.ac == 1){
            if(this.ain_.getCurrentAnimatorPlayState().normalizedTime >=1){
                this.play("Idle");
                this.ac = 0;
            }
        }else{
            if(this.cd<=0){
                this.play("JumpAttack");
                this.ac = 1;
                this.cd = 30;
            }else{
                this.cd-=1;
            }
        }    

    }

    private ain:number = 0;

    private ai0():void{
        if(Math.random()< (1/120) ){
            this.ain =  ( (Math.PI*2) * Math.random() );

            var n = Math.atan2( -1 * Math.sin(this.ain) , Math.cos(this.ain) );
            this.rotation((n+Math.PI/2)/Math.PI*180);
            this.play("FlyForward");    
        }
        if( !this.move2D(this.ain) ){
            this.play("Idle");
        }
    }

     */
}