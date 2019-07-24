import MonsterBullet from "../player/MonsterBullet";
import Game from "../Game";

export default class BoomEffect{
    static TAG:string = "BoomEffect";

    public bullet:MonsterBullet;
    public sp3d:Laya.Sprite3D;
    constructor() {

    }

    static getEffect(bullet: MonsterBullet):BoomEffect
    {
        let effect:BoomEffect = Laya.Pool.getItemByClass(BoomEffect.TAG + bullet.sysBullet.boomEffect,BoomEffect);
        if(!effect.bullet || effect.bullet.sysBullet.boomEffect != bullet.sysBullet.boomEffect)
        {
            effect.bullet = bullet;
            effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + bullet.sysBullet.boomEffect + "/monster.lh"));
            // console.log("创建新的怪物子弹爆炸特效");
        }
        effect.sp3d.transform.localPosition = bullet.sp3d.transform.localPosition;
        Game.layer3d.addChild(effect.sp3d);
        setTimeout(() => {
            effect.recover();
        }, 500);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(BoomEffect.TAG + this.bullet.sysBullet.boomEffect,this)
    }
}