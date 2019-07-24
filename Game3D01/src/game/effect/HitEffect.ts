import MonsterBullet from "../player/MonsterBullet";
import Game from "../Game";
import GamePro from "../GamePro";
import GameProType from "../GameProType";

export default class HitEffect{
    static TAG:string = "HitEffect";

    public sp3d:Laya.Sprite3D;
    constructor() {
        this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/20000/monster.lh"));
        // console.log("创建新的受击特效");
    }

    static addEffect(player:GamePro):HitEffect
    {
        let effect:HitEffect = Laya.Pool.getItemByClass(HitEffect.TAG,HitEffect);
        player.addSprite3DToAvatarNode(player.gamedata.proType == GameProType.Hero ? "joint2" : "guadian", effect.sp3d);
        setTimeout(() => {
            effect.recover();
        }, 800);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(HitEffect.TAG,this);
    }
}