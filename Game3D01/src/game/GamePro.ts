import GameHitBox from "./GameHitBox";
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;
import GameBG from "./GameBG";
import Game from "./Game";
import GameData from "./GameData";
import HeroBlood from "./HeroBlood";
import FootCircle from "./FootCircle";
import GameProType from "./GameProType";
import Blood from "./Blood";
import SysEnemy from "../main/sys/SysEnemy";
import SysBullet from "../main/sys/SysBullet";
import { GameAI } from "./ai/GameAI";
import { GameMove } from "./move/GameMove";
import { ui } from "./../ui/layaMaxUI";

export default class GamePro extends Laya.EventDispatcher {
    public isDie:boolean;
    public hurtValue: number = 1;
    //  id  :number;
    //  name:String;
    private gamedata_: GameData;
    private movef: GameMove;
    private gameAI: GameAI;

    private speed_: number = 6;
    private hbox_: GameHitBox;
    private sp2d_: Laya.Sprite;
    private _pos2: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private sp3d_: Sprite3D;
    private ani_: Animator;
    private moven2d_: number;
    private facen2d_: number;
    private facen3d_: number;
    private acstr_: string = "";

    private _bloodUI: Blood;
    private _footCircle: FootCircle;
    public _bulletShadow: ui.test.BulletShadowUI;
    private rotationEulerY: number = 0;
    /**关键帧比例0.0-1.0 */
    private keyNum: number = -1;//关键帧比例0.0-1.0
    constructor(proType_: number, hp: number = 600) {
        super();
        this.gamedata_ = new GameData();
        this.gamedata_.hp = this.gamedata_.maxhp = hp;
        this.gamedata_.proType = proType_;
        this.rotationEulerY = 0;
    }

    public setShadowSize(ww:number):void
    {
        this._bulletShadow && this._bulletShadow.img.size(ww,ww);
    }

    public removeShodow(): void {
        this._bulletShadow && this._bulletShadow.removeSelf();
    }

    public get bloodUI(): Blood {
        return this._bloodUI;
    }

    public setKeyNum(n: number): void {
        this.keyNum = n;
    }

    public initBlood(hp:number): void {
        this.gamedata.hp = this.gamedata.maxhp = hp;
        if (!this._bloodUI) {
            this._bloodUI = new Blood();
        }
        this._bloodUI.init(this.gamedata_);
        Game.bloodLayer.addChild(this._bloodUI);
        this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 90);
    }

    public addFootCircle(): void {
        if (!this._footCircle) {
            this._footCircle = new FootCircle();
        }
        Game.footLayer.addChild(this._footCircle);
        this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
    }

    public hurt(hurt: number): void {
        this._bloodUI && this._bloodUI.update(hurt);
    }

   

    die(): void {
        this.play(GameAI.Die);
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
            Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
        }
    }

    public setSp3d(sp: Sprite3D): void {
        this.sp3d_ = sp;
        this.sp3d_.transform.localRotationEulerY = this.rotationEulerY = 0;
        this.hbox_ = new GameHitBox(GameBG.mw, GameBG.mw);
        this.hbox_.linkPro_ = this;
        this.hbox_.setCenter(GameBG.mcx, GameBG.mcy);
        let aniSprite3d = sp.getChildAt(0) as Sprite3D;
        if (aniSprite3d) {
            this.ani_ = aniSprite3d.getComponent(Laya.Animator) as Animator;
        }

        this.on(Game.Event_Hit, this, this.hit);
    }

    public get animator(): Animator {
        return this.ani_;
    }

    public addSprite3DToChild(childName: string, sprite3d: Sprite3D): Sprite3D {
        var ss = this.sp3d.getChildAt(0).getChildByName(childName);
        return ss.addChild(sprite3d) as Sprite3D;
    }

    private weapon: Laya.Sprite3D;
    public addWeapon(): void {
        this.weapon = Laya.loader.getRes("h5/gong/hero.lh");
        this.addSprite3DToAvatarNode("joint14", this.weapon);
    }

    public addSprite3DToAvatarNode(nodeName: string, sprite3d: Sprite3D): void {
        var bool:boolean = this.ani_.linkSprite3DToAvatarNode(nodeName, sprite3d);
        console.log("是否挂成功",bool,nodeName);
        // return Game.layer3d.addChild(sprite3d) as Sprite3D;
    }

    public removeSprite3DToAvatarNode(s3d: Sprite3D): void {
        this.ani_ && this.ani_.unLinkSprite3DToAvatarNode(s3d);
    }

    /**被攻击 */
    private hit(pro: any): void {
        // var a:GamePro = <GamePro>pro;
        // console.log("a " , a);
        if (this.gameAI) {
            this.gameAI.hit(pro);
        }
    }

    /**近战伤害 */
    public closeCombat(pro: GamePro): void {

    }


    public get acstr(): string {
        return this.acstr_;
    }

    public get face2d(): number {
        return this.facen2d_;
    }

    public get face3d(): number {
        return this.facen3d_;
    }

    public get speed(): number {
        return this.speed_;
    }

    public setSpeed(speed: number): void {
        this.speed_ = speed;
    }

    public setGameMove(gamemove: GameMove) {
        this.movef = gamemove;
    }

    public setGameAi(gameAI: GameAI): GameAI {
        this.gameAI = gameAI;
        return this.gameAI;
    }

    public getGameAi(): GameAI {
        return this.gameAI;
    }

    public get hbox(): GameHitBox {
        if (!this.hbox_) {
            this.hbox_ = new GameHitBox(GameBG.mw, GameBG.mw);
            this.hbox_.setXY(GameBG.mcx, GameBG.mcy);
        }
        return this.hbox_
    }

    public get sp2d(): Laya.Sprite {
        if (!this.sp2d_) {
            this.sp2d_ = new Laya.Sprite();
            this.sp2d.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, null, 0xfff000);
            this.sp2d.x = this.hbox.x;
            this.sp2d.y = this.hbox.y;
        }
        return this.sp2d_;
    }

    public get sp3d(): Laya.Sprite3D {
        return this.sp3d_;
    }

    public play(actionstr: string): void {
        if (this.acstr == GameAI.Die) {
            return;
        }

        this.acstr_ = actionstr;
        this.ani_.play(actionstr);

        if (this.gamedata_.proType == GameProType.RockGolem_Blue)  {
            if (actionstr == "Idle")  {
                // console.log("怪的动作",actionstr);
            }
        }

        // if (actionstr == GameAI.NormalAttack && this.gamedata_.proType == GameProType.Hero) {
        //     setTimeout(() => {
        //         let eff: Laya.Sprite3D = Laya.loader.getRes("h5/gunEffect/hero.lh");
        //         this.weapon.addChild(eff);
        //         setTimeout(() => {
        //             eff.removeSelf();
        //         }, 400);
        //     }, 300);
        // }

        //this.ani_.speed = 1;
        //console.log( this.acstr , " : " , this.ani_.getCurrentAnimatorPlayState);
        if (this.acstr != GameAI.Run && this.acstr != GameAI.Idle && this.acstr != GameAI.Die) {
            Laya.stage.frameLoop(1, this, this.ac0);
        } else {
            Laya.stage.timer.clear(this, this.ac0);
        }
    }

    private ac0(): void {
        if (this.normalizedTime >= 1) {
            var str = this.acstr_;
            Laya.stage.timer.clear(this, this.ac0);
            this.play(GameAI.Idle);
            this.event(Game.Event_PlayStop, str);
        }
    }

    private ac1(): void {
        if (this.keyNum >= 0 && this.normalizedTime >= this.keyNum) {
            this.event(Game.Event_KeyNum, this.keyNum);
            this.keyNum = -1;
        }
    }

    public get normalizedTime(): number {
        return this.ani_.getCurrentAnimatorPlayState().normalizedTime;
    }

    public rotation(n: number): void {
        if (!n) {
            return;
        }
        if (this.gamedata.hp <= 0) {
            return;
        }

        this.facen3d_ = n;
        this.facen2d_ = (2 * Math.PI - n);
        var nn = Math.atan2(Math.sin(n) / Game.cameraCN.cos0, Math.cos(n));
        nn = ((nn + Math.PI / 2) / Math.PI * 180)

        var ey = Math.round(nn);
        if (ey >= 360) {
            while (ey >= 360) {
                ey -= 360;
            }
        }
        else if (ey < 0) {
            while (ey < 0) {
                ey += 360;
            }
        }

        if (this.gamedata_.rspeed <= 0) {//瞬间转身
            this.sp3d_.transform.localRotationEulerY = ey;
            this.rotationEulerY = this.sp3d_.transform.localRotationEulerY;
            return;
        }



        //逐帧转身
        if (this.rotationEulerY != ey) {
            this.rotationEulerY = ey;
            if (this.sp3d_.transform.localRotationEulerY >= 360) {
                while (this.sp3d_.transform.localRotationEulerY >= 360) {
                    this.sp3d_.transform.localRotationEulerY -= 360;
                }
            }
            else if (this.sp3d_.transform.localRotationEulerY < 0) {
                while (this.sp3d_.transform.localRotationEulerY < 0) {
                    this.sp3d_.transform.localRotationEulerY += 360;
                }
            }
        }
    }

    public ai(): void {
        this.ac1();

        //按照达叔的视觉要求 修正人物跑步动作的播放速度
        if (this.animator && this.animator.speed > 0 && this.gamedata_.proType == GameProType.Hero) {
            if (this.acstr_ == GameAI.Run) {
                if (this.animator.speed == 1) {
                    this.animator.speed = (this.speed_ / 3);
                }
            } else {
                if (this.animator.speed != 1) {
                    this.animator.speed = 1;
                }
            }
        }

        if (this.gameAI) {
            this.gameAI.exeAI(this);
        }

        if (this.rotationEulerY == this.sp3d_.transform.localRotationEulerY) {
            return;
        }

        //用华达公式计算转向方向 并转动模型
        for (let i = 0; i < this.gamedata_.rspeed; i++) {
            //var n = this.sp3d_.transform.localRotationEulerY - this.rotationEulerY;
            var n = this.rotationEulerY - this.sp3d_.transform.localRotationEulerY;
            if (n == 0) {
                break;
            }
            else if ((n > 0 && n <= 180) || (n < -180)) {
                this.sp3d_.transform.localRotationEulerY += 1;
            } else {
                this.sp3d_.transform.localRotationEulerY -= 1;
            }

            while (this.sp3d_.transform.localRotationEulerY >= 360) {
                this.sp3d_.transform.localRotationEulerY -= 360;
            }
            while (this.sp3d_.transform.localRotationEulerY < 0) {
                this.sp3d_.transform.localRotationEulerY += 360;
            }
        }

    }




    public get pos2(): Laya.Vector3 {
        return this._pos2;
    }

    
    public pos2To3d(): void {
        //2D转3D坐标 给主角模型
        this.sp3d_.transform.localPositionX = this._pos2.x / GameBG.ww;
        this.sp3d_.transform.localPositionZ = this._pos2.z / Game.cameraCN.cos0 / GameBG.ww;
        this.hbox_.setXY(GameBG.mcx + this._pos2.x, GameBG.mcy + this._pos2.z);
        if (this.sp2d_) {
            this.sp2d_.x = this.hbox_.x;
            this.sp2d_.y = this.hbox_.y;
        }
        this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 90);
        this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
        this._bulletShadow && this._bulletShadow.pos(this.hbox_.cx, this.hbox_.cy);
    }

    public get z(): number {
        return this.sp3d_.transform.localPositionZ;
    }

    public move2D(n: number, hd: boolean = true): boolean {
        this.moven2d_ = n;
        if (this.movef) {
            return this.movef.move2d(n, this, this.speed);
        }
        return false;
    }

    public setXY2D(xx: number, yy: number): void {
        //2D移动计算
        this.pos2.x = xx;
        this.pos2.z = yy;
        this.pos2To3d();
    }

    public setXY2DBox(xx: number, yy: number): void {
        //2D移动计算
        this.hbox_.setXY(xx, yy);
        //(this.pp.x-pro.hbox.ww/2-GameBG.mcx,this.pp.y-GameBG.mcy-pro.hbox.ww/2)
        this.pos2.x = this.hbox_.x - GameBG.mcx;
        this.pos2.z = this.hbox_.y - GameBG.mcy;
        this.pos2To3d();
    }

    public startAi(): void {
        //Laya.stage.frameLoop(1, this, this.ai);
        if (this.gameAI) {
            this.gameAI.starAi();
            if (Game.AiArr.indexOf(this) < 0) {
                Game.AiArr.push(this);
            }
        }
    }

    public stopAi(): void {
        //Laya.stage.timer.clear(this, this.ai);
        if (this.gameAI) {
            this.gameAI.stopAi();
        }
        var index: number = Game.AiArr.indexOf(this);
        if (index > -1) {
            Game.AiArr.slice(index, 1);
        }
    }


    public get gamedata(): GameData {
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