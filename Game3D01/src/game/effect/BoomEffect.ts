import MonsterBullet from "../player/MonsterBullet";
import Game from "../Game";
import GamePro from "../GamePro";

export default class BoomEffect{
    static TAG:string = "BoomEffect";

    public pro: GamePro;
    public effectId:number = 0;
    public sp3d:Laya.Sprite3D;
    constructor() {

    }

    static getEffect(pro: GamePro,effectId:number):BoomEffect
    {
        let effect:BoomEffect = Laya.Pool.getItemByClass(BoomEffect.TAG + effectId,BoomEffect);
        if(!effect.pro || effect.effectId != effectId)
        {
            effect.pro = pro;
            effect.effectId = effectId;
            effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + effectId + "/monster.lh"));
            // console.log("创建新的怪物子弹爆炸特效");
        }
        effect.sp3d.transform.localPosition = pro.sp3d.transform.localPosition;
        effect.sp3d.transform.localRotationEulerX = 45;
        Game.layer3d.addChild(effect.sp3d);
        setTimeout(() => {
            effect.recover();
        }, 1000);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(BoomEffect.TAG + this.effectId,this)
    }
}