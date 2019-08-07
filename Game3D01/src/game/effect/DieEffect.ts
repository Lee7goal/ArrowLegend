import MonsterBullet from "../player/MonsterBullet";
import Game from "../Game";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import CoinEffect from "./CoinEffect";

export default class DieEffect{
    static TAG:string = "DieEffect";

    public sp3d:Laya.Sprite3D;
    constructor() {
        this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/monsterDie/monster.lh"));
        this.sp3d.transform.localRotationEulerY = 45;
        Game.monsterResClones.push(this.sp3d);
        // console.log("创建新的死亡特效");
    }

    static addEffect(player:GamePro):DieEffect
    {
        // let effect:DieEffect = Laya.Pool.getItemByClass(DieEffect.TAG,DieEffect);
        let effect:DieEffect = new DieEffect();
        Game.layer3d.addChild(effect.sp3d);
        effect.sp3d.transform.localPosition = player.sp3d.transform.localPosition;
        setTimeout(() => {
            effect.recover();
        }, 1000);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        // Laya.Pool.recover(DieEffect.TAG,this);
        if (Game.map0.Eharr.length == 0)  {
            CoinEffect.fly();
        }
    }
}