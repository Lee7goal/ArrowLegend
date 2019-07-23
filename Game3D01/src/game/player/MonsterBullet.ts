import GamePro from "../GamePro";
import GameProType from "../GameProType";
import SysBullet from "../../main/sys/SysBullet";
import MonsterBulletAI from "../ai/MonsterBulletAI";
import MonsterBulletMove from "../move/MonsterBulletMove";
import Game from "../Game";
import { ui } from "./../../ui/layaMaxUI";

export default class MonsterBullet extends GamePro {
    static TAG: string = "MonsterBullet";
    public curLen: number;
    public moveLen: number;
    public sysBullet: SysBullet;
    constructor() {
        super(GameProType.MonstorArrow);
        this.setGameMove(new MonsterBulletMove());
        this.setGameAi(new MonsterBulletAI(this));
        this._bulletShadow = new ui.test.BulletShadowUI();
        Game.footLayer.addChild(this._bulletShadow);
        this.setShadowSize(19);
    }

    setBubble(sb: SysBullet): void {
        var bullet: Laya.Sprite3D;
        bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + sb.bulletMode + "/monster.lh"))) as Laya.Sprite3D;
        this.setSp3d(bullet);
        this.sysBullet = sb;
        this.gamedata.bounce = sb.ejectionNum;
    }

    static getBullet(): MonsterBullet  {
        let bullet: MonsterBullet;
        // bullet = Laya.Pool.getItemByClass(MonsterBullet.TAG,MonsterBullet);
        bullet = new MonsterBullet();
        return bullet;
    }

    die(): void  {
        this.stopAi();
        this._bulletShadow && this._bulletShadow.removeSelf();
        Laya.timer.frameOnce(20, this, () => {
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
        })
        Laya.Pool.recover(MonsterBullet.TAG, this);
    }
}