import MonsterBullet from "../player/MonsterBullet";
import Game from "../Game";
import GamePro from "../GamePro";

/**打到怪物身上的特效 */
export default class MonsterBoomEffect{
    static TAG:string = "MonsterBoomEffect";
    public sp3d:Laya.Sprite3D;
    public player:GamePro;
    constructor() {
        this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/boom/monster.lh"));
        Game.monsterResClones.push(this.sp3d);
    }

    static addEffect(pro: GamePro):MonsterBoomEffect
    {
        let effect:MonsterBoomEffect = Laya.Pool.getItemByClass(MonsterBoomEffect.TAG,MonsterBoomEffect);
        // let effect:MonsterBoomEffect = new MonsterBoomEffect();
        effect.player = pro;
        effect.player.sp3d.addChild(effect.sp3d);

        setTimeout(() => {
            effect.recover();
        }, 1000);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(MonsterBoomEffect.TAG,this);
    }
}