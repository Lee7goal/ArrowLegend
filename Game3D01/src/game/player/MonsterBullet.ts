import GamePro from "../GamePro";
import GameProType from "../GameProType";
import SysBullet from "../../main/sys/SysBullet";
import MonsterBulletAI from "../ai/MonsterBulletAI";
import MonsterBulletMove from "../move/MonsterBulletMove";
import Game from "../Game";
import { ui } from "./../../ui/layaMaxUI";
import BulletRotateScript from "../controllerScript/BulletRotateScript";

export default class MonsterBullet extends GamePro {
    static TAG: string = "MonsterBullet";
    static count:number = 0;
    public curLen: number;
    public moveLen: number;
    public sysBullet: SysBullet;

    private bullet3d: Laya.Sprite3D;
    constructor() {
        super(GameProType.MonstorArrow);
        this.setGameMove(new MonsterBulletMove());
        this.setGameAi(new MonsterBulletAI(this));
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
        this.setShadowSize(19);
    }

    setBubble(sb: SysBullet): void {
        if (sb == null)  {
            console.error('这个子弹有问题');
            return;
        }
        if(sb.bulletMode == 10004 || sb.bulletMode == 10005)
        {
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        else{
            Game.footLayer.addChild(this._bulletShadow);
        }
        
        // if (this.sysBullet && this.sysBullet.bulletMode == sb.bulletMode)  {
        //     return;
        // }
        this.sysBullet = sb;
        var bullet: Laya.Sprite3D;
        bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + sb.bulletMode + "/monster.lh"))) as Laya.Sprite3D;
        // Game.monsterResClones.push(bullet);
        this.setSp3d(bullet);
        this.gamedata.bounce = sb.ejectionNum;
        // Laya.timer.frameLoop(5,this,()=>{
        //     let trail:Laya.TrailSprite3D = <Laya.TrailSprite3D>this.sp3d.getChildAt(0).getChildAt(1);
        //     trail.trailFilter.time = 0.3;
        // })
        
        // console.log("创建新的怪物子弹");
    }

    static getBullet(sb: SysBullet): MonsterBullet {
        // let bullet: MonsterBullet = new MonsterBullet();
        // let bullet: MonsterBullet = Laya.Pool.getItemByClass(MonsterBullet.TAG + sb.bulletMode, MonsterBullet);
        let bullet: MonsterBullet = Laya.Pool.getItemByClass(MonsterBullet.TAG, MonsterBullet);
        bullet.isDie = false;
        bullet.setBubble(sb);
        return bullet;
    }

    die(): void {
        if (this.isDie)  {
            return;
        }
        this.isDie = true;
        this.curLen = null;
        this.moveLen = null;
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        // this.sp3d && this.sp3d.removeSelf();
        // let trail:Laya.TrailSprite3D = <Laya.TrailSprite3D>this.sp3d.getChildAt(0).getChildAt(1);
        // trail.trailFilter.time = 0;
        this.sp3d.transform.localPositionY = -500;
        this.sp3d.transform.localPositionZ = -500;

        // Laya.Pool.recover(MonsterBullet.TAG + this.sysBullet.bulletMode,this);
        Laya.Pool.recover(MonsterBullet.TAG,this);
    }
}